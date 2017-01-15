'use strict';

const fs = require('fs');
const path = require('path');

const STORAGE_PATH = DATA_DIR + 'icons.json';
const customIcons = Object.create(null);

exports.dynamic = {
	customIcons: customIcons,
};

exports.loadData = function () {
	try {
		const fileContent = fs.readFileSync(STORAGE_PATH, 'utf8');
		Object.assign(customIcons, JSON.parse(fileContent));
		exports.dataLoaded = true;
	} catch (err) {}
};

function updateIcons() {
	fs.writeFileSync(STORAGE_PATH, JSON.stringify(customIcons));
	LoginServer.deployCSS();
}

function deployCSS(filePath, src) {
	if (!filePath || path.basename(filePath) !== 'custom.template.css') return src;

	let newCss = '';
	for (let name in customIcons) {
		newCss += generateCSS(name, customIcons[name]) + '\n';
	}

	return src.replace('<!-- Custom Icons -->', newCss);
}

function generateCSS(name, icon) {
	let css = '';
	let rooms = [];
	name = toId(name);
	Rooms.rooms.forEach((curRoom, id) => {
		if (curRoom.id === 'global' || curRoom.type !== 'chat' || curRoom.isPersonal) return;
		if (!isNaN(Number(id.charAt(0)))) return;
		rooms.push('#' + id + '-userlist-user-' + name);
	});
	css = rooms.join(', ');
	css += '{\nbackground: url(\'' + encodeURI(icon).replace(/'/g, "\\'") + '\') no-repeat right\n}';
	return css;
}

exports.deploy = deployCSS;

exports.commands = {
	customicon: 'icon',
	icon: function (target, room, user) {
		if (!this.can('customicon')) return false;
		target = this.splitTarget(target, true);
		if (!target) return this.parse('/help customicon');
		if (!this.targetUserid || this.targetUsername.length > 18) return this.errorReply(`Indicate the name of a valid user.`);

		if (target === 'delete') {
			if (!(this.targetUserid in customIcons)) return this.errorReply(`/customicon - ${this.targetUsername} does not have an icon.`);
			delete customIcons[this.targetUserid];
			updateIcons();

			this.sendReply(`You have removed the icon of ${this.targetUsername}.`);
			Rooms('staff').add(`${user.name} removed the icon of ${this.targetUserid}.`).update();
			this.privateModCommand(`(Icon of ${this.targetUserid} removed by ${user.name}).`);

			if (this.targetUser && this.targetUser.connected) {
				this.targetUser.popup(`${user.name} removed your icon.`);
			}
			return;
		}

		if (this.targetUserid in customIcons) return this.errorReply(`The indicated user already has an icon. Try using /customicon [user], delete.`);
		const targetURI = this.canEmbedURI(target);
		if (!targetURI) return false;

		customIcons[this.targetUserid] = targetURI;
		updateIcons();

		this.sendReply(`|raw|You have given an icon to ${Plugins.Colors.apply(this.targetUsername).bold()}.`);
		Rooms('staff').addRaw(Chat.html`${this.targetUserid} obtained an <strong>icon</strong> from ${user.name}.`).update();
		this.privateModCommand(`(${this.targetUserid} obtained an icon from ${user.name}: ${targetURI}`);
	},
	iconhelp: [
		"Commands Include:",
		"/icon [user], [image url] - Gives [user] an icon of [image url]",
		"/icon [user], delete - Deletes a user's icon",
	],
};
