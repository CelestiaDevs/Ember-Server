'Use Strict';

exports.commands = {
	credit: 'credits',
	credits: function (target, room, user) {
		this.popupReply("|html|" + "<font size=5>Ember Credits</font><br />" +
					"<u>Owners:</u><br />" +
					"- " + Plugins.Colors.apply('Mia Flores', true) + " (Founder, Sysadmin)<br />" +
                    "- " + Plugins.Colors.apply('Prince Sky', true) + " (Sysadmin, Host, Developer, Lead Policy)<br />" +
					"<br />" +
					"<u>Development:</u><br />" +
					"- " + Plugins.Colors.apply('Mia Flores', true) + " (Owner of GitHub repository)<br />" +
					"- " + Plugins.Colors.apply('Prince Sky', true) + " (Owner of Github repository, Server CSS)<br />" +
					"<br />" +
					"<u>Special Thanks:</u><br />" +
					"- Current staff team<br />" +
					"- Our regular users<br />");
	},
};
