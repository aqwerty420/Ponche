const unitBlacklistData = [
  185685, 185683, 185680, 165251, 165108, 165913, 174175, 171887, 115484,
  190174, 152703, 151613, 194999, 174773, 120651, 101326,
];

const unitStunBlacklistData = [
  //#region DF
  195135, 184331, 184300, 187033, 185529, 190404, 186191, 190609, 184018,
  186121, 186696, 186208, 196115, 187240, 186122, 189729, 187154, 184020,
  186737, 184131, 197219, 192955, 190368, 186226, 186116, 186124, 191739,
  184124, 184581, 190401, 186125, 186644, 184125, 187192, 184582, 191164,
  186740, 192333, 195851, 194316, 190485, 193944, 199717, 186151, 189232,
  193457, 189235, 193462, 189886, 194897, 190034, 195927, 195928, 195929,
  195930, 188252, 197985, 186338, 186339, 189472, 186615, 186616, 187897,
  194315, 198047, 195265, 188244, 192800, 190381, 191847, 194317, 187139,
  196117, 197698, 196671, 194401, 191736, 192680, 56448, 75652, 76057, 59547,
  56732, 184580, 104274, 107435, 97197, 59873, 97202, 186107, 99868, 56762,
  97083, 97084, 96574, 190403, 97219, 104217, 76104, 97081, 95676, 104270,
  104275, 59552, 104278, 95833, 59726, 77700, 200387, 200035, 101637, 59051,
  105704, 95674, 94960, 56439, 75509, 65317, 76407, 59553, 191232, 188673,
  190991, 189719, 197146, 197147, 197148, 197149, 196394, 193330, 189492, 75829,
  196406, 197697, 198214, 196679, 104273, 199027, 199028, 199029, 199030,
  187768, 187771, 187772, 189822, 193154, 193760, 187767, 184972, 189617,
  189234, 59546, 186783, 190496, 191225, 199333, 192934, 197801, 190985, 190245,
  192769, 197298, 190690, 194649, 192694, 192696, 189632, 190405, 187967,
  198343, 199368, 187593, 197835, 187598, 197356, 193232, 169425, 196856,
  169428, 184986, 186739, 195138, 186738, 190686, 197671, 190688, 168932, 76518,
  200936, 192761, 169426, 197793, 190588, 191222, 196855, 192764, 191230,
  192767, 197535,
  //#endregion DF
  //#region OLD
  166473, 164450, 164556, 102616, 169769, 165408, 156827, 165410, 164218,
  164567, 164804, 164501, 164517, 164255, 164967, 164266, 164267, 162100,
  162103, 162102, 165318, 163077, 162058, 162060, 167410, 166880, 163157,
  166882, 166945, 164451, 164461, 164463, 162317, 162329, 162309, 165946,
  175616, 176564, 175646, 176556, 176555, 176705, 175806, 175663, 175546,
  180863, 174175, 167876, 167612, 167607, 164557, 173720, 173714, 173655,
  167111, 165108, 164926, 173044, 172981, 167731, 165919, 165824, 165197,
  165137, 164578, 163621, 163620, 162693, 162689, 171799, 171455, 171376,
  168058, 162133, 162099, 162057, 162047, 162040, 162038, 171343, 171184,
  170572, 170483, 169905, 168942, 168934, 168326, 167964, 167962, 170234,
  169893, 167998, 167538, 167536, 167534, 167533, 163086, 162763, 162744,
  169861, 169498, 168886, 168396, 168393, 168153, 165430, 163894, 163882,
  168844, 168843, 168845, 168681, 168318, 163520, 179334, 178392, 177808,
  179837, 180091, 180495, 179842, 179821, 178165, 178171, 180429, 171333,
  166608, 164558, 164555, 164185, 164929, 168155, 163915, 169159, 162059,
  162061, 164414, 162691, 177269, 181856, 180773, 183937, 183707, 183501,
  181224, 181549, 181551, 181548, 181546, 180967, 184915, 181954, 365120,
  181398, 181334, 182777, 180990, 150222, 150712, 153755, 150159, 150190,
  145185, 144244, 144246, 144248, 150396, 144249, 150397, 151476, 151773,
  152009, 150160, 150276, 150169, 150292, 150168, 114247, 114350, 116494,
  114790, 114328, 114261, 114260, 113971, 114312, 114262, 115388, 115395,
  115406, 115401, 115407, 114330, 114329, 114522, 114265, 114598, 114284,
  114251, 114264, 114895, 189878, 81305, 80808, 86231, 80816, 79852, 83612,
  83613, 83616, 77803, 77816, 79545, 80005, 190128, 114675,
  //#endregion
];

