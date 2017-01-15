/*
* Plugin de UNO
* Creado por: Sparkychild.
*/

'use strict';

const games = {};

const util = require('util');
const DEFAULT_DECK = require('./custom-data/deck.json');

const COLOR_NAMES = new Map([
	['R', 'red'],
	['Y', 'yellow'],
	['B', 'blue'],
	['G', 'green'],
	['W', 'black'],
]);
const COLOR_NAMES_LOCALE = new Map([
	['R', 'red'],
	['Y', 'yellow'],
	['B', 'blue'],
	['G', 'green'],
	['W', 'black'],
]);

const INACTIVE_TIMEOUT = 90 * 1000;

const DRAW_BUTTON = '<div style="text-align:center"><button style="background: #FFAF4B; border: 2px solid #FFAF4B ; width: 56px ; border-radius: 5px , auto" name="send" value="/uno draw"><span style="color:white">Pedir</span></button></div>';
const PASS_BUTTON = '<div style="text-align:center"><button style="background: #FFAF4B; border: 2px solid #FFAF4B ; width: 56px ; border-radius: 5px , auto" name="send" value="/uno pass"><span style="color:white">Pasar</span></button></div>';

const WW_FACE = '<div style="background:#FFF;border-radius: 40px 5px 40px 5px;width:43px 10px;height:43px;padding-top:10px;padding-left:1px;padding.right:5px" ><img src="https://play.pandorashowdown.net/resources/hotlink-ok/color-wheel.png" height="27" width="27"></div>';
const VALUE_FACE = '<div style="background:#FFF;border-radius: 40px 5px 40px 5px;width:43px 10px;height:43px;padding-top:10px;padding-bottom:5px;padding-left:1px;padding.right:5px" ><font color="%s" size="6">%s</font></div>';

function evalUno(target, room, user, connection) {
	/* eslint-disable no-unused-vars */
	const battle = room.battle;
	const me = user;
	return eval(target);
	/* eslint-enable no-unused-vars */
}

function buildCard(id, noPlay) {
	const value = id.slice(1);
	const bgColor = COLOR_NAMES.get(id.charAt(0));
	const playableBit = noPlay ? '' : ` name="send" value="/uno play ${id}"`;

	const buttonFace = value === 'W' ? WW_FACE : util.format(VALUE_FACE, bgColor, value);
	const button = `<button style="background:${bgColor}; border:5px solid #FFFFFF; height:80px; width:61px; border-radius:5px,auto; color:${bgColor}"${playableBit}>${buttonFace}</button>`;
	return button;
}

function buildHand(array, noPlay) {
	const cardsByColor = [].concat.apply([], Object.values(array.groupBy(code => code.charAt(0))).map(color => color.sort()));
	return cardsByColor.map(card => buildCard(card, noPlay)).join("&nbsp;");
}

function getMyHand(hand) {
	const html = (
		'<div class=\"games\">' +
		'<center><font color="#FFFFFF"><h3>Your cards:</h3></font>' + buildHand(hand) + '<br></center>' +
		'<br></div>'
	);
	return html;
}

function getColourChange(cmd, hand, id) {
	const html = (
		'<center><table style="border-collapse: collapse;">' +
		'<tr>' + (
			'<td style=\"background:#FFAF4B;border-radius:5px 0px 0px 0px\"><center><h3><font color=\"#FFFFF\">Choose a color:</font></h3>' +
			'<button style="background: red; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 80px ; border-radius: 5px , auto" name="send" value="' + cmd + ' R"><font color="white" size=4>Red</font></button>' +
			'<button style="background: yellow; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 80px ; border-radius: 5px , auto" name="send" value="' + cmd + ' Y"><font color="black" size=3>Yellow</font></button>' +
			'<button style="background: blue; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 80px ; border-radius: 5px , auto" name="send" value="' + cmd + ' B"><font color="white" size=4>Blue</font></button>' +
			'<button style="background: green; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 80px ; border-radius: 5px , auto" name="send" value="' + cmd + ' G"><font color="white" size=4>Green</font></button>' +
			'</td>'
		) + '</tr>' +
		'<tr>' + (
			'<td style=\"background:#000000;color:#FFFFFF\">' +
			'<center><h3>Your cards: </h3>' + buildHand(hand, true) + '<br>' +
			'</td>'
		) + '</tr>' +
		'</table></center>'
	);
	return `|uhtmlchange|${id}|${html}`;
}

