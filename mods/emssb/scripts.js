'use strict';

exports.BattleScripts = {
	randomSeasonalRegStaffTeam: function (side) {
		let team = [];
		let variant = this.random(2);

		let sets = {
			// Admins.
			'~DeltaSkiez': {
				species: 'Serperior',
				ability: 'Overgrow',
				item: 'Focus Sash',
				gender: 'M',
				moves: [
					['Giga Drain', 'Leaf Storm'][variant], 'Return', 'Rest',
				],
				signatureMove: 'Grass Storm',
				evs: {
					spa: 252,
					spe: 252,
					hp: 4,
				},
				nature: 'Modest',
			},
			'~HurriKaine': {
				species: 'Clefairy',
				ability: 'Analytic',
				item: 'Eviolite',
				gender: 'F',
				moves: [
					['Calm Mind', 'Cosmic Power'][variant], 'Soft-Boiled', 'Stored Power',
				],
				signatureMove: 'Mystic Mirage',
				evs: {
					hp: 252,
					def: 252,
					spd: 4,
				},
				nature: 'Bold',
			},
			'~Revival Viosmic': {
				species: 'Kartana',
				ability: 'Beast Boost',
				item: 'Choice Scarf',
				moves: ['Power Whip', 'V-create', 'Bolt Strike',
				],
				signatureMove: 'Paper Cut',
				evs: {
					atk: 252,
					spe: 252,
					hp: 4,
				},
				nature: 'Jolly',
			},
			
			// Global Leaders:
			'&Blooded Kitten': {
				species: 'Genesect',
				ability: 'Download',
				item: 'Choice Scarf',
				moves: ['U-turn', 'Ice Beam', 'Explosion',
				],
				signatureMove: 'Crystallized Ukaku',
				evs: {
					atk: 252,
					spe: 252,
					spa: 4,
				},
				nature: 'Hasty',
			},
			'&Fleur Fee': {
				species: 'Roserade',
				ability: 'Natural Cure',
				item: 'Expert Belt',
				gender: 'F',
				moves: ['Sludge Bomb', 'Shadow Ball', 'Aromatherapy',
				],
				signatureMove: 'Bloody Rose',
				evs: {
					spa: 252,
					spe: 252,
					hp: 4,
				},
				nature: 'Timid',
			},
			
			// Global Moderators:
			'@Imp Latios': {
				species: 'Latios',
				ability: 'Levitate',
				item: 'Soul Dew',
				gender: 'M',
				moves: ['Thunderbolt', 'Ice Beam', 'Psyshock',
				],
				signatureMove: 'Draco Shower',
				evs: {
					hp: 4,
					spa: 252,
					spe: 252,
				},
				nature: 'Timid',
			},
			'@Revival Hanna': {
				species: 'Gyarados',
				ability: 'Guts',
				item: 'Leftovers',
				gender: 'M',
				moves: ['Substitute', 'Dragon Dance', 'Bounce',
				],
				signatureMove: 'Tsunami Crash',
				evs: {
					atk: 252,
					spe: 252,
					hp: 4,
				},
				nature: 'Adamant',
			},

			// Global Drivers:
			'%Flaming Aurora': {
				species: 'Rayquaza-Mega',
				ability: 'Delta Stream',
				item: 'Assault Vest',
				gender: 'F',
				moves: ['Dragon Dance', 'Dragon Ascent', 'Air Slash',
				],
				signatureMove: 'Crest of Death',
				evs: {
					spe: 252,
					atk: 252,
					hp: 4,
				},
				nature: 'Adamant',
			},
			'%SakuraShaymin': {
				species: 'Golduck',
				ability: 'Cloud Nine',
				item: 'Leftovers',
				gender: 'M',
				moves: ['Scald', 'Ice Beam', 'Psychic',
				],
				signatureMove: 'Duck Power',
				evs: {
					spa: 252,
					spe: 252,
					hp: 4,
				},
				nature: 'Modest',
			},
			
			// Global Bots:
			'*EmberBoTT': {
				species: 'Porygon-Z',
				ability: 'Adaptability',
				item: 'Leftovers',
				moves: ['Double-Edge', 'Protect', 'Psyshock',
				],
				signatureMove: 'Ember Storm',
				evs: {
					atk: 252,
					spd: 252,
					hp: 4,
				},
				nature: 'Adamant',
			},
			
			// Global Operators:
			'$RevivalLeaderClair': {
				species: 'Garchomp',
				ability: 'Rough Skin',
				item: 'Leftovers',
				moves: ['Rock Tomb', 'Earthquake', 'Swords Dance',
				],
				signatureMove: 'Dragon Blitz',
				evs: {
					atk: 252,
					spe: 252,
					spd: 4,
				},
				nature: 'Jolly',
			},
			'$VaporeonHydroxide': {
				species: 'Vaporeon',
				ability: 'Water Absorb',
				item: 'Leftovers',
				moves: ['Scald', 'Protect', 'Toxic',
				],
				signatureMove: 'Devotion',
				evs: {
					spa: 252,
					spd: 252,
					hp: 4,
				},
				nature: 'Adamant',
			},
			
			// Global Voices:
			'+Perfect Rose': {
				species: 'Aggron',
				ability: 'Sturdy',
				item: 'Leftovers',
				moves: ['Head Smash', 'Thunder Punch', 'Earthquake',
				],
				signatureMove: 'Tri-Horn Bash',
				evs: {
					def: 8,
					atk: 252,
					hp: 248,
				},
				nature: 'Adamant',
			},
			'+Crystal gray': {
				species: 'Greninja',
				ability: 'Protean',
				item: 'Expert Belt',
				moves: ['Dark Pulse', 'Extrasensory', 'Ice Beam',
				],
				signatureMove: 'Hydro Smash',
				evs: {
					spa: 252,
					spe: 252,
					hp: 4,
				},
				nature: 'Timid',
			},
			'+Legacy Saffron': {
				species: 'Luxray',
				ability: 'Rivalry',
				item: 'Leftovers',
				moves: ['Discharge', 'Crunch', 'Ice Fang',
				],
				signatureMove: 'Power Cut',
				evs: {
					atk: 252,
					spe: 252,
					spd: 4,
				},
				nature: 'Jolly',
			},
		};
		// convert moves to ids.
		for (let k in sets) {
			sets[k].moves = sets[k].moves.map(toId);
			sets[k].baseSignatureMove = toId(sets[k].baseSignatureMove);
		}

		// Generate the team randomly.
		let pool = Object.keys(sets);
		for (let i = 0; i < 6; i++) {
			let name = this.sampleNoReplace(pool);
			let set = sets[name];
			set.level = 100;
			set.name = name;
			if (!set.ivs) {
				set.ivs = {
					hp: 31,
					atk: 31,
					def: 31,
					spa: 31,
					spd: 31,
					spe: 31,
				};
			} else {
				for (let iv in {
					hp: 31,
					atk: 31,
					def: 31,
					spa: 31,
					spd: 31,
					spe: 31,
				}) {
					set.ivs[iv] = iv in set.ivs ? set.ivs[iv] : 31;
				}
			}
			// Assuming the hardcoded set evs are all legal.
			if (!set.evs) {
				set.evs = {
					hp: 84,
					atk: 84,
					def: 84,
					spa: 84,
					spd: 84,
					spe: 84,
				};
			}
			set.moves = [this.sampleNoReplace(set.moves), this.sampleNoReplace(set.moves), this.sampleNoReplace(set.moves)].concat(set.signatureMove);
			team.push(set);
		}
		return team;
	},
};