const kickCastData = [
  //#region Raid
  // Burst
  388635,
  //volatile
  388631,
  //storm bolt
  385553,
  //Frost Binds
  374623,
  //Diverted Essence
  387982,
  //Storm Bolt
  384273,
  //Frost Spike
  372315,
  //Lightning Bolt
  372394,
  //#endregion Raid

  //#region Temple of the Jade Serpent
  //Hydrolance
  397888, 397801,
  //Tidal Burst
  397889,
  //Haunting Scream
  395859,
  //Sleepy Soliloquy
  395872,
  //#endregion Temple of the Jade Serpent

  //#region Uldaman
  //Chain Lightning
  369675,
  //Stone Spike
  369674,
  //Spiked Carapace low prio
  //369823,
  //Defensive Bulwark
  369603,
  //Stone Bolt
  369399,
  //Earthen Ward
  369400,
  //Curse of Stone low prio
  //369365
  //Hasten
  377500,
  //Spiked Carapace
  369823,
  //#endregion Uldaman

  //#region Neltharus
  //Burning Roar
  395427,
  //Ember Reach
  372615,
  //Lava Bolt
  396925,
  //#endregion Neltharus

  //#region Brackenhide Hollow
  //Burst of Decay
  374544,
  //Decay Surge
  382474,
  //Gushing Ooze
  381770,
  //Touch of Decay
  373804,
  //Screech
  385029,
  //Earth Bolt low prio
  378155,
  //Greater Healing Rapids
  377950,
  //Hideous Cackle
  367500,
  //Earth Bolt
  382249,
  //#endregion Brackenhide Hollow

  //#region Halls of Infusion
  //Earth Shield
  374066,
  //Demoralizing Shout
  374339,
  //Blasting Gust
  374080,
  //Purifying Blast
  389443,
  //Rumbling Earth
  375384,
  //Pyretic Burst
  374706,
  //Dazzle
  374563,
  //Aqueous Barrier
  377402,
  //Tidal Divergence
  377341,
  //Ice Shards
  375950,
  //#endregion Halls of Infusion

  //#region Algeth'ar Academy
  // Mystic Blast
  396812,
  // Surge
  388862,
  //Call of the Flock
  377389,
  //Healing Touch
  396640,
  //Astral Bomb
  387843,
  // Mana Void
  388863,
  //#endregion Algeth'ar Academy

  //#region Azure Vault
  // Mystic Vapors
  387564,
  // Illusionary Bolt
  373932,
  // Arcane Bolt
  371306,
  // Waking Bane
  386546,
  // Heavy Tome (low priority)
  389804,
  // Condensed Frost
  377503,
  // Icy Bindings
  377488,
  //Erratic Growth
  375602,
  //#endregion Azure Vault

  //#region Nokhud Offensive
  // Disruptive Shout
  384365,
  // Tempest
  386024,
  // Stormbolt
  386012,
  // Dominate
  387606,
  // Death Bolt Volley
  387411,
  // Storm Bolt
  376725,
  // Dismantle
  386490,
  //#endregion

  //#region Ruby Life Pools
  // Shock Blast
  392924,
  // Ice Shield
  372743,
  // Icebolt
  371984,
  // Roaring Blaze
  373017,
  // Flashfire
  392451,
  // Lightning Bolt
  385310,
  // Crackling Detonation (low priority)
  392398,
  // Cold Claws
  373803,
  // Cinderbolt (low priority)
  384194,
  //#endregion Ruby Life Pools

  //#region Halls of Valor
  // Thunderous Bolt
  198595,
  // Healing Light
  198931,
  // Rune of Healing
  198934,
  // Shattered Rune
  198962,
  // Cleansing Flames
  192563,
  // Searing Light
  192288,
  // Unnerving Howl (If kickable ?)
  // 196543,
  // Unruly Yell
  199726,
  // Surge
  198750,
  //Holly radiancd
  215433,
  //#endregion

  //#region Court of Stars
  // Sound Alarm
  210261,
  // Hinder
  215204,
  // Drain Magic
  209485,
  // Seal Magic
  209404,
  // Suppress
  209413,
  // Charging Station
  225100,
  // Searing Glare
  211299,
  // Bewitch
  211470,
  // Firebolt
  211406,
  // Withering Soul
  208165,
  // Fortification
  209033,

  //#endregion

  //#region Shadowmoon Burial Grounds
  // Death Venom
  156717,
  // Void Pulse
  152964,
  // Necrotic Burst (lower priority)
  156718,
  //Plague Spit
  153524,
  //Death Blast
  398206,
  //#endregion Shadowmoon Burial Grounds

  //#region Old

  //#region karazhan
  // Soul Leech
  228254,
  // Terrifying Wail
  228239,
  //#endregion

  //#region karazhan Upper
  // Arcane Barrage
  228700,
  // Piercing Missiles
  227628,
  // Frostbite
  227592,
  //Soul Leech
  228255,
  // Arcane Bolt
  228991,
  // 229083, 228991 not mandatory
  //#endregion

  //#region karazhan Lower
  228025, 227917, 232115, 226344, 227616, 227800, 227987, 228019, 227420,
  227341, 228279, 226316, 227578, 228606, 228280, 228277, 229307, 228625,
  227543, 227542, 228278, 228086, 227999, 228528, 241828,
  //#endregion karazhan Lower

  //#region Grimrail Depot
  166398, 166335, 176032,
  //#endregion Grimrail Depot

  //#region Iron docks
  165122, 164426, 178154, 173307,
  //#endregion Iron docks

  //#region Mechagon
  299475,
  //#endregion Mechagon

  //#region Shadowlands
  319070, 329239, 328094, 321999, 322358, 328338, 328651, 332329, 332706,
  332666, 332612, 332084, 321764, 333875, 334076, 332605, 332196, 332234,
  320008, 319654, 321038, 322433, 321105, 334653, 335305, 326952, 325700,
  325876, 326607, 328322, 323538, 323552, 325701, 322938, 324914, 324776,
  321828, 326046, 337235, 322450, 340544, 337251, 337253, 327413, 317936,
  317963, 328295, 328137, 328331, 327648, 341902, 341969, 342139, 330562,
  330868, 330784, 330810, 333231, 341977, 330586, 342675, 324589, 334748,
  320462, 324293, 320170, 338353, 333623, 328667, 323190, 335143, 357188,
  355934, 355057, 355225, 346980, 352347, 354297, 357284, 356031, 350922,
  353835, 347775, 355642, 349934, 347015, 358344, 356133, 357260, 351119,
  360177, 364030, 362383, 360259, 365008, 365385, 300650, 300414, 300171,
  299588, 300087, 298669, 300514, 300436, 301629, 284219, 301689, 301088,
  293930, 293729, 300764, 356407, 355641,
  //#endregion Shadowlands

  //#endregion Old
];

