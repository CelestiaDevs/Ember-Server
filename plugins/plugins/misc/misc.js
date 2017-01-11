'use strict';

/* Original code by panpawn! Modified for roleplau by Prince Sky!*/

var color = require('../config/color');
hashColor = function(name, bold) {
	return (bold ? "<b>" : "") + "<font color=" + color(name) + ">" + (Users(name) && Users(name).connected && Users.getExact(name) ? Tools.escapeHTML(Users.getExact(name).name) : Tools.escapeHTML(name)) + "</font>" + (bold ? "</b>" : "");
}

exports.commands = {
	credit: 'credits',
	credits: function (target, room, user) {
		this.popupReply("|html|" + "<font size=5>Ember Credits</font><br />" +
					"<u>Owners:</u><br />" +
					"- " + hashColor('Mia Flores', true) + " (Founder, Sysadmin)<br />" +
                   			"- " + hashColor('Prince Sky', true) + " (Sysadmin, Host, Developer, Lead Policy)<br />" +
					"<br />" +
					"<u>Development:</u><br />" +
					"- " + hashColor('Mia Flores', true) + " (Owner of GitHub repository)<br />" +
					"- " + hashColor('Prince Sky', true) + " (Owner of Github repository, Server CSS)<br />" +
					"<br />" +
					"<u>Special Thanks:</u><br />" +
					"- Current staff team<br />" +
					"- Our regular users<br />");
	},
	
	globalauth: 'gal',
	stafflist: 'gal',
	authlist: 'gal',
	auth: 'gal',
	gal: function (target, room, user, connection) {
		let ranks = Object.keys(Config.groups);
		let persons = [];
		for (let u in Users.usergroups) {
			let rank = Users.usergroups[u].charAt(0);
			if (ranks.indexOf(rank) >= 0) {
				let name = Users.usergroups[u].substr(1);
				persons.push({
					name: name,
					rank: rank,
				});
			}
		}
		let staff = {
			"admins": [],
			"leaders": [],
			"bots": [],
			"mods": [],
			"drivers": [],
			"voices": [],
		};
		persons = persons.sort((a, b) => toId(a.name).localeCompare(toId(b.name))); // No need to return, arrow functions with single lines have an implicit return
		function nameColor(name) {
			if (Users.getExact(name) && Users(name).connected) {
				return '<b><i><font color="' + hashColorWithCustoms(name) + '">' + Chat.escapeHTML(Users.getExact(name).name) + '</font></i></b>';
			} else {
				return '<font color="' + hashColorWithCustoms(name) + '">' + Chat.escapeHTML(name) + '</font>';
			}
		}
		for (let j = 0; j < persons.length; j++) {
			let rank = persons[j].rank;
			let person = persons[j].name;
			switch (rank) {
			case '~':
				staff['admins'].push(nameColor(person));
				break;
			case '&':
				staff['leaders'].push(nameColor(person));
				break;
			case '*':
				staff['bots'].push(nameColor(person));
				break;
			case '@':
				staff['mods'].push(nameColor(person));
				break;
			case '%':
				staff['drivers'].push(nameColor(person));
				break;
			case '+':
				staff['voices'].push(nameColor(person));
				break;
			default:
				continue;

			}
		}
		connection.popup('|html|' +
			'<h3>Ember Authority List</h3>' +
			'<b><u>~Administrators (' + staff['admins'].length + ')</u></b>:<br />' + staff['admins'].join(', ') +
			'<br />' +
			'<br /><b><u>&Leaders (' + staff['leaders'].length + ')</u></b>:<br />' + staff['leaders'].join(', ') +
			'<br />' +
			'<br /><b><u>*Bots (' + staff['bots'].length + ')</u></b><br />' + staff['bots'].join(', ') +
			'<br />' +
			'<br /><b><u>@Moderators (' + staff['mods'].length + ')</u></b>:<br />' + staff['mods'].join(', ') +
			'<br />' +
			'<br /><b><u>%Drivers (' + staff['drivers'].length + ')</u></b>:<br />' + staff['drivers'].join(', ') +
			'<br />' +
			'<br /><b><u>+Voices (' + staff['voices'].length + ')</u></b>:<br />' + staff['voices'].join(', ') +
			'<br /><br /><blink>(<b>Bold</b> / <i>Italic</i> = Currently Online)</blink>'
		);
	},
};
