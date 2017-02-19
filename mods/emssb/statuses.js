'use strict';
exports.BattleStatuses = {
	crystalgray: {
		exists: true,
		onStart: function () {
			this.add('c', '+Crystal Gray', 'Ayyyyyyy lmao');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+Crystal Gray', 'you can get wet later ;)');
		},
		onFaint: function (pokemon) {
			this.add('c', '+Crystal Gray', 'Shit I got cleaned');
		},
	},
	flamingaurora: {
		exists: true,
		onStart: function () {
			this.add('c', '%Flaming Aurora', 'Imp Latios Sucks');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '%Flaming Aurora', 'Lemme Go Sleep');
		},
		onFaint: function (pokemon) {
			this.add('c', '%Flaming Aurora', 'llamatea');
		},
	},
	implatios: {
		exists: true,
		onStart: function () {
			this.add('c', '@Imp Latios', 'My powers have doubled since last time we\'ve met.');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '@Imp Latios', 'I\'ll be back!');
		},
		onFaint: function (pokemon) {
			this.add('c', '@Imp Latios', 'You had the high ground...');
		},
	},
	revivalleaderclair: {
		exists: true,
		onStart: function () {
			this.add('c', '$RevivalLeaderClair', 'Good Luck');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '$RevivalLeaderClair', 'I\'ll be back!');
		},
		onFaint: function (pokemon) {
			this.add('c', '$RevivalLeaderClair', 'I have been defeated');
		},
	},
	fleurfee: {
		exists: true,
		onStart: function () {
			this.add('c', '&Fleur Fee', 'Ohayo-yo!');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '&Fleur Fee', 'Oyasumi-mi! <3');
		},
		onFaint: function (pokemon) {
			this.add('c', '&Fleur Fee', 'Owchies...');
		},
	},
	revivalviosmic: {
		exists: true,
		onStart: function () {
			this.add('c', '~Revival Viosmic', 'You done goofed!');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '~Revival Viosmic', 'About 99.9% done.');
		},
		onFaint: function (pokemon) {
			this.add('c', '~Revival Viosmic', 'I done goofed.');
		},
	},
	legacysaffron: {
		exists: true,
		onStart: function () {
			this.add('c', '+Legacy Saffron', 'Hello.');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+Legacy Saffron', 'I\'ll be right back.');
		},
		onFaint: function (pokemon) {
			this.add('c', '+Legacy Saffron', 'Well played.');
		},
	},
	deltaskiez: {
		exists: true,
		onStart: function () {
			this.add('c', '~DeltaSkiez', 'Good luck you\'ll need it!');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '~DeltaSkiez', 'I\'ll be back.');
		},
		onFaint: function (pokemon) {
			this.add('c', '~DeltaSkiez', 'I have failed.');
		},
	},
	emberbott: {
		exists: true,
		onStart: function () {
			this.add('c', '*EmberBoTT', 'You will never beat me!');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '*EmberBoTT', 'You haven\'t won yet I shall return.');
		},
		onFaint: function (pokemon) {
			this.add('c', '*EmberBoTT', 'That was not fair I\'m out.');
		},
	},
	bloodedkitten: {
		exists: true,
		onStart: function () {
			this.add('c', '&Blooded Kitten', 'This battle will be amewsing :]');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '&Blooded Kitten', 'Brb, I\'ll be mewting someone :]');
		},
		onFaint: function (pokemon) {
			this.add('c', '&Blooded Kitten', 'Turn off the mewsic! I\'m out!');
		},
	},
	hurrikaine: {
		exists: true,
		onStart: function () {
			this.add('c', '~HurriKaine', 'I will scorch you with 628 blue flames!!! ...I\'m really bad at this.');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '~HurriKaine', 'I\'ll be back, I have a lot of free time');
		},
		onFaint: function (pokemon) {
			this.add('c', '~HurriKaine', 'The flames are dowsed.');
		},
	},
	revivalhanna: {
		exists: true,
		onStart: function () {
			this.add('c', '@Revival Hanna', 'You can\'t touch the master of RAGE!');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '@Revival Hanna', 'I shall spare you today, young one!');
		},
		onFaint: function (pokemon) {
			this.add('c', '@Revival Hanna', 'The RAGE wasn\'t enough to overpower you!');
		},
	},
	sakurashaymin: {
		exists: true,
		onStart: function () {
			this.add('c', '%SakuraShaymin', '``All hail.``');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '%SakuraShaymin', '``I\'m off, night``');
		},
		onFaint: function (pokemon) {
			this.add('c', '%SakuraShaymin', '``Nice achievement.``');
		},
	},
	vaporeonhydroxide: {
		exists: true,
		onStart: function () {
			this.add('c', '$VaporeonHydroxide', 'Mimiroppu, charm up~');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '$VaporeonHydroxide', 'I\'ll be back soon bitches');
		},
		onFaint: function (pokemon) {
			this.add('c', '$VaporeonHydroxide', 'Sorry \'bout it...');
		},
	},
	perfectrose: {
		exists: true,
		onStart: function () {
			this.add('c', '+Perfect Rose', 'Time for some trolling');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+Perfect Rose', 'I\'ll be back for more trolling');
		},
		onFaint: function (pokemon) {
			this.add('c', '+Perfect Rose', 'Aww man! No more trolling :(');
		},
	},
	c733937123: {
		exists: true,
		onStart: function () {
			this.add('c', '@C733937 123', 'Hello opponent, Welcome to Spacial Bros, I, C733937 123, shall defeat you.....hopefully.');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '@C733937 123', '*laughs* Now you have to defeat a stronger ally....and have to still face me later where I can have a better chance at *distorted voice* KiLlInG YoU To wIn!!!');
		},
		onFaint: function (pokemon) {
			this.add('c', '@C733937 123', 'What, I...got defeated by some lousy fighter like you??? Well...Good luck next time we fight for both of us....but why did I lose?');
		},
	},
	auction: {
		exists: true,
		onStart: function () {
			this.add('c', '+Auction', 'I think its time for the man to take his throne.');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+Auction', 'I think I should take a bathroom break');
		},
		onFaint: function (pokemon) {
			this.add('c', '+Auction', 'Ya know, I think I should\'ve gotten __burn everything__ as my ability ;_;');
		},
	},
	ranfen: {
		exists: true,
		onStart: function () {
			this.add('c', '+Ranfen', 'Watch Out Ice mons!');
		},
		onSwitchOut: function (pokemon) {
		},
		onFaint: function (pokemon) {
			this.add('c', '+Ranfen', 'No Fair flygon cant be beat D:');
		},
	},
	xavier1942: {
		exists: true,
		onStart: function () {
			this.add('c', '+Xavier1942', 'Behold, THE GREAT WALL OF...um...HAAAAAAX!');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+Xavier1942', 'I\'ll be back, i have business to take care of *Runs away shouting "WEE WOO WEE WOO WEE WOO*');
		},
		onFaint: function (pokemon) {
			this.add('c', '+Xavier1942', 'Nuuuuu! MY BEAUTIFUL WALL! ');
		},
	},
};