function getCardName(id) {
	const color = COLOR_NAMES.get(id.charAt(0));
	const localeColor = COLOR_NAMES_LOCALE.get(id.charAt(0)).capitalize();
	const isSpecialCard = id.endsWith('R') || id.endsWith('S') || id.endsWith('+2') || id === 'W+4' || id === 'WW';

	if (!isSpecialCard) return `<span style="color:${color}">${localeColor} ${id.slice(1)}</span>`;
	if (id === 'W+4') return `<span style="color:${color}">Pick up 4 wild card</span>`;
	if (id === 'WW') return `<span style="color:${color}">Change color card</span>`;
	if (id.endsWith('+2')) return `<span style="color:${color}">Pick up 2 card ${localeColor.replace(/o$/, 'a')}</span>`;
	if (id.endsWith('R')) return `<span style="color:${color}">Reverse Card ${localeColor.replace(/o$/, 'a')}</span>`;
	if (id.endsWith('S')) return `<span style="color:${color}">Skip Card ${localeColor.replace(/o$/, 'a')}</span>`;
	return `<span style="color:red">Card not identified</span>`;
}

function playVerifier(topCard, card, hand, change, special) {
	//this function returns false if there is nothing wrong;
	if (special) {
		if (card !== special) return "!ONE MOMENT! You must play the card that you picked up (" + getCardName(special) + "). If you have no moves press the pass button";
	}
	let currentColour = change || topCard.charAt(0);
	let currentValue = topCard.slice(1);
	if (hand.indexOf(card) === -1) return "You do not have that card";
	if (card === "W+4") {
		for (let i = 0; i < hand.length; i++) {
			if (hand[i].charAt(0) === currentColour) return "You cannot play this card becuase you still have one the same color as the previous card.";
		}
		return false;
	}
	if (card === "WW") return false;
	if (card.charAt(0) === currentColour || card.slice(1) === currentValue) return false;
	return "You cannot play this card, remember the card color or number must match.";
}

function verifyAlts(user, playerList) {
	for (const maybeAlt of playerList.map(player => Users.get(player))) {
		if (maybeAlt && maybeAlt.latestIp === user.latestIp) {
			return false;
		}
	}
	return true;
}

function initDeck(playerCount) {
	playerCount = Math.ceil(playerCount / 7);
	let tDeck = [];
	for (let i = 0; i < playerCount; i++) {
		tDeck = tDeck.concat(DEFAULT_DECK);
	}
	return tDeck;
}

class Game {
	constructor(roomId, options) {
		this.room = roomId;
		this.data = {};
		this.playerList = [];
		this.top = null;
		this.player = null;
		this.started = false;
		this.change = null;
		this.deck = null;
		this.discard = [];
		this.lastDraw = null;
		this.turn = 0;
		this.controlsId = 'uno-' + ~~(Math.random() * 1000000) + '-' + 0; // for players
		this.postId = 0; // for spectators
		this.lastplay = null;
		this.host = options.host;
		this.places = options.maxPlayers;

		this.timeOut = {
			disabled: false,
			duration: INACTIVE_TIMEOUT,
		};

		Object.assign(this, options);

		games[roomId] = this;
	}

	getTopCard() {
		if (!this.top) return "UH OH!";
		const currentColorCode = this.change;
		const currentColor = COLOR_NAMES.get(currentColorCode);
		const cardMarkup = buildCard(this.top, true);
		if (!currentColorCode) return cardMarkup;
		return `${cardMarkup}<br /><font color="#FFFFFF">Color actual:</font> <span style="color:${currentColor}">${currentColor.toUpperCase()}</span>`;
	}

