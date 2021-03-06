const fs = require('fs');
const path = require('path');

const CSS_FILE_PATH = path.resolve(Plugins.path, '..', 'config', 'custom.template.css');

exports.init = function () {
	Chat.multiLinePattern.register('/cssedit ');
};

exports.commands = {
	/*stafflist: 'authlist',
	authlist: function (target, room, user, connection) {
		var rankLists = {};
		for (var u in Users.usergroups) {
			var rank = Users.usergroups[u][0];
			var name = Users.usergroups[u].slice(1);
			if (!rankLists[rank]) rankLists[rank] = [];
			if (name) name = name.replace("\n", "").replace("\r", "");
			rankLists[rank].push(name);
		}
		var buffer = [];
		Object.keys(rankLists).sort(function (a, b) {
			return Config.groups[b].rank - Config.groups[a].rank;
		}).forEach(function (r) {
			buffer.push(Config.groups[r].name + "s (" + r + "):\n" + rankLists[r].sort().join(", "));
		});

		if (!buffer.length) {
			buffer = "This server has no auth.";
			return connection.popup("This server has no auth.");
		}
		connection.popup(buffer.join("\n\n"));
	},*/

	postimage: 'image',
	image: function (target, room, user) {
		if (!target) return this.sendReply('Usage: /image link, size');
		if (!this.can('ban', room)) return false;
		if (!this.runBroadcast()) return;

		let targets = target.split(',');
		if (targets.length !== 2) {
			return this.sendReply('|raw|<center><img src="' + Chat.escapeHTML(targets[0]) + '" alt="" width="50%"/></center>');
		}
		if (parseInt(targets[1]) <= 0 || parseInt(targets[1]) > 100) return this.parse('Usage: /image link, size (1-100)');
		this.sendReply('|raw|<center><img src="' + Chat.escapeHTML(targets[0]) + '" alt="" width="' + toId(targets[1]) + '%"/></center>');
	},

	cssedit: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) return this.errorReply(`/cssedit - Access denied.`);
		if (!target) {
			fs.readFile(CSS_FILE_PATH, 'utf8', (err, cssSrc) => {
				if (err && err.code === 'ENOENT') return this.errorReply(`custom.template.css no existe.`);
				if (err) return this.errorReply(`${err.message}`);
				return this.sendReplyBox(
					`<details open>` +
					`<summary>Código fuente</summary>` +
					`<code>/cssedit ${Chat.escapeHTML(cssSrc).split(/\r?\n/).map(line => {
						return line.replace(/^(\t+)/, (match, $1) => '&nbsp;'.repeat(4 * $1.length)).replace(/^(\s+)/, (match, $1) => '&nbsp;'.repeat($1.length));
					}).join('<br />')}</code>` +
					`</details>`
				);
			});
			return;
		}

		fs.writeFile(CSS_FILE_PATH, target.replace(/[\r\n]+/, '\n'), err => {
			if (err) return this.errorReply(`${err.message}`);
			LoginServer.deployCSS();
			return this.sendReply(`custom.template.css editado exitosamente`);
		});
	},

	destroymodlog: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {return this.sendReply("/destroymodlog - Access denied.");}
		let logPath = LOGS_DIR + 'modlog/';
		if (Chat.modlog && Chat.modlog[room.id]) {
			Chat.modlog[room.id].close();
			delete Chat.modlog[room.id];
		}
		try {
			fs.unlinkSync(logPath + "modlog_" + room.id + ".txt");
			this.addModCommand(user.name + " ha destruido el modlog de esta sala." + (target ? ('(' + target + ')') : ''));
		} catch (e) {
			this.sendReply("No se puede destruir el modlog de esta sala.");
		}
	},

	clearall: function (target, room, user, connection) {
		if (!this.can('clearall')) return;
		const users = Object.values(room.users);
		for (const roomUser of users) {
			roomUser.leaveRoom(room);
		}
		room.log.length = 0;
		room.lastUpdate = 0;

		setTimeout(function () {
			for (const roomUser of users) {
				roomUser.joinRoom(room);
			}
		}, 1000);
	},
	
	roomfounder: function (target, room, user) {
        if (!room.chatRoomData) {
            return this.sendReply("/roomfounder - This room isn\'t designed for per-room moderation to be added.");
        }
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");
        if (!this.can('declare')) return false;
        if (!room.auth) room.auth = room.chatRoomData.auth = {};
        if (!room.leagueauth) room.leagueauth = room.chatRoomData.leagueauth = {};
        var name = targetUser.name;
        room.auth[targetUser.userid] = '#';
        room.founder = targetUser.userid;
        this.addModCommand(name + ' was appointed to Room Founder by ' + user.name + '.');
        room.onUpdateIdentity(targetUser);
        room.chatRoomData.founder = room.founder;
        Rooms.global.writeChatRoomData();
    },
    
    roomdefounder: 'deroomfounder',
    deroomfounder: function (target, room, user) {
        if (!room.auth) {
            return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
        }
        target = this.splitTarget(target, true);
        var targetUser = this.targetUser;
        var name = this.targetUsername;
        var userid = toId(name);
        if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");

        if (room.auth[userid] !== '#') return this.sendReply("User '" + name + "' is not a room founder.");
        if (!this.can('declare', null, room)) return false;

        delete room.auth[userid];
        delete room.founder;
        this.sendReply("(" + name + " is no longer Room Founder.)");
        if (targetUser) targetUser.updateIdentity();
        if (room.chatRoomData) {
            Rooms.global.writeChatRoomData();
        }
    },
	
	roomleader: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' is not online.");

		if (!room.founder) return this.sendReply('The room needs a room founder before it can have a room owner.');
		if (room.founder !== user.userid && !this.can('declare')) return this.sendReply('/roomowner - Access denied.');

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '&';
		this.addModCommand("" + name + " was appointed Room Leader by " + user.name + ".");
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},


	roomdeleader: 'deroomowner',
	deroomleader: function (target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");

		if (room.auth[userid] !== '&') return this.sendReply("User '"+name+"' is not a room leader.");
		if (!room.founder || user.userid !== room.founder && !this.can('declare', null, room)) return false;

		delete room.auth[userid];
		this.sendReply("(" + name + " is no longer Room Leader.)");
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},
	
	credit: 'credits',
	credits: function (target, room, user) {
		this.popupReply("|html|" + "<font size=5>Ember Server Credits</font><br />" +
					"<u>Major Contributors:</u><br />" +
					"- " + Plugins.Colors.apply('DeltaSkiez', true) + " (Owner, Sysadmin, Server CSS)<br />" +
					"- " + Plugins.Colors.apply('HurriKaine', true) + " (Owner, Sysadmin, Lead Policy)<br />" +
					"- " + Plugins.Colors.apply('Revival Viosmic', true) + " (Admin, Discord Manager)<br />" +
					"<br />" +
					"<u>Staff Contributions:</u><br />" +
					"- " + Plugins.Colors.apply('Blooded Kitten', true) + " (Server Website Manager)<br />" +
					"- " + Plugins.Colors.apply('Fleur Fee', true) + " (Server Management)<br />" +
					"<br />" +
					"<u>Special Thanks:</u><br />" +
					"- Current staff team<br />" +
					"- Our regular users<br />");
	},
	
	serverrules: 'emberrules',
	emberrules: function (target, room, user) {
		this.popupReply("|html|" + "<font size=4><b>Ember Server Rules:</b></font><br />" +
					"<br />" +
					"<b>1.</b> No sex. Don't discuss anything sexually explicit, not even in private messages, not even if you're both adults.<br />" +
					"<br />" +
					"<b>2.</b> Moderators have discretion to punish any behaviour they deem inappropriate, whether or not it's on this list.<br />" +
					"<br />" +
					"<b>3.</b> Do not spam, flame, or troll. This includes advertising, raiding, asking questions with one-word answers in the lobby, and flooding the chat such as by copy/pasting logs in the lobby.<br />" +
					"<br />" +
					"<b>4.</b> No minimodding: don't mod if it's not your job. Don't tell people they'll be muted, don't ask for people to be muted, and don't talk about whether or not people should be muted. This applies to bans and other punishments, too.<br />" +
					"<br />" +
					"<b>5.</b> Spam is not permitted this included but not limited to server links, 18+ links, etc.<br />" +
					"<br />" +
					"<b>6.</b> Usernames may not directly reference sexual activity, or be excessively disgusting.<br />" +
					"<br />" +
					"<b>7.</b> Please treat everyone with respect this included staff and regular users.<br />" +
					"<br />" +
					"<b>8.</b> Do not flood chats with spam that has no purpose.<br />" +
					"<br />" +
					"<i>Please follow these rules to make the server a friendly and enjoyable place to be. Breaking any rules will result in punishment.</i><br />");
	},
	
	'!discord': true,
	    discord: function (target, room, user) {
		        if (!this.runBroadcast()) return;
		        this.sendReplyBox('Join our server discord by clicking <a href="https://discord.gg/pBxqYyZ">here</a>.');
	},
	
	fleur : 'fleur',
    	fleur: function(target, room, user) {
            if (!this.runBroadcast()) return;
            this.sendReplyBox('<center><tbody><table height="100%" width="100%" padding:5px; style="background-image: url(&quot;http://i.imgur.com/fpc8bl1.jpg&quot;); background-size: cover" table border="0"><tbody><tr><td width="25%" height="100%"><center><img height="180" src="https://s29.postimg.org/u6brormg7/yozora_g1.gif">' +
                '<a href="http://picosong.com/rbeq/" target="_blank"><img src="https://s27.postimg.org/nd0zdnvur/fleur_text.png" height="125" alt="Theme" /></a>' +
                '<img src="https://s29.postimg.org/9ngvjp8iv/yozora_g2.gif" height="180"><br />' +
                '<b>Catchphrase: </b>"What kind of style do you desire to change into? Mesmerize your identity with fashion and make up. Blossom into an elegant flower, so that you may live your life with freedom and happiness."</center>');
    	},

	roomlist: function (target, room, user) {
		let header = ['<b><font color="#1aff1a" size="2">Total users connected: ' + Rooms.global.userCount + '</font></b><br />'],
			official = ['<b><font color="#ff9900" size="2"><u>Official Rooms:</u></font></b><br />'],
			nonOfficial = ['<hr><b><u><font color="#005ce6" size="2">Public Rooms:</font></u></b><br />'],
			privateRoom = ['<hr><b><u><font color="#ff0066" size="2">Private Rooms:</font></u></b><br />'],
			groupChats = ['<hr><b><u><font color="#00b386" size="2">Group Chats:</font></u></b><br />'],
			battleRooms = ['<hr><b><u><font color="#cc0000" size="2">Battle Rooms:</font></u></b><br />'];

		let rooms = [];

		Rooms.rooms.forEach(curRoom => {
			if (curRoom.id !== 'global') rooms.push(curRoom.id);
		});

		rooms.sort();

		for (let u in rooms) {
			let curRoom = Rooms(rooms[u]);
			if (curRoom.type === 'battle') {
				battleRooms.push('<a href="/' + curRoom.id + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
			}
			if (curRoom.type === 'chat') {
				if (curRoom.isPersonal) {
					groupChats.push('<a href="/' + curRoom.id + '" class="ilink">' + curRoom.id + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isOfficial) {
					official.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isPrivate) {
					privateRoom.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
			}
			if (curRoom.type !== 'battle') nonOfficial.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + curRoom.title + '</a> (' + curRoom.userCount + ')');
		}

		if (!user.can('roomowner')) return this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' '));
		this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' ') + (groupChats.length > 1 ? groupChats.join(' ') : '') + (battleRooms.length > 1 ? battleRooms.join(' ') : ''));
	},
};
