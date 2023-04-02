const NewSpell = awful.NewSpell;

// General

export const autoShot = NewSpell(75);

export const barbedShot = NewSpell(217200, {
  targeted: true,
  ranged: true,
  bleed: true,
  damage: AwfulSpellType.physical,
});

export const barrage = NewSpell(120360, {
  targeted: false,
});

export const killCommandBM = NewSpell(34026, {
  targeted: true,
  ranged: true,
  damage: AwfulSpellType.physical,
});

export const cobraShot = NewSpell(193455, {
  targeted: true,
  ranged: true,
  damage: AwfulSpellType.physical,
});

export const killShot = NewSpell(53351, {
  castByID: true,
  targeted: true,
  ranged: true,
});

export const multiShotBM = NewSpell(2643, {
  targeted: true,
  ranged: true,
  damage: AwfulSpellType.physical,
});

export const multiShotMM = NewSpell(257620, {
  targeted: true,
  ranged: true,
  damage: AwfulSpellType.physical,
});

export const aimedShot = NewSpell(19434, {
  targeted: true,
  ranged: true,
  damage: AwfulSpellType.physical,
});

export const steadyShot = NewSpell(56641, {
  targeted: true,
  ranged: true,
  ignoreMoving: true,
  damage: AwfulSpellType.physical,
});

export const arcaneShot = NewSpell(185358, {
  targeted: true,
  ranged: true,
});

export const serpentSting = NewSpell(271788, {
  targeted: true,
  ranged: true,
});

export const wildfireBomb = NewSpell(259495, {
  targeted: true,
  ranged: true,
});

export const carve = NewSpell(187708, {
  targeted: false,
});

export const butchery = NewSpell(212436, {
  targeted: false,
});

export const mongooseBite = NewSpell(259387, {
  targeted: true,
});

export const mongooseBiteRanged = NewSpell(265888, {
  targeted: true,
  ranged: true,
});

export const raptorStrike = NewSpell(186270, {
  targeted: true,
});

export const raptorStrikeRanged = NewSpell(265189, {
  targeted: true,
  ranged: true,
});

export const killCommandSV = NewSpell(259489, {
  targeted: true,
  ranged: true,
});

export const killShotSV = NewSpell(320976, {
  targeted: true,
  ranged: true,
  damage: AwfulSpellType.physical,
});

// Cooldowns

export const aMurderofCrows = NewSpell(131894, {
  targeted: true,
  ranged: true,
});

export const bestialWrath = NewSpell(19574, {
  targeted: false,
});

export const bloodshed = NewSpell(321530, {
  targeted: true,
  bleed: true,
  ranged: true,
});

export const aspectOfTheWild = NewSpell(193530, {
  targeted: true,
  ranged: true,
});

export const callOfTheWild = NewSpell(359844, {
  targeted: false,
});

export const explosiveShot = NewSpell(212431, {
  targeted: true,
  ranged: true,
});

export const steelTrap = NewSpell(162488, {
  targeted: false,
  ranged: true,
  radius: 3,
});

export const wailingArrow = NewSpell(392060, {
  targeted: true,
  ranged: true,
  damage: AwfulSpellType.magic,
});

export const deathChakram = NewSpell(375891, {
  targeted: true,
  ranged: true,
  damage: AwfulSpellType.magic,
});

export const direBeast = NewSpell(120679, {
  targeted: true,
  ranged: true,
});

export const stampede = NewSpell(201430, {
  targeted: false,
  ranged: true,
});

export const volley = NewSpell(260243, {
  targeted: false,
  ranged: true,
  radius: 8,
});

export const salvo = NewSpell(400456, {
  targeted: false,
});

export const rapidFire = NewSpell(257044, {
  targeted: true,
  ranged: true,
  ignoreMoving: true,
});

export const chimaeraShot = NewSpell(342049, {
  targeted: true,
  ranged: true,
});

export const trueshot = NewSpell(288613, {
  targeted: false,
});

export const coordinatedAssault = NewSpell(360952, {
  targeted: true,
  ranged: true,
});

export const furyOfTheEagle = NewSpell(203415, {
  targeted: false,
});

export const flankingStrike = NewSpell(269751, {
  targeted: true,
  ranged: true,
});

export const spearhead = NewSpell(360966, {
  targeted: true,
  ranged: true,
});

// Utility

export const muzzle = NewSpell(187707, {
  targeted: true,
});

export const freezingTrap = NewSpell(187650, {
  ranged: true,
  cc: CCType.stun,
  radius: 3,
  targeted: false,
});

export const tarTrap = NewSpell(187698, {
  ranged: true,
  radius: 3,
  targeted: false,
});

export const flare = NewSpell(1543, {
  ranged: true,
  radius: 10,
  targeted: false,
});

export const bindingShot = NewSpell(109248, {
  ranged: true,
  radius: 5,
  targeted: false,
});

export const huntersMark = NewSpell(257284, {
  targeted: true,
  ranged: true,
});

export const tranquilizingShot = NewSpell(19801, {
  targeted: true,
  ranged: true,
});
export const intimidation = NewSpell(19577, {
  targeted: true,
  ranged: true,
  ignoreFacing: true,
});

export const feignDeath = NewSpell(5384, {
  targeted: false,
});

export const misdirection = NewSpell(34477, {
  targeted: true,
  ranged: true,
  ignoreFacing: true,
});

export const disengage = NewSpell(781, {
  targeted: false,
});

export const counterShot = NewSpell(147362, {
  targeted: true,
  ranged: true,
});

// Defensives

export const exhilaration = NewSpell(109304, {
  targeted: false,
});

export const aspectOfTheTurtle = NewSpell(186265, {
  targeted: false,
});

export const survivalOfTheFittest = NewSpell(264735, {
  targeted: false,
});

export const fortitudeOfTheBear = NewSpell(388035, {
  targeted: false,
});

// Pet

export const mendRevivePet = NewSpell(982, { targeted: false });

export const callPet1 = NewSpell(883, { targeted: false });

export const callPet2 = NewSpell(83242, { targeted: false });

export const callPet3 = NewSpell(83243, { targeted: false });

export const callPet4 = NewSpell(83244, { targeted: false });

export const callPet5 = NewSpell(83245, { targeted: false });
