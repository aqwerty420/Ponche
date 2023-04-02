export const enum HunterBuffs {
  aspectOfTheTurtle = 186265,
  aspectOfTheWild = 193530,
  feignDeath = 5384,
  steadyFocus = 193534,
  trueShot = 288613,
  preciseShot = 260242,
  trickShots = 257622,
  bombardment = 386875,
  salvo = 400456,
  razorFragments = 388998,
  bulletstorm = 389020,
  lockAndLoad = 194594,
  deathblow = 378770,
  bestialWrath = 19574,
  coordinatedAssault = 360952,
  coordinatedAssaultEmpower = 361738,
  spearhead = 360966,
  mongooseFury = 259388,
  aspectOfTheEagle = 186289,
  deadlyDuo = 397568,
}

export const enum PetBuffs {
  frenzy = 272790,
  beastCleave = 118455,
  mend = 136,
}

export const enum HunterDebuffs {
  barbedShot = 217200,
  latentPoison = 378015,
  serpentSting = 271788,
  wildfireBomb = 269747,
  shrapnelBomb = 270339,
  internalBleeding = 270343,
  bloodseeker = 259277,
}

export const enum HunterTalents {
  callOfTheWild = 359844,
  wildCall = 185789,
  scentOfBlood = 193532,
  wildInstincts = 378442,
  alphaPredator = 269737,
  killCleave = 378207,
  beastCleave = 115939,
  trickShots = 257621,
  steadyFocus = 193533,
  chimaeraShot = 342049,
  serpentstalkersTrickery = 378888,
  salvo = 384791,
  volley = 260243,
  surgingShot = 391559,
  streamline = 260367,
  hydrasBite = 260241,
  poisonInjection = 378014,
  carefulAim = 260228,
  preciseShot = 260242,
  loneWolf = 155228,
  wildfireInfusion = 271014,
  vipersVenom = 268501,
  spearhead = 360966,
  deathChakram = 375891,
  coordinatedKill = 385739,
  ranger = 385695,
  intenseFocus = 385709,
  steelTrap = 162488,
  explosiveShot = 212431,
  stampede = 201430,
  wailingArrow = 392060,
}

export const enum Bombs {
  wildfireBomb = 259495,
  pheromoneBomb = 270323,
  shrapnelBomb = 270335,
  volatileBomb = 271045,
}

export const modeParams: IDynamicParameters = {
  all: true,
  rangeFrom: 8,
  alive: true,
  notCc: true,
  notBlacklisted: true,
  immune: true,
};

export const fourthyFightableLosFacing: IDynamicParameters = {
  range: 40,
  alive: true,
  affectingCombat: true,
  notCc: true,
  notBlacklisted: true,
  los: true,
  facing: true,
  immune: true,
};

export const fourthyEngagedLosFacing: IDynamicParameters = {
  range: 40,
  alive: true,
  affectingCombat: true,
  notCc: true,
  los: true,
  facing: true,
};

export const fourthyEngagedLos: IDynamicParameters = {
  range: 40,
  alive: true,
  affectingCombat: true,
  notCc: true,
  los: true,
};

export const eightFightableFacing: IDynamicParameters = {
  range: 8,
  alive: true,
  affectingCombat: true,
  notCc: true,
  facing: true,
  immune: true,
};

export const eightFightable: IDynamicParameters = {
  range: 8,
  alive: true,
  affectingCombat: true,
  notCc: true,
  immune: true,
};

export const meleeFightableLosFacing: IDynamicParameters = {
  melee: true,
  alive: true,
  affectingCombat: true,
  notCc: true,
  facing: true,
  los: true,
  immune: true,
};

export const tierSet = awful.NewItem([200387, 200389, 200390, 200391, 200392]);

awful.addUpdateCallback(() => {
  modeParams.rangeFromUnit = awful.target;
});