	buildGameScreen(user, uhtmlid, message, pass) {
		let html = (message ? "|uhtmlchange|" + uhtmlid : "|uhtml|" + uhtmlid) + "|";
		let topCard = "<center>" + this.getTopCard() + "</center>";
		let yourHand = buildHand(this.data[user]);
		message = message ? `<strong style="color:red">${message}</strong>` : '';
		return html + "<center><table style=\"border-collapse: collapse;\"><tr><td style=\"background:#FFAF4B;border-radius:5px 0px 0px 0px;padding-top:8px;padding-bottom:8px\"><center><font color=\"#FFFFFF\"><strong>Table</strong>&nbsp;</td><td style=\"background:#FFAF4B;border-radius:0px 5px 0px 0px;color:#FFFFFF\"><center><font color=\"#FFFFFF\"><strong>Your cards</strong>&nbsp;</td></tr>" + "<tr><td style=\"background:#000000\"><center>" + topCard + "</center></td><td style=\"background:#000000;\"><center><br>" + yourHand + "</td></tr><tr><td style=\"background:#000000;color:#FFFFFF\">" + (pass ? PASS_BUTTON : DRAW_BUTTON) + "</td><td style=\"background:#000000;\">" + message + "</td></tr></table></center>";
	}

	initTopCard() {
		this.top = this.deck.shift();
		this.discard.push(this.top);
	}

	notifyCreation() {
		const room = Rooms.get(this.room);
		if (!room) return;

		if (this.places >= 2 && Number.isFinite(this.places)) {
			room.addRaw("<div class=\"games\"><center><strong>" + Plugins.Colors.apply(this.host) + "</strong> has started a new game of UNO.<br><em>You can now join the game.<br>(Size: " + this.places + " players)</em><br><button name=\"send\" value=\"/uno join\">Join</button> <button name=\"send\" value=\"/uno leave\">Leave</button> <button name=\"send\" value=\"/uno\">How to play</button></center></div>");
		} else {
			room.addRaw("<div class=\"games\"><center><strong>" + Plugins.Colors.apply(this.host) + "</strong> has started a new game of UNO.<br><em>You can now join the game.<br>(Size: Unlimited)</em><br><button name=\"send\" value=\"/uno join\">Join</button> <button name=\"send\" value=\"/uno leave\">Leave</button> <button name=\"send\" value=\"/uno\">How to play</button></center></div>");
		}
	}

	start() {
		const room = Rooms.get(this.room);
		if (!room) return;

		this.started = this.playerList.length;

		room.addRaw('<h3 style="color:#F0403A;">The game of UNO has begun!</h3>');
		this.deck = Tools.shuffle(initDeck(this.playerList.length).slice());
		this.playerList.forEach(u => this.giveCard(u, 7));

		this.player = this.playerList[~~(Math.random() * this.playerList)];
		room.addRaw('The first player is: <strong>' + Plugins.Colors.apply(this.player) + '</strong>');

		//get top card
		this.initTopCard();
		while (this.top === "WW" || this.top === "W+4") {
			this.initTopCard();
		}
		//announce top card
		room.add("|uhtml|post" + this.postId + "|<strong>The first card is:</strong> " + buildCard(this.top));
		this.lastplay = "|uhtmlchange|post" + this.postId + "|The first card is <strong>" + getCardName(this.top) + "</strong>";
		//add top card to discard pile
		//apply the effects if applicable;
		this.applyEffects(this.player, this.top);
		if (/R$/i.test(this.top)) this.nextPlayer();

		this.initTurn();
	}