const kickChannelingData = [
  //#region Temple of the Jade Serpent
  //Defiling Mist
  397914,
  //Cat Nap
  396073,
  //#endregion Temple of the Jade Serpent

  //#region Uldaman
  // Defensive Bulwark
  369603,
  //#endregion Uldaman

  //#region Nokhud Offensive
  // Guardian Wind
  384808,
  //#endregion

  //#region Halls of Valor
  // Etch
  198959,
  //#endregion

  //#region Court of Stars
  // Drifting Embers
  211401,
  //Disintegration Beam
  207980,
  //#endregion

  //#region Shadowmoon Burial Grounds
  // Rending Voidlash
  156776,
  //#endregion

  //#region Rubis Life Pool
  // Ice Shield
  372743,
  // Frost Overload
  373680,
  //#endregion
];

const kickChanneledData = [
  //#region Algeth'ar Academy
  // Monotonous Lecture
  388392,
  //#endregion Algeth'ar Academy

  //#region Azure Vault
  // Peck
  377344,
  // Erratic Growth
  375596,
  //#endregion Azure Vault
];

const stunCastData = [
  //#region Temple of the Jade Serpent
  //Leg Sweep
  397899,
  //#endregion Temple of the Jade Serpent

  //#region Court of Start
  //Quelling Strike, can be dodged but not fun
  209027,
  //#endregion Court of Start

  //#region Neltharus
  //Magma Conflagration
  378818,
  //#endregion Neltharus

  //#region Brackenhide Hollow
  //Scented Meat
  384961,
  //#endregion Brackenhide Hollow

  //#region Algeth'ar Academy
  // Mystic Blast
  396812,
  //#endregion Algeth'ar Academy

  //#region Azure Vault
  // Shriek
  370225,
  // Null Stomp
  386526,
  //#endregion Azure Vault

  //#region Nokhud Offensive
  // Rally the Clan
  383823,
  // Desecrating Roar
  387440,
  // Arcing Strike
  387135,
  // Pierce (if mob "Nokhud Warspear" stunnable)
  //384134,
  //#endregion

  //#region Ruby Life Pools
  // Tectonic Slam
  372735,
  //#endregion Ruby Life Pools

  //#region Court of Stars
  // Eye Storm
  212784,
  // Fel Detonation
  211464,
  //#endregion Court of Stars

  //#region Old

  //#region Grimrail Depot
  // 50,000 Volts
  164192,
  //#endregion Grimrail Depot

  //#region Shadowlands
  332329, 332671, 332156, 334664, 326450, 325701, 324987, 317936, 317661,
  321935, 328429, 336451, 328651, 328400, 322169, 320822, 321807, 334747,
  330586, 355132, 355640, 347721, 355057, 294103, 293861,
  //#endregion Shadowlands

  //#endregion Old
];

