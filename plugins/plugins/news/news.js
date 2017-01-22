/**
Plugins varios
 */
Equ.nameColor = function (name, bold) {
        return (bold ? "<b>" : "") + "<font color=" + Equ.Color(name) + ">" + (Users(name) && Users(name).connected && Users.getExact(name) ? Chat.escapeHTML(Users.getExact(name).name) : Chat.escapeHTML(name)) + "</font>" + (bold ? "</b>" : "");
};
const path = require('path');
const fs = require('fs');
const moment = require('moment');

Equ.tells = {};
try {
	Equ.tells = JSON.parse(fs.readFileSync(DATA_DIR + 'tells.json', 'utf*'));
} catch (e) {}

const MAX_TELLS = 4;
const MAX_TELL_LENGTH = 500;
function isHoster(user) {
	if (!user) return;
	if (typeof user === 'Object') user = user.userid;
	let hoster = Db('hoster').get(toId(user));
	if (hoster === 1) return true;
	return false;
}
function generateNews () {
			let lobby = Rooms('lobby');
			if (!lobby) return false;
			if (!lobby.news || Object.keys(lobby.news).length < 0) return false;
			if (!lobby.news) lobby.news = {};
			let news = lobby.news, newsDisplay = [];
			Object.keys(news).forEach(announcement => {
				newsDisplay.push(`<h4>${announcement}</h4>${news[announcement].desc}<br /><br /><strong>—<font color="${Equ.Color(news[announcement].by)}">${news[announcement].by}</font></strong> on ${moment(news[announcement].posted).format("MMM D, YYYY")}`);
			});
			return newsDisplay;
		}
function newsDisplay(user) {
			if (!Users(user)) return false;
			let newsDis = this.generateNews();
			if (newsDis.length === 0) return false;

			if (newsDis.length > 0) {
				newsDis = newsDis.join('<hr>');
				return Users(user).send(`|pm| News|${Users(user).getIdentity()}|/raw ${newsDis}`);
			}
}
Equ.getTells = function(target, room, user, connection) {
		target = Users.get(target);
		let tell = Equ.tells[target.userid];
		if (!tell) return;
		for (let i in tell) {
			tell[i].forEach(msg => target.send('|pm| Mensajes Pendientes|' + target.getIdentity() + '|/raw ' + msg));
		}
		delete Equ.tells[target.userid];
		fs.writeFileSync(DATA_DIR + 'tells.json', JSON.stringify(Equ.tells));
	};
let bubbleLetterMap = new Map([
	['a', '\u24D0'], ['b', '\u24D1'], ['c', '\u24D2'], ['d', '\u24D3'], ['e', '\u24D4'], ['f', '\u24D5'], ['g', '\u24D6'], ['h', '\u24D7'], ['i', '\u24D8'], ['j', '\u24D9'], ['k', '\u24DA'], ['l', '\u24DB'], ['m', '\u24DC'],
	['n', '\u24DD'], ['o', '\u24DE'], ['p', '\u24DF'], ['q', '\u24E0'], ['r', '\u24E1'], ['s', '\u24E2'], ['t', '\u24E3'], ['u', '\u24E4'], ['v', '\u24E5'], ['w', '\u24E6'], ['x', '\u24E7'], ['y', '\u24E8'], ['z', '\u24E9'],
	['A', '\u24B6'], ['B', '\u24B7'], ['C', '\u24B8'], ['D', '\u24B9'], ['E', '\u24BA'], ['F', '\u24BB'], ['G', '\u24BC'], ['H', '\u24BD'], ['I', '\u24BE'], ['J', '\u24BF'], ['K', '\u24C0'], ['L', '\u24C1'], ['M', '\u24C2'],
	['N', '\u24C3'], ['O', '\u24C4'], ['P', '\u24C5'], ['Q', '\u24C6'], ['R', '\u24C7'], ['S', '\u24C8'], ['T', '\u24C9'], ['U', '\u24CA'], ['V', '\u24CB'], ['W', '\u24CC'], ['X', '\u24CD'], ['Y', '\u24CE'], ['Z', '\u24CF'],
	['1', '\u2460'], ['2', '\u2461'], ['3', '\u2462'], ['4', '\u2463'], ['5', '\u2464'], ['6', '\u2465'], ['7', '\u2466'], ['8', '\u2467'], ['9', '\u2468'], ['0', '\u24EA'],
]);