	giveCard(userid, times, display) {
		if (!times) times = 1;
		let newCards = [];
		for (let i = 0; i < times; i++) {
			let newCard = this.deck.shift();
			this.data[userid].push(newCard);
			newCards.push(newCard);
			if (this.deck.length === 0) {
				if (this.discard.length === 0) this.discard = initDeck(1);
				this.deck = Tools.shuffle(this.discard.slice());
				this.discard = [];
			}
		}
		if (display) Users(userid).sendTo(this.room, "|raw|You have received the following cards: " + buildHand(newCards, true));
		return newCards;
	}

	nextPlayer(delta) {
		if (typeof delta === 'undefined') delta = 1;

		// Artifice to simplify going from last to first. TODO: Make this a circular linked list.
		const playerList = this.playerList.concat(this.playerList);

		const currentIndex = playerList.indexOf(this.player);
		this.player = playerList[currentIndex + delta];
	}

	applyEffects(userid, card, init) {
		const room = Rooms.get(this.room);
		if (!room) return;

		let effect = card.slice(1);
		switch (effect) {
		case "R":
			this.playerList.reverse();
			if (init) {
				room.add("The direction of turns has been reversed.");
				break;
			} else if (this.playerList.length === 2) {
				this.nextPlayer();
			} else {
				this.nextPlayer(2);
			}
			room.add("The direction of turns has been reversed.");
			break;
		case "S":
			this.nextPlayer();
			room.add("|c| |The turn of " + toUserName(userid) + " has been skipped.");
			break;
		case "+2":
			this.giveCard(userid, 2, true);
			room.add("|c| |The turn of " + toUserName(userid) + " has been skipped and has been given 2 cards.");
			this.nextPlayer();
			break;
		case "+4":
			this.giveCard(userid, 4, true);
			room.add("|c| |The turn of " + toUserName(userid) + " has been skipped and has been given 4 cards.");
			this.nextPlayer();
			break;
		}
	}

	clearDQ() {
		if (!this.timeOut.timer) return;
		clearTimeout(this.timeOut.timer);
		this.timeOut.timer = null;
	}

	dqInactive() {
		this.clearDQ();

		const room = Rooms.get(this.room);
		if (!room) return;

		const playerId = this.player;
		this.nextPlayer();
		this.playerList.splice(this.playerList.indexOf(playerId), 1);
		Users(playerId).sendTo(this.room, "|uhtmlchange|" + this.controlsId + "|");
		delete this.data[playerId];
		this.lastDraw = null;
		if (this.playerList.length === 1) {
			const finalPlayer = this.player;
			room.add(this.lastplay).add("|raw|Congratulations <strong>" + Plugins.Colors.apply(finalPlayer) + "</strong> for winning the game of UNO!").update();
			this.clearDQ();
			this.destroy();
		} else {
			this.initTurn();
		}
	}

	runDQ(dueDate) {
		this.timeOut.timer = setTimeout(() => this.dqInactive(), Math.max(0, dueDate - Date.now()));
	}

	initTurn(repost) {
		const room = Rooms.get(this.room);
		if (!room) return;

		const playerId = this.player;
		this.turn++;
		this.controlsId = this.controlsId.replace(/\-[0-9]+$/, '-' + this.turn);

		// announce the turn
		if (!repost) {
			room.add("|c| |/raw It is the turn of " + Plugins.Colors.apply(playerId) + "!");
			this.lastDraw = null;
			this.runDQ(Date.now() + this.timeOut.duration);
		}
		room.update();

		// show the card control center
		let CCC = this.buildGameScreen(playerId, this.controlsId);
		Users(playerId).sendTo(this.room, CCC);
	}

	destroy() {
		delete games[this.room];
	}
}

exports.Game = Game;

exports.dynamic = {
	games: games,
};

exports.init = function (oldVersion, oldDynamic) {
	if (oldDynamic) {
		for (const id in oldDynamic.games) {
			const game = new Game(null, oldDynamic.games[id]);
			const timeOut = game.timeOut;
			if (timeOut.dueDate) game.runDQ(timeOut.dueDate);
		}
	}
};

exports.deinit = function () {
	for (const id in exports.dynamic.games) {
		const game = exports.dynamic.games[id];
		game.clearDQ();
	}
};

