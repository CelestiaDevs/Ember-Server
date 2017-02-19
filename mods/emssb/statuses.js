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
	hurricaned: {
		exists: true,
		onStart: function () {
			this.add('c', '+Hurricane\'d', 'Ay lmao it\'s ya boi. CAP is the best tier, so let me show you.');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+Hurricane\'d', 'Ay ya boi is gettin outta here. Later asshat');
		},
		onFaint: function (pokemon) {
			this.add('c', '+Hurricane\'d', 'You did this because I like CAP didn\'t you. I bet you like OU as well. You\'re tier-ist');
		},
	},
	hoeenhero: {
		exists: true,
		onStart: function () {
			this.add('c', '~HoeenHero', 'Do I have to? I\'m in the middle of programming.');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '~Hoeenhero', 'I can\'t battle now, i\'m too busy.');
		},
		onFaint: function (pokemon) {
			this.add('c', '~HoeenHero', 'Hey! Thats more hax than I get to use >:(');
		},
	},
	hiroz: {
		exists: true,
		onStart: function () {
			this.add('c', '&HiroZ', 'Your wing isn\'t able to fly anywhere!');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '&HiroZ', 'Crawl like the insect you are, I\'ll be back!');
		},
		onFaint: function (pokemon) {
			this.add('c', '&HiroZ', 'Argh... scumbag...');
		},
	},
	admewn: {
		exists: true,
		onStart: function () {
			this.add('c', '+Admewn', 'This battle will be amewsing :]');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+Admewn', 'Brb, I\'ll be mewting someone :]');
		},
		onFaint: function (pokemon) {
			this.add('c', '+Admewn', 'Turn off the mewsic! I\'m out!');
		},
	},
	vulcaron: {
		exists: true,
		onStart: function () {
			this.add('c', '%Vulcaron', 'I will scorch you with 628 blue flames!!! ...I\'m really bad at this.');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '%Vulcaron', 'I\'ll be back, I have a lot of free time');
		},
		onFaint: function (pokemon) {
			this.add('c', '%Vulcaron', 'The flames are dowsed.');
		},
	},
	mystifi: {
		exists: true,
		onStart: function () {
			this.add('c', '~Mystifi', '__I\'ll HM01 u faster then sanic m89__');
		},
		onSwitchOut: function (pokemon) {
		},
		onFaint: function (pokemon) {
			this.add('c', '~Mystifi', '**WOW U HACKER I\'M REPORTING YOU TO ZAREL**');
		},
	},
	krakenmare: {
		exists: true,
		onStart: function () {
			this.add('c', '&Kraken Mare', 'You can\'t touch the master of RAGE!');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '&Kraken Mare', 'I shall spare you today, young one!');
		},
		onFaint: function (pokemon) {
			this.add('c', '&Kraken Mare', 'The RAGE wasn\'t enough to overpower you!');
		},
	},
	almightybronzong: {
		exists: true,
		onStart: function () {
			this.add('c', '+Almighty Bronzong', '``All hail.``');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+Almighty Bronzong', '``I\'m off, night``');
		},
		onFaint: function (pokemon) {
			this.add('c', '+Almighty Bronzong', '``Nice achievement.``');
		},
	},
	opple: {
		exists: true,
		onStart: function () {
			this.add('c', '&Opple', 'lol hi');
		},
		onSwitchOut: function (pokemon) {
		},
		onFaint: function (pokemon) {
			this.add('c', '&Opple', 'I call hacks, fine. You got me, lol, I\'ll get you next time!');
		},
	},
	mimiroppu: {
		exists: true,
		onStart: function () {
			this.add('c', '@Mimiroppu', 'Mimiroppu, charm up~');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '@Mimiroppu', 'I\'ll be back soon bitches');
		},
		onFaint: function (pokemon) {
			this.add('c', '@Mimiroppu', 'Sorry \'bout it...');
		},
	},
	bdh93: {
		exists: true,
		onStart: function () {
			this.add('c', '@BDH93', 'Time for some trolling');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '@BDH93', 'I\'ll be back for more trolling');
		},
		onFaint: function (pokemon) {
			this.add('c', '@BDH93', 'Aww man! No more trolling :(');
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
	spacialbot: {
		exists: true,
		onStart: function () {
			this.add('c', '%Spacial Bot', '``Bot rebooting...``');
			this.add('c', '%Spacial Bot', '``Rebooting complete. Beginning to engage in battle.``');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+The Run', '.battleswitchout');
			this.add('c', '%Spacial Bot', '``var returnMessage = alert("Will return with more power.")``');
		},
		onFaint: function (pokemon) {
			this.add('c', '%Spacial Bot', 'I blame my creator for my loss');
		},
	},
	hydrostatics: {
		exists: true,
		onStart: function () {
			this.add('c', '+Hydrostatics', 'Dare to fight me??');
		},
		onSwitchOut: function (pokemon) {
			this.add('c', '+Hydrostatics', '/me has studies');
		},
		onFaint: function (pokemon) {
			this.add('c', '+Hydrostatics', 'Ok! It was a nice warm up for me! Let\'s battle for real the next time! ;)');
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
