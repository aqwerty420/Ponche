import { MyCheckBox } from '../base/gui';
import { mechanicsHandler } from '../base/mechanics';
import { hunterGui } from './gui';
import * as hunterSpells from './spells';

const shadesHandler = () => {
  if (!hunterGui.spiteful.enabled()) return;

  awful.shades.loop((shade) => {
    hunterSpells.bindingShot('mechanic', shade);
    hunterSpells.tarTrap('mechanic', shade);
  });
};

let lastExplosive = 0;
let lastRotation = 0;
let rotationModified = false;

const getClosestToExplode = (): IAwfulUnit | undefined => {
  let bestExplosive: IAwfulUnit | undefined = undefined;

  awful.explosives.loop((explosive) => {
    if (
      explosive.distance <= 40 &&
      explosive.los &&
      (!bestExplosive ||
        (explosive.castPct > bestExplosive.castPct &&
          explosive.castRemains > awful.buffer + 0.5))
    ) {
      bestExplosive = explosive;
    }
  });

  return bestExplosive;
};

const killClosestToExplode = (explosive: IAwfulUnit) => {
  if (explosive.castRemains < awful.buffer + 0.5) return;

  if (!explosive.playerFacing) {
    lastRotation = awful.player.rotation;
    rotationModified = true;
    explosive.face();
  }

  if (
    hunterSpells.cobraShot('mechanic', explosive) ||
    hunterSpells.arcaneShot('mechanic', explosive) ||
    hunterSpells.serpentSting('mechanic', explosive)
  ) {
    lastExplosive = awful.time;
  }
};

const explosivesHandler = () => {
  if (!hunterGui.explosives.enabled()) return;

  if (rotationModified) {
    awful.player.face(lastRotation);
    rotationModified = false;
  }

  const explosives = awful.explosives;
  const explosive = getClosestToExplode();

  if (!explosive) return;

  if (
    hunterGui.explosivesBypassCount.enabled() &&
    explosives.length > hunterGui.explosivesBypassCountNumber.value()
  ) {
    return killClosestToExplode(explosive);
  }

  if (hunterGui.explosivesBypassCast.enabled() && explosive.castPct > 70) {
    return killClosestToExplode(explosive);
  }

  if (lastExplosive + hunterGui.explsivesDelay.value() > awful.time) return;

  const minCast = hunterGui.explosivesMinCast.value();

  if (explosive.castPct > minCast) {
    killClosestToExplode(explosive);
  }
};

export const hunterMechanics = () => {
  shadesHandler();
  explosivesHandler();

  mechanicsHandler.run();
};

const dragonflightTab = hunterGui.mechanicsGroup.Tab('Dragonflight');

dragonflightTab.Text({
  text: 'Vault of the Incarnates',
  header: true,
});

const volatileSpark = new MyCheckBox(
  'volatileSpark',
  dragonflightTab,
  'Volatile Spark',
  'Kick / Dispel Volatile Spark'
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return volatileSpark.enabled();
  },
  [
    hunterSpells.tranquilizingShot,
    hunterSpells.counterShot,
    hunterSpells.muzzle,
    hunterSpells.freezingTrap,
    hunterSpells.intimidation,
  ],
  194999
);

dragonflightTab.Text({
  text: "Algeth'ar Academy",
  header: true,
});

const monotonousLecture = new MyCheckBox(
  'monotonousLecture',
  dragonflightTab,
  'Monotonous Lecture',
  "Use Feign Death on 'Monotonous Lecture' - Unruly Textbook"
);
// TODO: channelTarget
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.channelID === 388392 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.channelRemains <= awful.gcd + awful.buffer * 2 &&
      unit.channelRemains > awful.buffer &&
      monotonousLecture.enabled()
    );
  },
  [hunterSpells.feignDeath],
  196044
);

const manaVoid = new MyCheckBox(
  'manaVoid',
  dragonflightTab,
  'Mana Void',
  "Use Feign Death on 'Mana Void' - Corrupted Manafiend"
);
const manavoidCallback = (unit: IAwfulUnit) => {
  return (
    unit.castID === 388863 &&
    unit.castTarget != undefined &&
    unit.castTarget.isUnit(awful.player) &&
    unit.castRemains <= awful.gcd + awful.buffer * 2 &&
    unit.castRemains > awful.buffer &&
    manaVoid.enabled()
  );
};
mechanicsHandler.add(manavoidCallback, [hunterSpells.feignDeath], 196045);
mechanicsHandler.add(manavoidCallback, [hunterSpells.feignDeath], 196798);