exports.eval = evalUno;

exports.commands = {
	uno: {
		help: '',
		'': function (target, room, user) {
			const userid = user.userid;
			if (games[room.id] && games[room.id].started && userid === games[room.id].player) return this.parse("/uno display");
			this.sendReplyBox(
				"<strong style\"padding-left:25px\">Introduction to the game of UNO:</strong><br><br>" +
				"The mechanism of the Game is simple, each player starts with 7 cards (which are randomly distributed), the game will choose a player to be the first to play, the player must keep in mind that the card to choose must match the Color or the value of the previous card.<br>" +
				"When a player has only one card, he/she will say \"UNO!\" And the other players will do everything possible to add more cards. The player with 0 cards wins." +
				"<hr>" +
			    "<strong style\"padding-left:25px\">Commands:</strong>" +
			    "<div style=\"text-align:right; margin-right:10px;\"><em>Presets with /uno</em></div>" +
			    "<ul><li><em>&mdash; new</em> - Starts a new game of UNO.</li>" +
			    "<li><em>&mdash; join (optional: size)</em> - Joins the game of UNO.</li>" +
			    "<li><em>&mdash; leave</em> - Leaves the game of UNO.</li>" +
			    "<li><em>&mdash; start</em> - Starts the game with the users that have joined.</li>" +
			    "<li><em>&mdash; dq</em> - Disqualifies a user.</li>" +
			    "<li><em>&mdash; end</em> - Ends the game .</li>" +
			    "<li><em>&mdash; getusers</em> - Shows a list of the users participating in the game.</li>" +
			    "<li><em>&mdash; timeout [on|off|time]</em> - Sets the timer to disquialy inactive users. Time is indicated in seconds.</li>" +
			    "<li><em>&mdash; hand</em> - Show your cards even when it is not your turn (you can show it publicly with !).</li>" +
			    "</ul>"
			);
		},
		create: 'new',
		'new': function (target, room, user) {
			if (!this.can('hostgames', null, room)) return false;
			if (games[room.id]) return this.errorReply("There is currently no game.");
			let places = target ? parseInt(target, 10) : null;
			if (places && places < 2) return this.errorReply("The number of players must be greater than 2.");

			const game = new Game(room.id, {
				host: user.userid,
				maxPlayers: target ? parseInt(target, 10) : Infinity,
			});
			game.notifyCreation();
		},
		timeout: function (target, room, user) {
			const game = games[room.id];
			if (!game) return this.errorReply("There is currently no game.");
			if (!target) return this.parse('/help uno timeout');

			if (game.started) {
				if (game.playerList.length > 2 || !game.playerList.includes(user.userid) || game.player === user.userid) {
					return this.errorReply("You cannot set the timer.");
				}
			} else {
				if (!this.can('hostgames', null, room)) return false;
			}

			const targetId = toId(target);
			let targetValue = null;
			if (targetId === 'on' || targetId === 'off') {
				targetValue = targetId === 'on';
			} else if (game.started) {
				return this.errorReply("Indicate if you are going to turn on (ON) or off (OFF) the timer.");
			} else {
				targetValue = parseInt(target, 10);
				if (isNaN(targetValue) || targetValue <= 0 || targetValue > 3600) {
					return this.errorReply("Indicates the seconds for the stopwatch (less than one hour).");
				}
			}

			if (typeof targetValue === 'boolean' && game.timeOut.disabled ^ targetValue) {
				return this.errorReply("The timer was already turned " + (targetValue ? "on" : "off") + ".");
			}

			if (typeof targetValue === 'boolean') {
				game.timeOut.disabled = !targetValue;
				if (game.started) {
					if (game.timeOut.disabled) {
						game.clearDQ();
					} else {
						game.runDQ(Date.now() + game.timeOut.duration);
					}
				}
			} else {
				game.timeOut.duration = targetValue * 1000;
			}

			const actionText = (typeof targetValue === 'boolean' ? (targetValue ? "encendido" : "apagado") : " fijado en " + Chat.toDurationString(game.timeOut.duration)) + " el cronómetro de descalificación";
			room.addRaw(`<div class="games"><strong>${Chat.escapeHTML(user.name)}</strong> ha ${actionText}.</div>`);
		},
		timeouthelp: ["/uno timeout [on|off|tiempo] - Configura el cronómetro de descalificación por inactividad. El tiempo es indicado en segundos."],

		join: function (target, room, user) {
			const game = games[room.id];
			const userid = user.userid;
			if (!game || game.started) return this.errorReply("No hay un juego de Uno en fase de inscripción.");
			if (!verifyAlts(user, game.playerList) || game.playerList.indexOf(userid) > -1) return this.errorReply("One of your alts is already in the game.");
			if (game.places && game.playerList.length >= game.places) {
				return user.sendTo(this.room, "There are no more available spots.");
			}
			// if (game.playerList.length >= 30) return this.errorReply('Ya no quedan plazas disponibles.');
			game.playerList.push(userid);
			game.data[userid] = [];
			room.addRaw(`<strong>${Chat.escapeHTML(user.name)}</strong> has joined the game.`);
			this.sendReply("You have successfully joined.");

			if (game.places && game.playerList.length === game.places) {
				game.start();
			}
		},
		leave: function (target, room, user) {
			const game = games[room.id];
			const userid = user.userid;
			if (!game || game.started) return false;
			if (!game.data[userid]) return false;
			game.playerList.splice(game.playerList.indexOf(userid), 1);
			delete game.data[userid];
			room.addRaw(`<strong>${Chat.escapeHTML(user.name)}</strong> has left the game.`);
		},
		dq: function (target, room, user) {
			const game = games[room.id];
			if (!game || !game.started) return false;
			let targetId = toId(target);
			if (!targetId) return false;
			if (!(targetId in game.data) || !this.can('hostgames', null, room)) return;
			if (game.playerList.length !== 2 && targetId === game.player) {
				game.clearDQ();
				game.nextPlayer();
				game.initTurn(true);
			}
			room.addRaw(`<strong>${Chat.escapeHTML(toUserName(targetId))}</strong> has been disqualified from the game..`);
			game.playerList.splice(game.playerList.indexOf(targetId), 1);
			delete game.data[targetId];
			if (game.playerList.length === 1) {
				//Añadir color de usuario a 'game.playerList[0]'
				room.addRaw(`Congratulations <strong>${Chat.escapeHTML(toUserName(game.playerList[0]))}</strong> for winning the game!`);
				game.clearDQ();
				game.destroy();
			}
		},
		start: function (target, room, user) {
			const game = games[room.id];
			if (!game || game.started) return this.errorReply("No one has started a game of UNO.");
			if (!this.can('hostgames', null, room)) return this.errorReply('You do not have access to this command.');
			if (game.playerList.length < 2) return this.errorReply("There are not enough players to start.");
			game.start();
		},
		play: function (target, room, user) {
			const game = games[room.id];
			const userid = user.userid;
			const parts = target.split(' ');
			if (!game || !game.started || userid !== game.player) return false;
			let issues = playVerifier(game.top, parts[0], game.data[userid], game.change, game.lastDraw);
			if (issues) return user.sendTo(room, game.buildGameScreen(userid, game.controlsId, issues, game.lastDraw));
			if (parts[0].charAt(0) === "W" && (!parts[1] || ["Y", "B", "G", "R"].indexOf(parts[1]) === -1)) return user.sendTo(room.id, getColourChange("/uno play " + parts[0], game.data[userid], game.controlsId));
			game.change = null;

			//apply colour change
			let changedColor = '';
			if (parts[0].charAt(0) === "W") {
				game.change = parts[1];
				changedColor = COLOR_NAMES.get(game.change);
			}
			//make last card less spammy
			this.add(game.lastplay); //set current card and add to discard pile
			game.top = parts[0];
			game.discard.push(parts[0]);
			//remove card from ahnd
			game.data[userid].splice(game.data[userid].indexOf(parts[0]), 1);
			//set next player
			game.nextPlayer();
			//apply the effects of the card
			game.applyEffects(game.player, parts[0]);
			//clear the previous timer
			game.clearDQ();
			user.sendTo(room.id, "|uhtmlchange|" + game.controlsId + "|");
			game.postId++;
			this.add("|uhtml|post" + game.postId + "|<strong>" + Chat.escapeHTML(user.name) + " played the card </strong> " + buildCard(game.top));
			game.lastplay = "|uhtmlchange|post" + game.postId + "|" + Chat.escapeHTML(user.name) + " played the card <strong>" + getCardName(game.top) + "</strong>";
			//check for a winner or UNO
			if (game.data[userid].length === 0) {
				//clear out last card
				this.add(game.lastplay);
				//announce winner
				room.addRaw(`Congratulations <strong>${Chat.escapeHTML(user.name)}</strong> for winning the game!`);
				//end game
				game.destroy();
				return;
			}
			if (game.data[userid].length === 1) {
				room.addRaw('<h3>¡UNO!</h3');
			}
			if (changedColor) room.addRaw('<font color="' + changedColor.replace("yellow", "orange") + '">The color of the hand has been changed to <strong>' + changedColor.toUpperCase() + '</strong></font>.');
			game.initTurn();
		},
		draw: function (target, room, user) {
			const game = games[room.id];
			const userid = user.userid;
			if (!game || !game.started || userid !== game.player) return false;
			if (game.lastDraw) return false;
			let receivedCards = game.giveCard(userid);
			let CCC = game.buildGameScreen(userid, game.controlsId, "Has received a card " + receivedCards.map(getCardName).join("") + ".", true);
			game.lastDraw = receivedCards.join("");
			Users(userid).sendTo(room.id, CCC);
			room.addRaw(`<strong>${Chat.escapeHTML(user.name)}</strong> has decided to draw a card.`);
		},
		display: function (target, room, user) {
			const game = games[room.id];
			const userid = user.userid;
			if (!game || !game.started || userid !== game.player) return false;
			user.sendTo(room.id, "|uhtmlchange|" + game.controlsId + "|");
			game.initTurn(true);
		},
		pass: function (target, room, user) {
			const game = games[room.id];
			const userid = user.userid;
			if (!game || !game.started || userid !== game.player) return false;
			if (!game.lastDraw) return false;
			this.add("|raw|<strong>" + Chat.escapeHTML(user.name) + "</strong> has decided to skip the turn.");
			user.sendTo(room.id, "|uhtmlchange|" + game.controlsId + "|");
			if (game.lastplay) {
				this.add(game.lastplay);
			}
			game.clearDQ();
			game.nextPlayer();
			game.initTurn();
		},
		end: function (target, room, user) {
			const game = games[room.id];
			if (!game || !this.can('hostgames', null, room)) return false;
			if (game.lastplay) this.add(game.lastplay);
			game.clearDQ();
			game.destroy();
			this.add("|raw|<h3 style=\"color:#F0403A;\">" + Chat.escapeHTML(user.name) + " has ended the game.</h3>");
		},
		getusers: function (target, room, user) {
			const game = games[room.id];
			if (!game || !game.playerList) return false;
			if (!this.runBroadcast()) return;
			this.sendReplyBox("<strong>Participants:</strong> <em>(" + game.playerList.length + ")</em><br />" + game.playerList.join(", "));
		},
		hand: function (target, room, user) {
			const game = games[room.id];
			if (!game) return this.errorReply("You cannot see your cards if there is no game in progress.");
			if (!this.runBroadcast()) return;
			const playerData = game.data[user.userid];
			if (!playerData) return this.errorReply("You are not participating in this game.");
			this.sendReply('|raw|' + getMyHand(playerData));
		},
	},
};
