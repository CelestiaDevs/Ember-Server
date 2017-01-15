'use strict';

const fs = require('fs');
const path = require('path');

const checkLuminosity = require('./validate-luminosity');
const mainCustomColors = require('./custom-data/smogon-custom');
const customColors = Object.assign(Object.create(null), mainCustomColors);

const STORAGE_PATH = DATA_DIR + 'customcolors.json';

exports.dynamic = {
	customColors: customColors,
};

exports.loadData = function () {
	try {
		const fileContent = fs.readFileSync(STORAGE_PATH, 'utf8');
		Object.assign(customColors, JSON.parse(fileContent));
		exports.dataLoaded = true;
	} catch (err) {}
};

exports.onLoad = function () {
	Plugins.Colors.load(customColors);
};

function updateColors() {
	fs.writeFileSync(STORAGE_PATH, JSON.stringify(customColors));
	LoginServer.deployCSS();
}

function deployCSS(filePath, src) {
	if (!filePath || path.basename(filePath) !== 'custom.template.css') return src;

	let newCss = '';
	for (let name in customColors) {
		if (name in mainCustomColors && customColors[name] === mainCustomColors[name]) continue;
		newCss += generateCSS(name, customColors[name]) + '\n';
	}

	return src.replace('<!-- Custom Colors -->', newCss);
}

function generateCSS(name, val) {
	let color = val.color || Plugins.Colors.get(val);
	let css = '';
	let rooms = [];
	name = toId(name);
	Rooms.rooms.forEach((curRoom, id) => {
		if (id === 'global' || curRoom.type !== 'chat' || curRoom.isPersonal) return;
		if (!isNaN(Number(id.charAt(0)))) return;
		rooms.push('#' + id + '-userlist-user-' + name + ' strong em');
		rooms.push('#' + id + '-userlist-user-' + name + ' strong');
		rooms.push('#' + id + '-userlist-user-' + name + ' span');
	});
	css = rooms.join(', ');
	css += '{\ncolor: ' + color + ' !important;\n}\n';
	css += '.chat.chatmessage-' + name + ' strong {\n';
	css += 'color: ' + color + ' !important;\n}';
	return css;
}

exports.deploy = deployCSS;

exports.commands = {
	customcolor: function (target, room, user) {
		if (!this.can('customcolor')) return false;
		target = this.splitTarget(target, true);
		if (!target) return this.parse('/help customcolor');
		if (!this.targetUserid || this.targetUsername.length > 18) return this.errorReply(`The name indicated is not valid.`);

		if (target === 'delete') {
			if (!(this.targetUserid in customColors)) return this.errorReply(`/customcolor - ${this.targetUsername} does not have a personalized color.`);
			delete customColors[this.targetUserid];
			updateColors();

			this.sendReply(`You have remove the personalized color of ${this.targetUsername}.`);
			Rooms('staff').add(`${user.name} removed the personalized color of ${this.targetUserid}.`).update();
			this.privateModCommand(`(Personalized color of ${this.targetUserid} removed by ${user.name}).`);

			if (this.targetUser && this.targetUser.connected) {
				this.targetUser.popup(`${user.name} removed your personalized color.`);
			}
			return;
		}

		if (this.targetUserid in customColors) return this.errorReply(`The user indicated already have a personalized color. Try using /customcolor [user], delete.`);

		const colorData = Plugins.Colors.parse(target, ['en', 'es']);
		if (!colorData) return this.errorReply(`${target} is not a valid color.`);
		const colorHex = colorData.toString('hex');

		const customColorVal = {color: colorHex};
		Plugins.Colors.load({[this.targetUserid]: customColorVal});
		customColors[this.targetUserid] = customColorVal;
		updateColors();

		this.sendReply(`|raw|You have given a customcolor to ${Plugins.Colors.apply(this.targetUsername).bold()}.`);
		Rooms('staff').addRaw(Chat.html`${this.targetUserid} obtained a <strong><font color="${colorHex}">custom color</font></strong> from ${user.name}.`).update();
		this.privateModCommand(`(${this.targetUserid} obtained a customcolor ${colorData.getName('es')}: ${colorHex} from ${user.name}.)`);
	},
	customcolorhelp: [
		`/customcolor [user], [color] - Gives the specified user a customcolor.`,
		`/customcolor [user], delete - Removes a specified user customcolor.`,
	],

	colorpreview: 'checkcolor',
	checkcolor: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;

		let fromName = '';
		let color = target.startsWith('@') ? null : Plugins.Colors.parse(target, ['es', 'en']);
		if (color) {
			target = this.splitTarget(user.name, true);
		} else {
			target = this.splitTarget(target || user.name, true);
			if (this.targetUsername && this.targetUser !== user && (!(this.targetUserid in Users.usergroups))) {
				if (!target && !user.trusted) return this.errorReply(`Not authorized to check a color.`);
			}
			if (!this.targetUserid || this.targetUsername.length > 18) {
				return this.errorReply(`A valid user was not found "${this.targetUsername}".`);
			}
			if (!target) {
				target = Plugins.Colors.get(this.targetUserid);
				fromName = this.targetUsername;
			}
			color = Plugins.Colors.parse(target, ['es', 'en']);
		}
		if (!color) return this.parse('/help checkcolor');

		const targetColorName = fromName ? `[${color.toString('hex')}]` : color.toString('hex');
		const formattedColor = Chat.html`<span style="font-weight:bold; color:${color.toString('hex')}">${targetColorName}</span>`;
		const targetColorDesc = (
			fromName ?
			`The tone ‘${color.getName('es')}’ of ${Plugins.Colors.apply(fromName).bold()} ${formattedColor}` :
			`The tone of ‘${color.getName('es')}’ ${formattedColor}`
		);

		const error = checkLuminosity(color);
		const validationText = this.targetUsername === fromName ? `No problems were detected while validating` : Chat.html`No problems were detected while validating for <strong style="color:${color.toString('hex')}">${this.targetUsername}</strong>`;
		return this.sendReply(
			`|raw|${targetColorDesc} is equivalent to <code>${color.toString('hsl')}</code>.\n` +
			(error || `|raw|${validationText}.`)
		);
	},
	checkcolorhelp: [`/checkcolor [color], [user] - Verifies the appearance of a color and a user name.`],
};