const stunChanneledData = [
  //#region Old

  //#region Grimrail Depot
  // Activating
  163966,
  //#endregion Grimrail Depot

  //#endregion Old
];

const stunChannelingData = [
  //#region Rubis Life Pool
  // Flame Dance
  385536,
  //#endregion

  //#region Uldaman
  //Hail of Stone
  369465,
  //Molten Core
  378282,
  //#endregion Uldaman

  //#region Halls of Infusion
  //Thunderstorm
  385141,
  //Infuse
  387618,
  //#endregion Halls of Infusion

  //#region Algeth'ar Academy
  // Astral Whirlwind
  387910,
  //#endregion Algeth'ar Academy

  //#region Court of Stars
  // Drifting Embers
  211401,
  //#endregion Court of Stars

  //#region Shadowmoon Burial Grounds
  // Rending Voidlash
  156776,
  //#endregion Shadowmoon Burial Grounds

  //#region Old

  //#region Shadowlands
  328177, 331743, 332671, 332156, 325701, 324987, 317936, 317661, 333540,
  294103, 228200,
  //#endregion Shadowlands

  //#endregion Old
];

const bypassThreatData = [197398, 195138, 194999];

const damagesData = [
  'Omen of Death',
  'Corpse Breath',
  'Soul Shred',
  'Dark Eclipse',
  'Ragnarok',
  'Eye of the Storm',
  'Horn of Valor',
  'Slicing Maelstrom',
  'Burning Intensity',
  'Infernal Eruption',
  'Arcane Lockdown',
  'Crackling Upheaval',
  'Stormwinds',
  'Electrical Storm',
  'Uncontrollable Energy',
  'Tectonic Stomp',
  'Shards of Stone',
  'Eruption',
  'Unleashed Destruction',
  'Icy Devastator',
  'Absolute Zero',
  'Overwhelming Energy',
  'Consuming Stomp',
  'Explosive Brand',
  'Inferno',
  'Hailbombs',
  'Chillstorm',
  'Power Vacuum',
  'Deafening Screech',
  'Burst Forth',
  'Mana Bombs',
  'Arcane Fissure',
];

const magic = [
  'Corpse Breath',
  'Soul Shred',

  'Eye of the Storm',

  'Unleashed Destruction',

  'Stormwinds',
  'Electrical Storm',

  'Consuming Stomp',

  'Inferno',
  'Hailbombs',
  'Chillstorm',
  'Molten Blood',
  'Winds of Change',
  'Lightning Storm ',

  'Power Vacuum',
  'Deafening Screech',
  'Burst Forth',
  'Arcane Fissure',
];

const aoe = [
  'Eye of the Storm',
  'Horn of Valor',

  'Slicing Maelstrom',
  'Burning Intensity',
  'Infernal Eruption',

  'Eruption',
  'Stormwinds',
  'Electrical Storm',

  'Unleashed Destruction',
  'Overwhelming Energy',
  'Consuming Stomp',

  'Inferno',
  'Hailbombs',
  'Chillstorm',
  'Molten Blood',
  'Winds of Change',
  'Lightning Storm ',

  'Power Vacuum',
  'Deafening Screech',
  'Burst Forth',
  'Arcane Fissure',
];
class MyDictionnary {
  private dictionnary: { [key: number | string]: boolean } = {};

  constructor(list: Array<number | string>) {
    for (const key of list) {
      this.dictionnary[key] = true;
    }
  }

  public has(key: number | string | boolean): boolean {
    return this.dictionnary[key as number] === true;
  }
}

export const unitBlacklist = new MyDictionnary(unitBlacklistData);
export const unitStunBlacklis = new MyDictionnary(unitStunBlacklistData);
export const kickCast = new MyDictionnary(kickCastData);
export const kickChanneling = new MyDictionnary(kickChannelingData);
export const kickChanneled = new MyDictionnary(kickChanneledData);
export const stunCast = new MyDictionnary(stunCastData);
export const stunChanneled = new MyDictionnary(stunChanneledData);
export const stunChanneling = new MyDictionnary(stunChannelingData);
export const bypassThreat = new MyDictionnary(bypassThreatData);
export const damages = new MyDictionnary(damagesData);
export const magicList = new MyDictionnary(magic);
export const aoeList = new MyDictionnary(aoe);

export const enum EnemyBuffs {
  inspiringPresence = 343502,
  sentinelsWatch = 215435,
  iceShield = 372749,
  iceBulwark = 372988,
}