const arcaneMissiles = new MyCheckBox(
  'arcaneMissiles',
  dragonflightTab,
  'Arcane Missiles',
  "Use Feign Death on 'Arcane Missiles' - Spectral Invoker"
);
// TODO: channelTarget
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.channelID === 387974 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.channelRemains > 2.5 &&
      arcaneMissiles.enabled()
    );
  },
  [hunterSpells.feignDeath],
  196202
);

// Last boss 'Energy Bomb' can be Feigned if you see the boss is facing you while casting it.

dragonflightTab.Text({
  text: 'Azure Vault',
  header: true,
});

const icyDevastator = new MyCheckBox(
  'icyDevastatorMechanic',
  dragonflightTab,
  'Icy Devastator',
  'Use Feign Death on Icy Devastator'
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return icyDevastator.enabled() && unit.debuff(387151) != undefined;
  },
  [hunterSpells.feignDeath]
);

const nullmagicHornswog = new MyCheckBox(
  'nullmagicHornswogMechanic',
  dragonflightTab,
  'Nullmagic Hornswog',
  'Use Binding Shot on Nullmagic Hornswog'
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return !unit.dead && !unit.cc && nullmagicHornswog.enabled();
  },
  [hunterSpells.bindingShot],
  187246
);

const shoulderSlam = new MyCheckBox(
  'shoulderSlam',
  dragonflightTab,
  'Shoulder Slam',
  "Use Feign Death on 'Shoulder Slam' - Drakonid Breaker"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 391136 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains > awful.buffer &&
      shoulderSlam.enabled()
    );
  },
  [hunterSpells.feignDeath],
  187240
);

const erraticGrowth = new MyCheckBox(
  'erraticGrowth',
  dragonflightTab,
  'Erratic Growth',
  'Use Feign Death on Erratic Growth'
);
// TODO: channelTarget
const erraticGrowthCallback = (unit: IAwfulUnit) => {
  return (
    unit.channelID === 375596 &&
    unit.castTarget != undefined &&
    unit.castTarget.isUnit(awful.player) &&
    unit.channelRemains <= awful.gcd + awful.buffer * 2 &&
    unit.channelRemains > awful.buffer &&
    erraticGrowth.enabled()
  );
};
mechanicsHandler.add(erraticGrowthCallback, [hunterSpells.feignDeath], 191164);
mechanicsHandler.add(erraticGrowthCallback, [hunterSpells.feignDeath], 196115);

const wakingBane = new MyCheckBox(
  'wakingBane',
  dragonflightTab,
  'Waking Bane',
  "Use Feign Death on 'Waking Bane' - Arcane Elemental"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 386546 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains <= awful.gcd + awful.buffer * 2 &&
      unit.castRemains > awful.buffer &&
      wakingBane.enabled()
    );
  },
  [hunterSpells.feignDeath],
  186741
);

// Ancient Orb 2nd boss

dragonflightTab.Text({
  text: 'Brackenhide Hollow',
  header: true,
});

const rotfangHyena = new MyCheckBox(
  'rotfangHyenaMechanic',
  dragonflightTab,
  'Rotfang Hyena',
  'Use Binding Shot & Tar Trap on Rotfang Hyena'
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return !unit.dead && !unit.cc && rotfangHyena.enabled();
  },
  [hunterSpells.bindingShot, hunterSpells.tarTrap],
  194745
);

const decayingSlime = new MyCheckBox(
  'decayingSlimeMechanic',
  dragonflightTab,
  'Decaying Slime',
  'Use Binding Shot on Decaying Slime'
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return !unit.dead && !unit.cc && decayingSlime.enabled();
  },
  [hunterSpells.bindingShot],
  189299
);

dragonflightTab.Text({
  text: 'Court of Stars',
  header: true,
});

const hypnosis = new MyCheckBox(
  'hypnosis',
  dragonflightTab,
  'Hypnosis',
  "Use Feign Death on 'Hypnosis' - Hypnosis Bat"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 373618 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains <= awful.gcd + awful.buffer * 2 &&
      unit.castRemains > awful.buffer &&
      hypnosis.enabled()
    );
  },
  [hunterSpells.feignDeath],
  190174
);

const suppress = new MyCheckBox(
  'suppress',
  dragonflightTab,
  'Suppress',
  "Use Feign Death on 'Suppress' - Guardian Construct"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.channelID === 209413 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.channelRemains > awful.buffer &&
      suppress.enabled()
    );
  },
  [hunterSpells.feignDeath],
  104270
);

const nightfallOrb = new MyCheckBox(
  'nightfallOrb',
  dragonflightTab,
  'Nightfall Orb',
  "Use Feign Death on 'Nightfall Orb' - Duskwatch Arcanist"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 209410 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains > awful.buffer &&
      nightfallOrb.enabled()
    );
  },
  [hunterSpells.feignDeath],
  104247
);

