

exports.commands = {
	/*********************************************************
	 * Shop commands
	 *********************************************************/

	tienda: 'shop',
	shop: function (target, room, user) {
		if (!this.runBroadcast()) return false;
		this.sendReplyBox(
			'<center><h3><b><u>Ember Server Shop</u></b></h3><table border="1" cellspacing="0" cellpadding="3" target="_blank"><tbody>' +
			'<tr><th>Item</th><th>Description</th><th>Cost</th></tr>' +
			'<tr><td>Chatroom</td><td>Purchases a chatroom in the server.</td><td>5000</td></tr>' +
			'<tr><td>CustomTC</td><td>Purchases a custom trainer card (provide html). Contact an admin if the code is too long for one message.</td><td>2000</td></tr>' +
			'<tr><td>CustomAvatar</td><td>Purchases a personalized avatar. It should be of small sizes and be appropriate. Contact an admin to obtain this item.</td><td>1500</td></tr>' +
			'<tr><td>CustomIcon</td><td>Purchases a personalized icon. It should be a small image of dimensions (32x32) and appropriate. Contact an admin to obtain this item.</td><td>1000</td></tr>' +
			'<tr><td>CustomColor</td><td>Purchases a personalized color for your name. Contact an admin to obtain this item.</td><td>1000</td></tr>' +
			'<tr><td>CustomPhrase</td><td>Purchases a personalized phrase for when you enter. Contact an admin to obtain this item.</td><td>800</td></tr>' +
			'<tr><td>Symbol</td><td>Purchases access to the command /customsymbol that allows you to have a symbol (except staff) to appear at the top of the userlist.</td><td>200</td></tr>' +
			'<tr><td>TC</td><td>Purchases a basic trainer card. With an image you can modify using /tcimage and a trainer phrase that you can modify using /tcphrase</td><td>500</td></tr>' +
			'<tr><td>Sprite</td><td>Adds a pokemon sprite to your basic trainer card. Maximum of 6. You can change the pokemon by using the command /tcpokemon</td><td>100</td></tr>' +
			'</tbody></table><br /> To purchase an item use the command /buy (item)' +
			'<br /> Some items can only be purchased by contacting an administrator. For more information use the command /shophelp' +
			'</center>'
		);
	},

	ayudatienda: 'shophelp',
	shophelp: function () {
		if (!this.runBroadcast()) return false;
		this.sendReplyBox(
			"<center><h3><b><u>Ember Server Shop - Commands</u></b></h3></center>" +
			"<b>Basic Commands:</b><br /><br />" +
			"/shop - Shows the items in the server shop.<br />" +
			"/buy (item) - Purchases an item in the shop.<br />" +
			"/bucks (user) - Shows how many bucks a user has.<br />" +
			"/donate (user), (money) - Donates a determined quantity to another user.<br />" +
			"<br />" +
			"<b>Specific Commands:</b><br /><br />" +
			"/tc (user) - Shows the trainer card for a certain user.<br />" +
			"/tcimage (link) - Chages the image in the TC.<br />" +
			"/tcphrase (text) - Changes the phrase in the TC.<br />" +
			"/tcpokemon (pokemon1),(pokemon2)... - Changes the sprites of pokemon in the TC.<br />" +
			"/tchtml (html) - Modifies the html for a personalized trainer card.<br />" +
			"/customsymbol (symbol) - Changes symbol for a personalized one, but without changing rank.<br />" +
			"/resetsymbol - Resets your previous symbol gets rid of the one you had.<br />" +
			"<br />" +
			"<b>Administrative Commands:</b><br /><br />" +
			"/givemoney (user), (bucks) - Gives a quantity of bucks to a user.<br />" +
			"/removemoney (user), (bucks) - Removes a quantity of bucks from a user.<br />" +
			"/symbolpermision (user), (on/off) - Gives or removes the permission for a CustomSymbol.<br />" +
			"/pendingavatars - Shows a list of pending personalized avatars that have been purchased.<br />" +
			"/deavatarreq (user) - Deletes the request for a personalized avatar.<br />" +
			"/removetc (user) - Deletes a users trainer card.<br />" +
			"/setcustomtc (user), (on/off) - Gives or removes the permisson to have a personalized TC.<br />" +
			"/sethtmltc (user), (html) - Modifies the peronalized trainer card for a user.<br />"
		);
	},

	purchase: 'buy',
	buy: function (target, room, user) {
		let params = target.split(',');
		let prize = 0;
		if (!params) return this.sendReply("Usage: /buy object");
		let article = toId(params[0]);
		switch (article) {
		case 'customtc':
			prize = 2000;
			if (Shop.getUserMoney(user.name) < prize) return this.sendReply("You do not have enough bucks.");
			var tcUser = Shop.getTrainerCard(user.name);
			if (!tcUser) {
				Shop.giveTrainerCard(user.name);
				tcUser = Shop.getTrainerCard(user.name);
			}
			if (tcUser.customTC) return this.sendReply("You already have this item.");
			Shop.setCustomTrainerCard(user.name, true);
			Shop.removeMoney(user.name, prize);
			return this.sendReply("You have purchased a personalized trainer card. Use /shophelp for more information.");
			break;
		case 'tc':
			prize = 500;
			if (Shop.getUserMoney(user.name) < prize) return this.sendReply("You do not have enough bucks.");
			var tcUser = Shop.getTrainerCard(user.name);
			if (tcUser) return this.sendReply("You already have this item.");
			Shop.giveTrainerCard(user.name);
			Shop.removeMoney(user.name, prize);
			return this.sendReply("You have purchased a trainer card. Use /shophelp for help on how to make changes.");
			break;
		case 'sprite':
			prize = 100;
			if (Shop.getUserMoney(user.name) < prize) return this.sendReply("You do not have enough bucks.");
			var tcUser = Shop.getTrainerCard(user.name);
			if (!tcUser) return this.sendReply("You must purchase a trainer card first.");
			if (tcUser.nPokemon > 5) return this.sendReply("You already have 6 pokemon for your trainer card.");
			if (tcUser.customTC) return this.sendReply("Your trainer card is personalized. Use /tchtml to modify it.");
			Shop.nPokemonTrainerCard(user.name, tcUser.nPokemon + 1);
			Shop.removeMoney(user.name, prize);
			return this.sendReply("You have purchased a sprite of a pokemon for your TC. Use /shophelp for more information.");
			break;
		case 'chatroom':
			prize = 5000;
			if (Shop.getUserMoney(user.name) < prize) return this.sendReply("You do not have enough bucks.");
			if (params.length !== 2) return this.sendReply("Use the command like this: /buy chatroom,[roomname]");
			var id = toId(params[1]);
			if (Rooms.rooms.has(id)) return this.sendReply("The room '" + params[1] + "' already exists. Use another name.");
			if (Rooms.global.addChatRoom(params[1])) {
				const newRoom = Rooms.get(id);
				if (!newRoom.auth) newRoom.auth = newRoom.chatRoomData.auth = {};
				newRoom.auth[toId(user.name)] = '#';
				if (newRoom.chatRoomData) Rooms.global.writeChatRoomData();
				Shop.removeMoney(user.name, prize);
				return this.sendReply("The room '" + params[1] + "' was successfully created. Join using /join " + id);
			}
			return this.sendReply("The room was not able to be purchased becuase of the following error '" + params[1] + "'.");
			break;
		case 'symbol':
			prize = 200;
			if (Shop.getUserMoney(user.name) < prize) return this.sendReply("You do not have enough bucks.");
			if (Shop.symbolPermision(user.name)) return this.sendReply("You already have this item.");
			Shop.setSymbolPermision(user.name, true);
			Shop.removeMoney(user.name, prize);
			return this.sendReply("You have purchased the permission to the following commands /customsymbol and /resetsymbol. For more information use /shophelp.");
			break;
		case 'customavatar':
			prize = 1500;
			if (Shop.getUserMoney(user.name) < prize) return this.sendReply("You do not have enough bucks.");
			if (Config.customavatars[user.userid]) return this.sendReply("You have already purchased this item. To change it please speak to an admin.");
			if (params.length !== 2) return this.sendReply("Use the command like this: /buy avatar,[image]");
			var err = Shop.addPendingAvatar(user.userid, params[1]);
			if (err) return this.sendReply(err);
			Shop.removeMoney(user.name, prize);
			return this.sendReply("You have purchased a personalized avatar. Contact an admin to validate your purchase.");
			break;
		case 'customicon':
			prize = 1000;
			if (Shop.getUserMoney(user.name) < prize) return this.sendReply("You do not have enough bucks.");
			if (params.length !== 2) return this.sendReply("Use the command like this: /buy customicon,[image]");
			var err = Shop.addPendingIcon(user.userid, params[1]);
			if (err) return this.sendReply(err);
			Shop.removeMoney(user.name, prize);
			return this.sendReply("You have purchased a personalized icon. Contact an admin to validate your purchase.");
			break;
		case 'customcolor':
			prize = 1000;
			if (Shop.getUserMoney(user.name) < prize) return this.sendReply("You do not have enough bucks.");
			if (params.length !== 2) return this.sendReply("Use the command like this: /buy customcolor,[hex]");
			var err = Shop.addPendingColor(user.userid, params[1]);
			if (err) return this.sendReply(err);
			Shop.removeMoney(user.name, prize);
			return this.sendReply("You have purchased a personalized name color. Contact an admin to validate your purchase.");
			break;
		case 'customphrase':
			prize = 800;
			if (Shop.getUserMoney(user.name) < prize) return this.sendReply("You do not have enough bucks.");
			if (params.length !== 2) return this.sendReply("Use the command like this: /buy customphrase,[phrase]");
			var err = Shop.addPendingPhrase(user.userid, params[1]);
			if (err) return this.sendReply(err);
			Shop.removeMoney(user.name, prize);
			return this.sendReply("You have purchased a personalized join phrase. Contact an admin to validate your purchase.");
			break;	
		default:
			return this.sendReply("You have not specified a valid item.");
		
		}
	},

	atm: 'bucks',
	bucks: function (target, room, user) {
		let autoData = false;
		if (!target) autoData = true;
		if (!this.runBroadcast()) return false;

		let pds = 0;
		let userName = user.name;
		if (autoData) {
			pds = Shop.getUserMoney(user.name);
		} else {
			pds = Shop.getUserMoney(target);
			userName = toId(target);
			let userh = Users.getExact(target);
			if (userh) userName = userh.name;
		}
		this.sendReplyBox('Savings for <b>' + userName + '</b>: ' + pds + ' bucks');
	},

	tclist: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {return this.sendReply("/tclist - Access denied.");}
		this.sendReplyBox(Shop.getTrainerCardList());
	},

	trainercard: 'tc',
	tc: function (target, room, user) {
		let autoData = false;
		if (!target) autoData = true;
		if (!this.runBroadcast()) return false;
		if (room.decision) return this.sendReply('Trainer cards cannot be shown in battles.');

		let pds = 0;
		let userName = user.name;
		let tcData = {};
		if (autoData) {
			tcData = Shop.getTrainerCard(user.name);
		} else {
			tcData = Shop.getTrainerCard(target);
			userName = toId(target);
			let userh = Users.getExact(target);
			if (userh) userName = userh.name;
		}
		if (!tcData) return this.sendReply(userName + " did not have a trainer card.");
		if (tcData.customTC) {
			if (room.id === 'lobby') return this.sendReply('|raw|<div class="infobox infobox-limited">' + tcData.customHtml + '</div>');
			return this.sendReplyBox(tcData.customHtml);
		}
		let pokeData = '<hr />';
		for (let t in tcData.pokemon) {
			pokeData += '<img src="http://play.pokemonshowdown.com/sprites/xyani/' + Chat.escapeHTML(Shop.getPokemonId(tcData.pokemon[t])) + '.gif" width="auto" /> &nbsp;';
		}
		if (tcData.nPokemon === 0) pokeData = '';
		if (room.id === 'lobby') return this.sendReply('|raw|<div class="infobox infobox-limited"><center><h2>' + userName + '</h2><img src="' + encodeURI(tcData.image) + '" width="80" height="80" title="' + userName + '" /><br /><br /><b>"' + Chat.escapeHTML(tcData.phrase) + '"</b>' + pokeData + '</center></div>');
		this.sendReplyBox('<center><h2>' + userName + '</h2><img src="' + encodeURI(tcData.image) + '" width="80" height="80" title="' + userName + '" /><br /><br /><b>"' + Chat.escapeHTML(tcData.phrase) + '"</b>' + pokeData + '</center>');
	},

	givemoney: function (target, room, user) {
		let params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /givemoney user, bucks");
		if (!this.can('givemoney')) return false;

		let pds = parseInt(params[1]);
		if (pds <= 0) return this.sendReply("The quantity is not valid.");
		let userh = Users.getExact(params[0]);
		if (!userh || !userh.connected) return this.sendReply("The user does not exist or is not online");
		let userName = userh.name;
		if (!Shop.giveMoney(params[0], pds)) {
			this.sendReply("Unknown error.");
		} else {
			this.sendReply(userName + ' has received ' + pds + ' bucks');
		}
	},

	removemoney: function (target, room, user) {
		let params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /removemoney usuario, pds");
		if (!this.can('givemoney')) return false;

		let pds = parseInt(params[1]);
		if (pds <= 0) return this.sendReply("La cantidad no es valida.");
		let userh = Users.getExact(params[0]);
		let userName = toId(params[0]);
		if (userh) userName = userh.name;
		if (!Shop.removeMoney(params[0], pds)) {
			this.sendReply("El usuario no tenía suficientes Pds.");
		} else {
			this.sendReply(userName + ' ha perdido ' + pds + ' pd');
		}
	},

	donar: 'donate',
	donate: function (target, room, user) {
		let params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /donate usuario, pds");

		let pds = parseInt(params[1]);
		if (!pds || pds <= 0) return this.sendReply("La cantidad no es valida.");
		let userh = Users.getExact(params[0]);
		if (!userh || !userh.connected) return this.sendReply("El usuario no existe o no está disponible");
		let userName = userh.name;
		if (!Shop.transferMoney(user.name, params[0], pds)) {
			this.sendReply("No tienes suficientes pds.");
		} else {
			this.sendReply('Has donado ' + pds + ' pd al usuario ' + userName + '.');
		}
	},

	symbolpermision: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		let params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /symbolpermision usuario, [on/off]");
		let permision = false;
		if (toId(params[1]) !== 'on' && toId(params[1]) !== 'off') return this.sendReply("Usage: /symbolpermision usuario, [on/off]");
		if (toId(params[1]) === 'on') permision = true;
		if (permision) {
			let userh = Users.getExact(params[0]);
			if (!userh || !userh.connected) return this.sendReply("El usuario no existe o no está disponible");
			if (Shop.setSymbolPermision(params[0], permision)) return this.sendReply("Permiso para customsymbols concedido a " + userh.name);
			return this.sendReply("El usuario ya poseía permiso para usar los customsymbols.");
		} else {
			if (Shop.setSymbolPermision(params[0], permision)) return this.sendReply("Permiso para customsymbols retirado a " + params[0]);
			return this.sendReply("El usuario no tenía ningún permiso que quitar.");
		}
	},

	hideauth: 'customsymbol',
	symbol: 'customsymbol',
	simbolo: 'customsymbol',
	customsymbol: function (target, room, user, connection, cmd) {
		if (!user.can('customsymbol') && !Shop.symbolPermision(user.name)) return this.sendReply('Debes comprar este comando en la tienda para usarlo.');
		if (!target && cmd === 'hideauth') target = ' ';
		if (!target || target.length > 1) return this.sendReply('Debes especificar un caracter como simbolo.');
		if (target.match(/[A-Za-z0-9\d]+/g)) return this.sendReply('Tu simbolo no puede ser un caracter alfanumerico.');
		if (!user.can('customsymbol')) {
			if ('?!$+\u2605%@\u2295&~#'.indexOf(target) >= 0) return this.sendReply('No tienes permiso para elegir un rango como simbolo');
		}
		user.getIdentity = function (roomid) {
			if (this.locked) {
				return '‽' + this.name;
			}
			if (roomid) {
				let room = Rooms.get(roomid);
				if (room.isMuted(this)) {
					return '!' + this.name;
				}
				if (room && room.auth) {
					if (room.auth[this.userid]) {
						return room.auth[this.userid] + this.name;
					}
					if (room.isPrivate === true) return ' ' + this.name;
				}
			}
			return target + this.name;
		};
		user.updateIdentity();
		user.hasCustomSymbol = true;
		this.sendReply('Tu simbolo ha cambiado a "' + target + '"');
	},

	showauth: 'resetsymbol',
	resetsymbol: function (target, room, user) {
		if (!user.hasCustomSymbol) return this.sendReply('No tienes nigún simbolo personalizado.');
		user.getIdentity = function (roomid) {
			if (this.locked) {
				return '‽' + this.name;
			}
			if (roomid) {
				let room = Rooms.get(roomid);
				if (room.isMuted(this)) {
					return '!' + this.name;
				}
				if (room && room.auth) {
					if (room.auth[this.userid]) {
						return room.auth[this.userid] + this.name;
					}
					if (room.isPrivate === true) return ' ' + this.name;
				}
			}
			return this.group + this.name;
		};
		user.hasCustomSymbol = false;
		user.updateIdentity();
		this.sendReply('Tu simbolo se ha restablecido.');
	},

	setbotphrase: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		if (!target) return this.sendReply("Usage: /setbotphrase [user], [phrase]");
		let params = target.split(',');
		if (!params || params.length < 2) return this.sendReply("Usage: /setbotphrase [user], [phrase]");
		let targetUser = Users.get(params[0]);
		if (!targetUser && toId(params[0]) !== 'off') return this.sendReply("El usuario " + toId(params[0]) + 'no está disponible en este momento.');
		Shop.changeBotPhrase(params[0], target.substr(params[0].length + 1));
		return this.sendReply("La frase descriptiva del usuario " + toId(params[0]) + ' ha sido modificada con exito.');
	},

	botphrase: function (target, room, user) {
		if (!Shop.getBotPhrase(user.name)) return this.sendReply("Debes comprar este articulo en la tienda antes de poder usarlo.");
		if (!target) return this.sendReply("Usage: /botphrase texto");
		if (toId(target) === 'off') return this.sendReply("Usage: /botphrase texto");
		if (target.length > 150) return this.sendReply("La frase es demasiado larga. Debe ser menor a 150 caracteres.");
		Shop.changeBotPhrase(user.name, Chat.escapeHTML(target));
		return this.sendReply("Frase modificada con exito.");
	},

	removetc: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		if (!target) return this.sendReply("Usage: /removetc usuario");
		if (Shop.removeTrainerCard(target)) {
			return this.sendReply("Tarjeta de entrenador del usuario " + toId(target) + ' eliminada.');
		} else {
			return this.sendReply("El usuario no poseía Tc.");
		}
	},

	setcustomtc: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		let params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setcustomtc usuario, [on/off]");
		let permision = false;
		if (toId(params[1]) !== 'on' && toId(params[1]) !== 'off') return this.sendReply("Usage: /setcustomtc usuario, [on/off]");
		if (toId(params[1]) === 'on') permision = true;
		if (permision) {
			let userh = Users.getExact(params[0]);
			if (!userh || !userh.connected) return this.sendReply("El usuario no existe o no está disponible");
			if (Shop.setCustomTrainerCard(params[0], permision)) return this.sendReply("Permiso para customtrainercards concedido a " + userh.name);
			return this.sendReply("El usuario no poseía Tc o ya tenía el permiso para customtrainercards.");
		} else {
			if (Shop.setCustomTrainerCard(params[0], permision)) return this.sendReply("Permiso para customtrainercards retirado a " + params[0]);
			return this.sendReply("El usuario no poseía Tc o no tenía el permiso para customtrainercards.");
		}
	},

	tcimage: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /tcimage link");
		let tcData = Shop.getTrainerCard(user.name);
		if (!tcData) return this.sendReply("No posees ninguna tarjeta de entrenador.");
		if (tcData.customTC) return this.sendReply("Tu tarjeta es personalizada. usa /tchtml para cambiarla.");
		if (target.length > 120) return this.sendReply("El enlace es demasiado largo.");
		if (Shop.imageTrainerCard(user.name, target)) {
			return this.sendReply("Imagen de la TC cambiada con éxito.");
		} else {
			return this.sendReply("Error al cambiar la imagen de la TC.");
		}
	},

	tcphrase: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /tcphrase text");
		let tcData = Shop.getTrainerCard(user.name);
		if (!tcData) return this.sendReply("No posees ninguna tarjeta de entrenador.");
		if (tcData.customTC) return this.sendReply("Tu tarjeta es personalizada. usa /tchtml para cambiarla.");
		if (target.length > 120) return this.sendReply("La frase es muy larga.");
		if (Shop.phraseTrainerCard(user.name, target)) {
			return this.sendReply("Frase de la TC cambiada con éxito.");
		} else {
			return this.sendReply("Error al cambiar la frase de la TC.");
		}
	},

	tcpokemon: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /tcpokemon [Pokemon1], [Pokemon2]...");
		let params = target.split(',');
		let tcData = Shop.getTrainerCard(user.name);
		if (!tcData) return this.sendReply("No posees ninguna tarjeta de entrenador.");
		if (tcData.customTC) return this.sendReply("Tu tarjeta es personalizada. usa /tchtml para cambiarla.");
		if (params.length > tcData.nPokemon) return this.sendReply("Has especificado más Pokemon de los que has comprado.");
		let pokemonList = {};
		let pokemonId = '';
		for (let h in params) {
			pokemonId = Chat.escapeHTML(params[h]);
			if (pokemonId.length > 20) return this.sendReply("Alguno de los nombres de los Pokemon era muy largo.");
			pokemonList[h] = pokemonId;
		}
		if (Shop.pokemonTrainerCard(user.name, pokemonList)) {
			return this.sendReply("Los pokemon de la Tc han sido modificados.");
		} else {
			return this.sendReply("Error al cambiar los pokemon de la TC.");
		}
	},

	tchtml: 'tccustom',
	tccustom: function (target, room, user) {
		let tcData = Shop.getTrainerCard(user.name);
		if (!tcData) return this.sendReply("No posees ninguna tarjeta de entrenador.");
		if (!tcData.customTC) return this.sendReply("Tu tarjeta no es personalizada.");
		if (!target) {
			this.sendReply('Html de tu Tarjeta de entrenador:');
			this.sendReplyBox(Chat.escapeHTML(tcData.customHtml));
			return;
		}
		if (target.length > 1000) return this.sendReply("Tu código es demasiado largo. Contacta con un administrador para modificar la TC custom.");
		let targetABS = Shop.deleteValues(target);
		if (Shop.htmlTrainerCard(user.name, targetABS)) {
			return this.sendReply("La tarjeta de entrenador personalizada ha sido modificada.");
		} else {
			return this.sendReply("Error al cambiar los datos.");
		}
	},

	sethtmltc: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		let params = target.split(',');
		if (!params || params.length < 2) return this.sendReply("Usage: /sethtmltc usuario, html");
		let tcData = Shop.getTrainerCard(params[0]);
		if (!tcData) return this.sendReply("El usuario no posee ninguna tarjeta de entrenador.");
		if (!tcData.customTC) return this.sendReply("La tarjeta no es personalizada.");
		let targetABS = Shop.deleteValues(target.substr(params[0].length + 1));
		if (Shop.htmlTrainerCard(params[0], targetABS)) {
			return this.sendReply("La tarjeta de entrenador personalizada ha sido modificada.");
		} else {
			return this.sendReply("Error al cambiar los datos.");
		}
	},

	avatarespendientes: 'pendingavatars',
	pendingavatars: function (target, room, user) {
		if (!this.runBroadcast()) return false;
		this.sendReplyBox(Shop.getPendingAvatars());
	},

	deavatarreq: 'deleteavatarrequest',
	deleteavatarrequest: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		if (!target) return this.sendReply("No has especificado ningun usuario.");
		let err = Shop.deletePendingAvatar(target);
		if (err) return this.sendReply(err);
		this.sendReply("Solicitud de avatar eliminada");
	},

	colorespendientes: 'pendingcolors',
	pendingcolors: function (target, room, user) {
		if (!this.runBroadcast()) return false;
		this.sendReplyBox(Shop.getPendingColors());
	},

	decolorreq: 'deletecolorrequest',
	deletecolorrequest: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		if (!target) return this.sendReply("No has especificado ningun usuario.");
		let err = Shop.deletePendingColor(target);
		if (err) return this.sendReply(err);
		this.sendReply("Solicitud de color eliminada");
	},

	iconospendientes: 'pendingicons',
	pendingicons: function (target, room, user) {
		if (!this.runBroadcast()) return false;
		this.sendReplyBox(Shop.getPendingIcons());
	},

	deiconreq: 'deleteiconrequest',
	deleteiconrequest: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		if (!target) return this.sendReply("No has especificado ningun usuario.");
		let err = Shop.deletePendingIcon(target);
		if (err) return this.sendReply(err);
		this.sendReply("Solicitud de icono eliminada");
	},

	frasesspendientes: 'pendingphrases',
	pendingphrases: function (target, room, user) {
		if (!this.runBroadcast()) return false;
		this.sendReplyBox(Shop.getPendingPhrases());
	},

	dephrasereq: 'deletephraserequest',
	deletephraserequest: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		if (!target) return this.sendReply("No has especificado ningun usuario.");
		let err = Shop.deletePendingPhrase(target);
		if (err) return this.sendReply(err);
		this.sendReply("Solicitud de frase eliminada");
	},
};