let asciiMap = new Map([
	['\u24D0', 'a'], ['\u24D1', 'b'], ['\u24D2', 'c'], ['\u24D3', 'd'], ['\u24D4', 'e'], ['\u24D5', 'f'], ['\u24D6', 'g'], ['\u24D7', 'h'], ['\u24D8', 'i'], ['\u24D9', 'j'], ['\u24DA', 'k'], ['\u24DB', 'l'], ['\u24DC', 'm'],
	['\u24DD', 'n'], ['\u24DE', 'o'], ['\u24DF', 'p'], ['\u24E0', 'q'], ['\u24E1', 'r'], ['\u24E2', 's'], ['\u24E3', 't'], ['\u24E4', 'u'], ['\u24E5', 'v'], ['\u24E6', 'w'], ['\u24E7', 'x'], ['\u24E8', 'y'], ['\u24E9', 'z'],
	['\u24B6', 'A'], ['\u24B7', 'B'], ['\u24B8', 'C'], ['\u24B9', 'D'], ['\u24BA', 'E'], ['\u24BB', 'F'], ['\u24BC', 'G'], ['\u24BD', 'H'], ['\u24BE', 'I'], ['\u24BF', 'J'], ['\u24C0', 'K'], ['\u24C1', 'L'], ['\u24C2', 'M'],
	['\u24C3', 'N'], ['\u24C4', 'O'], ['\u24C5', 'P'], ['\u24C6', 'Q'], ['\u24C7', 'R'], ['\u24C8', 'S'], ['\u24C9', 'T'], ['\u24CA', 'U'], ['\u24CB', 'V'], ['\u24CC', 'W'], ['\u24CD', 'X'], ['\u24CE', 'Y'], ['\u24CF', 'Z'],
	['\u2460', '1'], ['\u2461', '2'], ['\u2462', '3'], ['\u2463', '4'], ['\u2464', '5'], ['\u2465', '6'], ['\u2466', '7'], ['\u2467', '8'], ['\u2468', '9'], ['\u24EA', '0'],
]);