const hinder = new MyCheckBox(
  'hinder',
  dragonflightTab,
  'Hinder',
  "Use Feign Death on 'Hinder' - Vigilant Duskwatch"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 215204 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains <= awful.gcd + awful.buffer * 2 &&
      unit.castRemains > awful.buffer &&
      hinder.enabled()
    );
  },
  [hunterSpells.feignDeath],
  104918
);

const bewitch = new MyCheckBox(
  'bewitch',
  dragonflightTab,
  'Bewitch',
  "Use Feign Death on 'Bewitch' - Shadow Mistress"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 211470 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains <= awful.gcd + awful.buffer * 2 &&
      unit.castRemains > awful.buffer &&
      bewitch.enabled()
    );
  },
  [hunterSpells.feignDeath],
  104300
);

const disintegrationBeam = new MyCheckBox(
  'disintegrationBeam',
  dragonflightTab,
  'Disintegration Beam',
  "Use Feign Death on 'Disintegration Beam' - Baalgar"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.channelID === 183653 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.channelRemains > 2 &&
      disintegrationBeam.enabled()
    );
  },
  [hunterSpells.feignDeath],
  104274
);

const firebolt = new MyCheckBox(
  'firebolt',
  dragonflightTab,
  'Firebolt',
  "Use Feign Death on 'Firebolt' - Blazing Imp"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 211406 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains <= awful.gcd + awful.buffer * 2 &&
      unit.castRemains > awful.buffer &&
      firebolt.enabled()
    );
  },
  [hunterSpells.feignDeath],
  104295
);

dragonflightTab.Text({
  text: 'Neltharus',
  header: true,
});

const ragingEmber = new MyCheckBox(
  'ragingEmberMechanic',
  dragonflightTab,
  'Raging Ember',
  'Use Binding Shot on Raging Ember'
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return !unit.dead && !unit.cc && ragingEmber.enabled();
  },
  [hunterSpells.bindingShot],
  192464
);

dragonflightTab.Text({
  text: 'Nokhud',
  header: true,
});

const stormBolt = new MyCheckBox(
  'stormBolt',
  dragonflightTab,
  'Storm Bolt',
  "Use Feign Death on 'Storm Bolt' - Stormspeaker / Stormcaster"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 386012 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains <= awful.gcd + awful.buffer * 2 &&
      unit.castRemains > awful.buffer &&
      stormBolt.enabled()
    );
  },
  [hunterSpells.feignDeath],
  194894
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 376725 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains <= awful.gcd + awful.buffer * 2 &&
      unit.castRemains > awful.buffer &&
      stormBolt.enabled()
    );
  },
  [hunterSpells.feignDeath],
  190294
);

const quickShot = new MyCheckBox(
  'quickShot',
  dragonflightTab,
  'Quick Shot',
  "Use Feign Death on 'Quick Shot' - Teera"
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 386411 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains <= awful.gcd + awful.buffer * 2 &&
      unit.castRemains > awful.buffer &&
      quickShot.enabled()
    );
  },
  [hunterSpells.feignDeath],
  195723
);

dragonflightTab.Text({
  text: 'Ruby Life Pools',
  header: true,
});

const inferno = new MyCheckBox(
  'inferno',
  dragonflightTab,
  'Inferno',
  'Use Feign Death on Inferno'
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      unit.castID === 373692 &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains > awful.buffer &&
      inferno.enabled()
    );
  },
  [hunterSpells.feignDeath],
  190034
);

const cinderbolt = new MyCheckBox(
  'cinderbolt',
  dragonflightTab,
  'Cinderbolt',
  'Use Feign Death on Cinderbolt'
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return (
      (unit.castID === 384194 || unit.castID === 384197) &&
      unit.castTarget != undefined &&
      unit.castTarget.isUnit(awful.player) &&
      unit.castRemains <= awful.gcd + awful.buffer * 2 &&
      unit.castRemains > awful.buffer &&
      cinderbolt.enabled()
    );
  },
  [hunterSpells.feignDeath],
  190207
);

const LegionTab = hunterGui.mechanicsGroup.Tab('Legion');

LegionTab.Text({
  text: 'Halls of Valor',
  header: true,
});

/*
const scentOfBlood = new MyCheckBox(
  'scentOfBloodMechanic',
  LegionTab,
  'Scent of Blood',
  'Use Feign Death when targeted by Scent of Blood'
);
mechanicsHandler.add(
  (unit: IAwfulUnit) => {
    return scentOfBlood.enabled() && unit.debuff(196838) != undefined;
  },
  [hunterSpells.feignDeath]
);
*/