function parseStatus(text, encoding) {
	if (encoding) {
		text = text.split('').map(function (char) {
			return bubbleLetterMap.get(char);
		}).join('');
	} else {
		text = text.split('').map(function (char) {
			return asciiMap.get(char);
		}).join('');
	}
	return text;
}
const messages = [
    "ha utilizado Explosión!",
    "fue tragado por la tierra!",
    "fue abducido por aliens.",
    "ha dejado el edificio.",
    "se perdió en el bosque!",
    "fue a alabar un Magikarp",
    "fue asesinado por un Magikarp",
    "desaparecio magicamente",
    "lo durmio jiglypuff",
    "entro en modo zen",
    "pateo su modem por error",
    "ya no los quiere",
    "cerro la pestaña por error",
    "lo necesitan en su planeta",
    "esta en una situacion con Octillery, Tentacool y Tentacruel",
    "fue atrapado en una Pokeball por su propio Pokémon",
    "fue dejado por su amante!",
    "fue llevado al lado oscuro!",
    "fue absorbido por un remolino!",
    "se asustó y salió del servidor!",
    "entró en una cueva sin repelente!",
    "consiguió ser comido por un grupo de pirañas!",
    "se ha aventurado demasiado profundo en el bosque sin una cuerda de escape",
    "despertó un Snorlax enojado!",
    "se utilizó como cebo para pescar un tiburón!",
    "recibió el juicio del Todopoderoso Arceus!",
    "entró en la hierba sin ningún Pokémon!",
    "se perdió en la ilusión de la realidad.",
    "se comió una bomba!",
    "fue dejado en visto y exploto!",
    "cayó en un nido de víboras!",
];
 exports.commands = {
    	news: 'serverannouncements',
	announcements: 'serverannouncements',
	serverannouncements: {
		'': 'view',
		display: 'view',
		view: function (target, room, user) {
			if (!Rooms('lobby') || !Rooms('lobby').news) return this.errorReply("Strange, there are no server announcements...");
			if (!Rooms('lobby').news && Rooms('lobby')) Rooms('lobby').news = {};
			let news = Rooms('lobby').news;
			if (Object.keys(news).length === 0) return this.sendReply("There are currently no new server announcements at this time.");
			return user.send('|popup||wide||html|' +
				"<center><strong>Noticias del servidor:</strong></center>" +
					generateNews().join('<hr>')
			);
		},
		delete: function (target, room, user) {
			if (!this.can('ban')) return false;
			if (!target) return this.parse('/help serverannouncements');
			if (!Rooms('lobby').news) Rooms('lobby').news = {};
			let news = Rooms('lobby').news;
			if (!news[target]) return this.errorReply("This announcement doesn't seem to exist...");
			delete news[target];
			Rooms('lobby').news = news;
			Rooms('lobby').chatRoomData.news = Rooms('lobby').news;
			Rooms.global.writeChatRoomData();
			this.privateModCommand(`(${user.name} deleted server announcement titled: ${target}.)`);
		},
		add: function (target, room, user) {
			if (!this.can('ban')) return false;
			if (!target) return this.parse('/help serverannouncements');
			target = target.split('|');
			for (let u in target) target[u] = target[u].trim();
			if (!target[1]) return this.errorReply("Usage: /news add [title]| [desc]");
			if (!Rooms('lobby').news) Rooms('lobby').news = {};
			let news = Rooms('lobby').news;
			news[target[0]] = {
				desc: target[1],
				posted: Date.now(),
				by: user.name,
			};
			Rooms('lobby').news = news;
			Rooms('lobby').chatRoomData.news = Rooms('lobby').news;
			Rooms.global.writeChatRoomData();
			this.privateModCommand(`(${user.name} added server announcement: ${target[1]})`);
		},
	},
	serverannouncementshelp: ["/announcements view - Views current server announcements.",
		"/announcements delete [announcement title] - Deletes announcement with the [title]. Requires @, &, ~",
		"/announcements add [announcement title]| [announcement desc] - Adds announcement [announcement]. Requires @, &, ~"],
		        hoster: {
        	add: function (target, room, user, userid) {
			if (!this.userid == 'deltaskiez') return this.errorReply('Este comando solo lo puede usar DeltaSkiez');
			let hoster = toId(target);
			if (!hoster) return this.parse('/hoster');
			if (isHoster(hoster)) return this.errorReply(hoster + ' is already a vip.');
			Db('hoster').set(hoster, 1);
			this.sendReply(hoster + ' has been granted with vip status.');
		},
	       	remove: function (target, room, user) {
			var userid = user.userid;    	
			if (!isHoster(userid)) return false;
			let hoster = toId(target);
			if (!hoster) return this.parse('/hoster');
			if (!isHoster(hoster)) return this.errorReply(hoster + ' is not a vip.');
			Db('hoster').delete(hoster);
			this.sendReply(hoster + '\'s vip status has been taken.');
		},
			list: function (target, room, user) {
			var userid = user.userid;    	
			if (!isHoster(userid)) return false;
			if (!Object.keys(Db('hoster').object()).length) return this.errorReply('There seems to be no user with vip status.');
			user.popup('|html|<center><b><u>Super Administradores.</u></b></center>' + '<br /><br />' + Object.keys(Db('hoster').object()).join('</strong><br />'));
		},
		    '': function(target,room,user) {
		  	if (!this.can('hotpatch')) return false;
		  	this.sendReplyBox('<strong>Comandos de hoster</strong><br>' +
		  	'<li><em>&mdash; add</em> - Agrega a un usuario a la lista de super administradores.</li>' +
		  	'<li><em>&mdash; remove</em> - Remueve a un usuario a la lista de super administradores.</li>' +
		  	'<li><em>&mdash; list</em> - Vizualiza todos los super administradores.</li>'
		  	);
		    },
    },
	pinkhelp: 'raincolors',
        pinkiehelp: 'raincolors',
        rainhelp: 'raincolors',
        rainbowhelp: 'raincolors',
        colors: 'raincolors',
        	raincolors: function () {
		if (!this.canBroadcast()) return false;
		this.sendReplyBox(
			"<big><b>Rain Colors</b></big><br /><br />" +
			"/pinkie, /pink o /p (mensaje) para cambiar el color de tu usuario a rosa en un mensaje<br />" +
			"/rainbow, /rain o /r (mensaje) para cambiar el color de tu usuario a arcoiris en un mensaje<br />" +
			"Creditos a <b>CelestiaPrincess</b> por reinventar el plugin<br />"
		);
	},
        
  r: 'rainbow',      
  rain: 'rainbow',
  rainbow: function(target, room, user){
          if (user.can('broadcast', null, room)) {
                var colors = ['#ED1C24', '#F26522', '#F7941D', '#F0D200', '#8DC73F', '#39B54A', '#00A651', '#00A99D', '#00AEEF', '#0072BC', '#0054A6', '#2E3192', '#662D91', '#92278F', '#EC008C', '#ED145B'];
                if(!target) return this.sendReply('/rainbow message');
                       var userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small><i>' + user.group + '</small><b>' + userColor + '</b>' + Chat.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
          }
          else return this.errorReply('Necesitas ser minimo voiced para usar este comando.');
  },
  p: 'pinkie',      
  pink: 'pinkie',
  pinkie: function(target, room, user){
          if (user.can('broadcast', null, room)) {
                var colors = ['#EDACEC', '#DEAAEC', '#DAAEEA', '#eebaea'];
                if(!target) return this.sendReply('/pinkie mensaje');
                       var userColor = '',
                        currentDate = new Date(),
                        randomNumber = '';
                        for(var x = 0; x < user.name.length; x++){
                                randomNumber = Math.floor(Math.random() * colors.length);
                                if(user.name.substring(x, x + 1) !== undefined){
                                        userColor += '<font color="' + colors[randomNumber] + '">' + user.name.substring(x, x + 1) + '</font>';
                                } else {
                                        userColor += '<font color="' + colors[randomNumber] + '">:</font>';
                                }
                        }
                        if(target.indexOf('/me') > -1) {
                                room.add('|raw|<small><i>' + user.group + '</small><b>' + userColor + '</b>' + Chat.escapeHTML(target.substring(3, target.length)) + '</i>');
                        } else {
                                room.add('|raw|<small>' + user.group + '</small><b>' + userColor + '</b>: ' + target);
                        }
          }
          else return this.errorReply('Necesitas ser minimo voiced para usar este comando.');
  },
  	d: 'poof',
	cpoof: 'poof',
	poof: function (target, room, user) {
		if (Config.poofOff) return this.sendReply("Poof is currently disabled.");
		if (target && !this.can('broadcast')) return false;
		if (room.id !== 'lobby') return false;
		var message = target || messages[Math.floor(Math.random() * messages.length)];
		if (message.indexOf('{{user}}') < 0) {
			message = '{{user}} ' + message;
		}
		message = message.replace(/{{user}}/g, user.name);
		if (!this.canTalk(message)) return false;

		var colour = '#' + [1, 1, 1].map(function () {
			var part = Math.floor(Math.random() * 0xaa);
			return (part < 0x10 ? '0' : '') + part.toString(16);
		}).join('');

		room.addRaw('<center><strong><font color="' + colour + '">~~ ' + Chat.escapeHTML(message) + ' ~~</font></strong></center>');
		user.disconnectAll();
	},

	poofoff: 'nopoof',
	nopoof: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = true;
		return this.sendReply("Poof is now disabled.");
	},

	poofon: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = false;
		return this.sendReply("Poof is now enabled.");
	},
		away: function (target, room, user) {
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!user.isAway && user.name.length > 15) return this.sendReply("Your username is too long for any kind of use of this command.");

		target = target ? target.replace(/[^a-zA-Z0-9]/g, '') : 'AWAY';
		let newName = user.name;
		let status = parseStatus(target, true);
		let statusLen = status.length;
		if (statusLen > 14) return this.sendReply("Your away status should be short and to-the-point, not a dissertation on why you are away.");

		if (user.isAway) {
			let statusIdx = newName.search(/\s\-\s[\u24B6-\u24E9\u2460-\u2468\u24EA]+$/);
			if (statusIdx > -1) newName = newName.substr(0, statusIdx);
			if (user.name.substr(-statusLen) === status) return this.sendReply("Your away status is already set to \"" + target + "\".");
		}

		newName += ' - ' + status;
		if (newName.length > 18) return this.sendReply("\"" + target + "\" is too long to use as your away status.");

		// forcerename any possible impersonators
		let targetUser = Users.getExact(user.userid + target);
		if (targetUser && targetUser !== user && targetUser.name === user.name + ' - ' + target) {
			targetUser.resetName();
			targetUser.send("|nametaken||Your name conflicts with " + user.name + (user.name.substr(-1) === "s" ? "'" : "'s") + " new away status.");
		}

		user.forceRename(newName, user.registered);
		user.updateIdentity();
		user.isAway = true;
		this.parse('/blockchallenges')
	},

	back: function (target, room, user) {
		if (!user.isAway) return this.sendReply("You are not set as away.");
		user.isAway = false;

		let newName = user.name;
		let statusIdx = newName.search(/\s\-\s[\u24B6-\u24E9\u2460-\u2468\u24EA]+$/);
		if (statusIdx < 0) {
			user.isAway = false;
			return false;
		}

		let status = parseStatus(newName.substr(statusIdx + 3), false);
		newName = newName.substr(0, statusIdx);
		user.forceRename(newName, user.registered);
		user.updateIdentity();
		user.isAway = false;
		this.parse('/unblockchallenges')
	},  
	    tarea: function (target, room, user) {
        this.parse('/away TAREA');
    },
 
    trabajo: function (target, room, user) {
        this.parse('/away TRABAJO');
    },
 
    trabajando: function (target, room, user) {
        this.parse('/away TRABAJANDO');
    },
 
    comiendo: function (target, room, user) {
        this.parse('/away COMIENDO');
    },
 
    jugando: function (target, room, user) {
        this.parse('/away JUGANDO');
    },
 
    durmiendo: function (target, room, user) {
        this.parse('/away DURMIENDO');
    },
 
    nerd: function (target, room, user) {
        this.parse('/away NERD');
    },
 
    nerding: function (target, room, user) {
        this.parse('/away NERDING');
    },
 
    mimis: function(target, room, user) {
        this.parse('/away MIMIS');
    },
		credit: 'credits',
	credits: function (target, room, user) {
		this.popupReply("|html|" + "<font size=5>Creditos de Equestria</font><br />" +
					"<u>Owners:</u><br />" +
					"- " + Equ.nameColor('CelestiaPrincess', true) + " (Fundadora, Hoster, Programadora, CSS del Servidor)<br />" +
                    "- " + Equ.nameColor('LaPrincesaLuna', true) + " (Fundadora, Hoster, Foro, CSS del Foro)<br />" +
                    "- " + Equ.nameColor('LadyDash', true) + " (Fundadora, Hoster)<br />" +
					"<br />" +
					"<u>Intros:</u><br />" +
					"- " + Equ.nameColor('FairyClaw', true) + " (Creo las Room Intro de algunas salas.)<br />" +
					"<br />" +
					"<u>Creditos Especiales:</u><br />" +
					"- Staff del servidor<br />" +
					"- Nuestros usuarios del servidor<br />");
	},
			'!tell': true,
		tell: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help tell');
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (Users.ShadowBan.checkBanned(user)) return;
		target = this.splitTarget(target);
		if (this.targetUsername === 'equestrianews') return this.errorReply("Estas son las news del servidor, no una persona");
		if (this.targetUsername === 'mensajespendientes') return this.errorReply("¿En serio?, hablando con los mensajes pendientes?, busca un usuario de verdad! ¬¬'");
		let targetUser = this.targetUsername;
		let id = toId(targetUser);
		if (id === user.userid || (Users(id) && Users(id).userid === user.userid)) return this.sendReply('You can\'t send a message to yourself!');
		if (Users(id) && Users(id).connected) return this.sendReply('User ' + Users(id).name + ' is currently online. PM them instead.');
		if (!id || !target) return this.parse('/help tell');
		if (target.length > MAX_TELL_LENGTH) return this.errorReply("You may not send a tell longer than " + MAX_TELL_LENGTH + " characters.");

		if (Equ.tells[id]) {
			if (!user.can('hotpatch')) {
				let names = Object.keys(user.prevNames).concat(user.userid);
				for (let i in names) {
					let name = names[i];
					if (Equ.tells[id][name] && Equ.tells[id][name].length >= MAX_TELLS) return this.sendReply('You may only leave ' + MAX_TELLS + ' messages for a user at a time. Please wait until ' + targetUser + ' comes online and views them before sending more.');
				}
			}
		} else {
			Equ.tells[id] = {};
		}

		let tell = Equ.tells[id][user.userid];
		let userSymbol = (Users.usergroups[user.userid] ? Users.usergroups[user.userid].substr(0, 1) : "");
		let msg = '<small>[' + moment().format("HH:mm:ss") + ']</small> ' + userSymbol + '<strong class="username"><span style = "color:' + Equ.Color(user.userid) + '">' + user.name + ':</span></strong> ' + Chat.escapeHTML(target);
		if (tell) {
			Equ.tells[id][user.userid].push(msg);
		} else {
			Equ.tells[id][user.userid] = [msg];
		}

		fs.writeFileSync(DATA_DIR + 'tells.json', JSON.stringify(Equ.tells));
				if (this.message.startsWith(`/tell`)) {
		user.send('|pm| ' + this.targetUsername + '|' + this.user.getIdentity() + '|/raw ' + '<small>[' + moment().format("HH:mm:ss") + ']</small>' + userSymbol + '<strong class="username"><span style = "color:' + Equ.Color(user.userid) + '">' + user.name + ':</span></strong> ' + Chat.escapeHTML(target));
		
			return;
		}
	},
	tellhelp: ['/tell [user], [message] - Leaves a message for an offline user for them to see when they log on next.'],
  }
};
