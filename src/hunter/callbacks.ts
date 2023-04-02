import { myCache } from '../base/cache';
import * as baseSpells from '../base/spells';
import {
  disengageTrigger,
  hunterGui,
  hunterStatusFrame,
  maxSerpentSting,
} from './gui';
import { canDispelBuff, canKickEnemy, canStunEnemy } from '../base/rotation';
import { interruptsHistory } from '../base/mechanics';
import {
  Bombs,
  eightFightable,
  eightFightableFacing,
  fourthyEngagedLos,
  fourthyEngagedLosFacing,
  HunterBuffs,
  HunterDebuffs,
  HunterTalents,
  meleeFightableLosFacing,
  modeParams,
  PetBuffs,
  tierSet,
} from './lists';
import {
  castRegen,
  executeTime,
  fullRechargeTime,
  isRefreshable,
  timeToMax,
} from '../base/simc';
import { generalGui, statusFrame } from '../base/gui';
import * as spells from './spells';
import { fourthyFightableLosFacing } from './lists';
import { timeLine } from '../base/bigWigs';
import { hunterCache } from './cache';
import { isNextBomb } from './simc';

export const enum SteadyFocusState {
  none = 0,
  first = 1,
  second = 2,
}

const svKillCommandRegen = () => {
  return castRegen(
    spells.killCommandSV,
    15 + (awful.player.hasTalent(HunterTalents.intenseFocus) ? 6 : 0)
  );
};

const canCarefulAim = (target: IAwfulUnit, extraDelay = 0): boolean => {
  return (
    awful.player.hasTalent(HunterTalents.carefulAim) != false &&
    spells.aimedShot.castTime + awful.buffer + 0.5 + extraDelay <
      target.TimeToX(70, 0)
  );
};

spells.barrage.Callback('bm.barrage.cleave.1', (spell) => {
  const pet = awful.pet;

  if (
    !pet.exists ||
    !pet.buff(PetBuffs.frenzy) ||
    pet.buffRemains(PetBuffs.frenzy) > executeTime(2.8) + awful.buffer * 2
  ) {
    spell.Cast();
  }
});

spells.barbedShot.Callback((spell) => {
  const pet = awful.pet;
  const target = awful.target;

  if (!pet.exists || pet.dead) return;

  spell.Cast(target);
});

const barbedShotLowestCallback = (spell: IAwfulSpell): boolean => {
  const target = hunterCache.lowestbarbedShot();
  return spell.Cast(target);
};

spells.barbedShot.Callback('refresh', (spell) => {
  const player = awful.player;
  const target = awful.target;
  const pet = awful.pet;

  if (!pet.exists || pet.dead) return;

  if (!target.exists || target.dead || !player.canAttack(target)) return;

  if (!player.combat && !target.combat && !generalGui.startCombat.enabled())
    return;

  const frenzyRemain = pet.buffRemains(PetBuffs.frenzy);

  if (
    pet.buff(PetBuffs.frenzy) != undefined &&
    frenzyRemain <= awful.gcd + awful.buffer * 2 &&
    frenzyRemain >= awful.buffer
  )
    if (statusFrame.rotationMode.isST()) spell.Cast(awful.target);
    else barbedShotLowestCallback(spell);
});

spells.barbedShot.Callback('bm.barbedShot.st.1', (spell) => {
  const player = awful.player;
  const pet = awful.pet;

  if (!pet.exists || pet.dead) return;

  const frenzyRemain = pet.buffRemains(PetBuffs.frenzy);

  if (
    (pet.buff(PetBuffs.frenzy) &&
      frenzyRemain <= awful.gcd + awful.buffer * 2 &&
      frenzyRemain >= awful.buffer) ||
    (player.hasTalent(HunterTalents.scentOfBlood) &&
      pet.buffStacks(PetBuffs.frenzy) < 3 &&
      hunterGui.bestialWrath.enabled() &&
      spells.bestialWrath.cd <= awful.gcd)
  )
    if (statusFrame.rotationMode.isST()) spell.Cast(awful.target);
    else barbedShotLowestCallback(spell);
});

spells.barbedShot.Callback('bm.barbedShot.st.2', (spell) => {
  const player = awful.player;
  const pet = awful.pet;

  if (!pet.exists || pet.dead) return;

  if (
    (player.hasTalent(HunterTalents.wildInstincts) &&
      player.buff(HunterTalents.callOfTheWild)) ||
    (player.hasTalent(HunterTalents.wildCall) &&
      spells.barbedShot.chargesFrac > 1.4) ||
    (fullRechargeTime(spells.barbedShot) < awful.gcd + awful.buffer * 2 &&
      (!hunterGui.bestialWrath.enabled() ||
        spells.bestialWrath.cd > awful.gcd)) ||
    (player.hasTalent(HunterTalents.scentOfBlood) &&
      ((hunterGui.bestialWrath.enabled() &&
        spells.bestialWrath.cd < 12 + awful.gcd + awful.buffer) ||
        (fullRechargeTime(spells.barbedShot) + awful.gcd + awful.buffer < 8 &&
          hunterGui.bestialWrath.enabled() &&
          spells.bestialWrath.cd <
            24 +
              (8 - awful.gcd) +
              fullRechargeTime(spells.barbedShot) +
              awful.buffer))) ||
    awful.FightRemains() < 9
  )
    if (statusFrame.rotationMode.isST()) spell.Cast(awful.target);
    else barbedShotLowestCallback(spell);
});

spells.barbedShot.Callback('bm.barbedShot.cleave.1', (spell) => {
  const player = awful.player;
  const pet = awful.pet;

  if (!pet.exists || pet.dead) return;

  if (
    (pet.buff(PetBuffs.frenzy) &&
      pet.buffRemains(PetBuffs.frenzy) <= awful.gcd + awful.buffer * 2) ||
    (player.hasTalent(HunterTalents.scentOfBlood) &&
      hunterGui.bestialWrath.enabled() &&
      spells.bestialWrath.cd < 12 + awful.gcd) ||
    (fullRechargeTime(spells.barbedShot) < awful.gcd + awful.buffer &&
      (!hunterGui.bestialWrath.enabled() || spells.bestialWrath.cd > awful.gcd))
  )
    barbedShotLowestCallback(spell);
});

spells.barbedShot.Callback('bm.barbedShot.cleave.2', (spell) => {
  const player = awful.player;
  const pet = awful.pet;

  if (!pet.exists || pet.dead) return;

  if (
    (player.hasTalent(HunterTalents.wildInstincts) &&
      player.buff(HunterTalents.callOfTheWild)) ||
    awful.FightRemains() < 9 ||
    (player.hasTalent(HunterTalents.wildCall) && spell.chargesFrac > 1.2)
  )
    barbedShotLowestCallback(spell);
});

const killCommandCallback = (spell: IAwfulSpell) => {
  const pet = awful.pet;
  const target = awful.target;

  if (!pet.exists || pet.dead) return;

  if (pet.distanceToLiteral(target) <= 50) {
    spell.Cast(target);
  }
};

spells.killCommandBM.Callback(killCommandCallback);

spells.killCommandBM.Callback('bm.killCommand.st.1', (spell) => {
  const player = awful.player;

  if (
    player.hasTalent(HunterTalents.alphaPredator) &&
    fullRechargeTime(spell) <= awful.gcd + awful.buffer * 2
  ) {
    killCommandCallback(spell);
  }
});

spells.killCommandBM.Callback('bm.killCommand.cleave.1', (spell) => {
  const player = awful.player;

  if (
    fullRechargeTime(spell) < awful.gcd + awful.buffer &&
    player.hasTalent(HunterTalents.alphaPredator) &&
    player.hasTalent(HunterTalents.killCleave)
  ) {
    killCommandCallback(spell);
  }
});

spells.cobraShot.Callback((spell) => {
  const target = awful.target;

  spell.Cast(target);
});

spells.cobraShot.Callback('bm.cobraShot.cleave.1', (spell) => {
  const player = awful.player;
  const target = awful.target;

  const ttm = timeToMax();

  if (
    ttm < awful.gcd * 2 ||
    (player.buff(HunterBuffs.aspectOfTheWild) && ttm < awful.gcd * 4)
  ) {
    spell.Cast(target);
  }
});

spells.cobraShot.Callback('mechanic', (spell, unit) => {
  const target = unit as IAwfulUnit;

  if (target.los && target.playerFacing && target.distance < 40) {
    spell.Cast(target);
  }
});

export const fixKillShotCallback = () => {
  const player = awful.player;
  const spell = spells.killShot;

  if (!spell.known && spell.cd > awful.gcd && spell.cost.focus > player.focus)
    return;

  const enemies = myCache.get(fourthyFightableLosFacing);
  const ignoreHp =
    player.buff(HunterBuffs.deathblow) != undefined ||
    (player.buff(HunterBuffs.coordinatedAssault) != undefined &&
      player.hasTalent(HunterTalents.coordinatedKill));

  if (ignoreHp) spell.Cast(awful.target);

  for (const enemy of enemies) {
    if (enemy.hp <= 20) {
      if (spell.Cast(enemy)) return;
    }
  }
};

const aoeCallbackKillShot = (spell: IAwfulSpell) => {
  const player = awful.player;
  const enemies = myCache.get(fourthyFightableLosFacing);
  const ignoreHp =
    player.buff(HunterBuffs.deathblow) != undefined ||
    (player.buff(HunterBuffs.coordinatedAssault) != undefined &&
      player.hasTalent(HunterTalents.coordinatedKill));

  if (ignoreHp) spell.Cast(awful.target);

  for (const enemy of enemies) {
    if (enemy.hp <= 20) {
      if (spell.Cast(enemy)) return;
    }
  }
};

spells.killShot.Callback(aoeCallbackKillShot);

spells.killShot.Callback('mm.killShot.trickshots.1', (spell) => {
  const player = awful.player;

  if (player.buff(HunterBuffs.razorFragments)) {
    aoeCallbackKillShot(spell);
  }
});

spells.killShot.Callback('mm.killShot.trickshots.2', (spell) => {
  const player = awful.player;

  if (player.focus > spell.cost.focus + spells.aimedShot.cost.focus) {
    aoeCallbackKillShot(spell);
  }
});

spells.killShotSV.Callback('sv.killShot.cleave.1', (spell) => {
  const player = awful.player;

  if (player.buff(HunterBuffs.coordinatedAssaultEmpower)) {
    aoeCallbackKillShot(spell);
  }
});

spells.killShotSV.Callback('sv.killShot.cleave.2', (spell) => {
  const player = awful.player;

  if (!player.buff(HunterBuffs.coordinatedAssault)) {
    aoeCallbackKillShot(spell);
  }
});

spells.killShotSV.Callback('sv.killShot.st.1', (spell) => {
  const player = awful.player;

  if (player.buff(HunterBuffs.coordinatedAssaultEmpower)) {
    aoeCallbackKillShot(spell);
  }
});

spells.killShotSV.Callback('sv.killShot.st.2', (spell) => {
  const player = awful.player;

  if (!player.buff(HunterBuffs.coordinatedAssault)) {
    aoeCallbackKillShot(spell);
  }
});

const multiShotCallback = (spell: IAwfulSpell) => {
  const target = awful.target;

  spell.Cast(target);
};

spells.multiShotBM.Callback(multiShotCallback);

spells.multiShotBM.Callback('bm.multishot.cleave.1', (spell) => {
  const player = awful.player;
  const pet = awful.pet;

  if (!pet.exists || pet.dead || !player.hasTalent(HunterTalents.beastCleave))
    return;

  if (pet.buffRemains(PetBuffs.beastCleave) < awful.gcd + awful.buffer * 2) {
    multiShotCallback(spell);
  }
});

const steadyShotCallback = (spell: IAwfulSpell) => {
  const target = awful.target;

  spell.Cast(target);
};

spells.steadyShot.Callback(steadyShotCallback);

spells.steadyShot.Callback('mm.steadyShot.st.1', (spell) => {
  const player = awful.player;

  if (
    player.hasTalent(HunterTalents.steadyFocus) &&
    ((player.lastCast === spell.id &&
      player.buffRemains(HunterBuffs.steadyFocus) < 5) ||
      (!player.buff(HunterBuffs.steadyFocus) &&
        !player.buff(HunterBuffs.trueShot)))
  ) {
    steadyShotCallback(spell);
  }
});

spells.steadyShot.Callback('mm.steadyShot.st.2', (spell) => {
  const player = awful.player;

  if (
    player.hasTalent(HunterTalents.steadyFocus) &&
    player.buffRemains(HunterBuffs.steadyFocus) <
      (spell.castTime + awful.buffer) * 2
  ) {
    steadyShotCallback(spell);
  }
});

spells.steadyShot.Callback('mm.steadyShot.trickshots.1', (spell) => {
  const player = awful.player;

  if (
    player.hasTalent(HunterTalents.steadyFocus) &&
    player.buffRemains(HunterBuffs.steadyFocus) < 8 &&
    player.lastCast === spell.id
  ) {
    steadyShotCallback(spell);
  }
});

spells.rapidFire.Callback((spell) => {
  const target = awful.target;

  if (!hunterGui.rapidFire.enabled(true)) return;

  spell.Cast(target);
});

spells.rapidFire.Callback('mm.rapidFire.st.1', (spell) => {
  const target = awful.target;
  const player = awful.player;

  if (!hunterGui.rapidFire.enabled(true)) return;

  if (player.hasTalent(HunterTalents.surgingShot)) {
    spell.Cast(target);
  }
});

spells.rapidFire.Callback('mm.rapidFire.trickshots.1', (spell) => {
  const player = awful.player;
  const target = awful.target;

  if (!hunterGui.rapidFire.enabled(true)) return;

  if (
    player.buffRemains(HunterBuffs.trickShots) >=
      executeTime(2) + awful.buffer &&
    player.hasTalent(HunterTalents.surgingShot)
  ) {
    spell.Cast(target);
  }
});

spells.rapidFire.Callback('mm.rapidFire.trickshots.2', (spell) => {
  const player = awful.player;

  if (!hunterGui.rapidFire.enabled(true)) return;

  if (
    player.buffRemains(HunterBuffs.trickShots) >=
    executeTime(2) + awful.buffer
  ) {
    spell.Cast(awful.target);
  }
});

spells.chimaeraShot.Callback('mm.chimaeraShot.st.1', (spell) => {
  const target = awful.target;
  const player = awful.player;

  if (
    player.buff(HunterBuffs.preciseShot) ||
    player.focus > spell.cost.focus + spells.aimedShot.cost.focus
  ) {
    spell.Cast(target);
  }
});

spells.chimaeraShot.Callback('mm.chimaeraShot.trickshots.1', (spell) => {
  const target = awful.target;
  const player = awful.player;
  const enemiesAround = myCache.get(modeParams).length;

  if (
    player.buff(HunterBuffs.trickShots) &&
    player.buff(HunterBuffs.preciseShot) &&
    player.focus > spell.cost.focus + spells.aimedShot.cost.focus &&
    enemiesAround < 4
  ) {
    spell.Cast(target);
  }
});

spells.arcaneShot.Callback('mm.arcaneShot.st.1', (spell) => {
  const target = awful.target;
  const player = awful.player;

  if (
    player.buff(HunterBuffs.preciseShot) ||
    player.focus > spell.cost.focus + spells.aimedShot.cost.focus
  ) {
    spell.Cast(target);
  }
});

spells.arcaneShot.Callback('mechanic', (spell, unit) => {
  const target = unit as IAwfulUnit;

  if (target.los && target.playerFacing && target.distance < 40) {
    spell.Cast(target);
  }
});

let lastStingTarget: IAwfulUnit | undefined = undefined;

const getAimedShotOptions = (): IAwfulSpellOptions => {
  return {
    ignoreMoving: awful.player.buff(HunterBuffs.lockAndLoad) != undefined,
  };
};

spells.aimedShot.Callback((spell) => {
  const target = awful.target;

  if (!hunterGui.aimedShot.enabled(true)) return;

  spell.Cast(target, getAimedShotOptions());
});

spells.aimedShot.Callback('mm.aimedShot.st.1', (spell) => {
  const player = awful.player;

  if (!hunterGui.aimedShot.enabled(true)) return;

  const enemiesAround = statusFrame.rotationMode.isST()
    ? 1
    : myCache.get(modeParams).length;

  const target = statusFrame.rotationMode.isST()
    ? awful.target
    : lowestSerpentSting(
        myCache.get(fourthyFightableLosFacing) as unknown as IAwfulUnit[]
      ) || awful.target;

  if (
    player.hasTalent(HunterTalents.serpentstalkersTrickery) &&
    (!player.buff(HunterBuffs.preciseShot) ||
      ((player.buff(HunterBuffs.trueShot) ||
        fullRechargeTime(spell) < awful.gcd + spell.castTime + awful.buffer) &&
        (!player.hasTalent(HunterTalents.chimaeraShot) ||
          enemiesAround < 2 ||
          canCarefulAim(target))) ||
      (player.buffRemains(HunterBuffs.trickShots) >
        spell.castTime + awful.buffer * 2 &&
        enemiesAround > 1))
  ) {
    if (spell.Cast(target, getAimedShotOptions())) lastStingTarget = target;
  }
});

const maxLatentPoisonStack = (units: IAwfulUnit[]) => {
  let maxStack = 0;
  let maxStackUnit: IAwfulUnit | undefined;
  let maxHealth = 0;

  for (const unit of units) {
    const stack = unit.debuffStacks(HunterDebuffs.latentPoison, awful.player);

    if (
      unit.ttd > spells.aimedShot.castTime + awful.buffer &&
      (stack > maxStack || (stack === maxStack && unit.health > maxHealth))
    ) {
      maxStack = stack;
      maxStackUnit = unit;
      maxHealth = unit.health;
    }
  }

  return maxStackUnit;
};

spells.aimedShot.Callback('mm.aimedShot.st.2', (spell) => {
  const player = awful.player;

  if (!hunterGui.aimedShot.enabled(true)) return;

  const enemiesAround = statusFrame.rotationMode.isST()
    ? 1
    : myCache.get(modeParams).length;

  const target = statusFrame.rotationMode.isST()
    ? awful.target
    : maxLatentPoisonStack(
        myCache.get(fourthyFightableLosFacing) as unknown as IAwfulUnit[]
      ) || awful.target;

  if (
    !player.buff(HunterBuffs.preciseShot) ||
    ((player.buff(HunterBuffs.trueShot) ||
      fullRechargeTime(spell) < awful.buffer + awful.gcd + spell.castTime) &&
      (!player.hasTalent(HunterTalents.chimaeraShot) ||
        enemiesAround < 2 ||
        canCarefulAim(target))) ||
    (player.buffRemains(HunterBuffs.trickShots) >
      spell.castTime + awful.buffer * 2 &&
      enemiesAround > 1)
  ) {
    spell.Cast(target, getAimedShotOptions());
  }
});

spells.aimedShot.Callback('mm.aimedShot.trickshots.1', (spell) => {
  const player = awful.player;

  if (!hunterGui.aimedShot.enabled(true)) return;

  if (
    player.hasTalent(HunterTalents.serpentstalkersTrickery) &&
    player.buffRemains(HunterBuffs.trickShots) >
      spell.castTime + awful.buffer &&
    (!player.buff(HunterBuffs.preciseShot) ||
      player.buff(HunterBuffs.trueShot) ||
      fullRechargeTime(spell) < awful.gcd + spell.castTime + awful.buffer)
  ) {
    const target =
      lowestSerpentSting(
        myCache.get(fourthyFightableLosFacing) as unknown as IAwfulUnit[]
      ) || awful.target;

    if (spell.Cast(target, getAimedShotOptions())) lastStingTarget = target;
  }
});

spells.aimedShot.Callback('mm.aimedShot.trickshots.2', (spell) => {
  const player = awful.player;

  if (!hunterGui.aimedShot.enabled(true)) return;

  if (
    player.buffRemains(HunterBuffs.trickShots) >
      spell.castTime + awful.buffer + 0.5 &&
    (!player.buff(HunterBuffs.preciseShot) ||
      player.buff(HunterBuffs.trueShot) ||
      fullRechargeTime(spell) < awful.gcd + spell.castTime + awful.buffer)
  ) {
    const target =
      maxLatentPoisonStack(
        myCache.get(fourthyFightableLosFacing) as unknown as IAwfulUnit[]
      ) || awful.target;

    spell.Cast(target, getAimedShotOptions());
  }
});

spells.multiShotMM.Callback('mm.multiShot.st.1', (spell) => {
  const target = awful.target;
  const player = awful.player;
  const enemiesAround = myCache.get(modeParams).length;

  if (
    (player.buff(HunterBuffs.bombardment) &&
      !player.buff(HunterBuffs.trickShots) &&
      enemiesAround > 1) ||
    //TODO: CUSTOM MADE
    (player.buff(HunterBuffs.salvo) &&
      (!hunterGui.volley.enabled() ||
        spells.volley.cd > awful.gcd ||
        !spells.volley.known))
  ) {
    spell.Cast(target);
  }
});

spells.multiShotMM.Callback('mm.multiShot.trickshots.1', (spell) => {
  const target = awful.target;
  const player = awful.player;

  if (
    !player.buff(HunterBuffs.trickShots) ||
    (player.buff(HunterBuffs.preciseShot) &&
      player.buffStacks(HunterBuffs.bulletstorm) === 10 &&
      player.focus > spell.cost.focus + spells.aimedShot.cost.focus) ||
    //TODO: CUSTOM MADE
    player.buff(HunterBuffs.salvo)
  ) {
    spell.Cast(target);
  }
});

spells.multiShotMM.Callback('mm.multiShot.trickshots.2', (spell) => {
  const target = awful.target;
  const player = awful.player;

  if (player.focus > spell.cost.focus + spells.aimedShot.cost.focus) {
    spell.Cast(target);
  }
});

const wasLastCastSting = () => {
  return (
    awful.player.lastCast === spells.serpentSting.id ||
    (awful.player.hasTalent(HunterTalents.serpentstalkersTrickery) &&
      awful.player.lastCast === spells.aimedShot.id)
  );
};

export const isLastStingTarget = (unit: IAwfulUnit) => {
  return lastStingTarget != undefined && lastStingTarget.isUnit(unit);
};

const lowestSerpentSting = (units: IAwfulUnit[]): IAwfulUnit | undefined => {
  const player = awful.player;
  let lowestSerpentStingTarget: IAwfulUnit | undefined;
  const lasCastSting = wasLastCastSting();

  for (const unit of units) {
    if (unit.ttd > 8) {
      if (
        (!lasCastSting || !isLastStingTarget(unit)) &&
        (!lowestSerpentStingTarget ||
          unit.debuffRemains(HunterDebuffs.serpentSting, player) <
            lowestSerpentStingTarget.debuffRemains(
              HunterDebuffs.serpentSting,
              player
            ) ||
          (unit.debuffRemains(HunterDebuffs.serpentSting, player) ===
            lowestSerpentStingTarget.debuffRemains(
              HunterDebuffs.serpentSting,
              player
            ) &&
            unit.health > lowestSerpentStingTarget.health))
      ) {
        lowestSerpentStingTarget = unit;
      }
    }
  }

  if (lowestSerpentStingTarget) return lowestSerpentStingTarget;

  // Get unit with the most .health
  let highestHealthTarget: IAwfulUnit | undefined;

  for (const unit of units) {
    if (!highestHealthTarget || unit.health > highestHealthTarget.health) {
      highestHealthTarget = unit;
    }
  }

  return highestHealthTarget;
};

spells.serpentSting.Callback('mm.serpentSting.st.1', (spell) => {
  const player = awful.player;

  const enemies = myCache.get(fourthyFightableLosFacing);

  const serpentStingCount = enemies.filter(
    (unit) => unit.debuff(HunterDebuffs.serpentSting, player) != undefined
  ).length;

  if (serpentStingCount > maxSerpentSting.value()) return;

  const target = statusFrame.rotationMode.isST()
    ? awful.target
    : lowestSerpentSting(
        myCache.get(fourthyFightableLosFacing) as unknown as IAwfulUnit[]
      );

  if (
    !target ||
    target.ttd < 8 ||
    (wasLastCastSting() && isLastStingTarget(target))
  )
    return;

  if (
    isRefreshable(target, HunterDebuffs.serpentSting, 12) &&
    !player.hasTalent(HunterTalents.serpentstalkersTrickery) &&
    !player.buff(HunterBuffs.trueShot)
  ) {
    if (spell.Cast(target)) lastStingTarget = target;
  }
});

spells.serpentSting.Callback('mm.serpentSting.trickshots.1', (spell) => {
  const player = awful.player;

  const enemies = myCache.get(fourthyFightableLosFacing);

  const serpentStingCount = enemies.filter(
    (unit) => unit.debuff(HunterDebuffs.serpentSting, player) != undefined
  ).length;

  if (serpentStingCount > maxSerpentSting.value()) return;

  const target = lowestSerpentSting(
    myCache.get(fourthyFightableLosFacing) as unknown as IAwfulUnit[]
  );

  if (
    !target ||
    target.ttd < 8 ||
    (wasLastCastSting() && isLastStingTarget(target))
  )
    return;

  if (
    isRefreshable(target, HunterDebuffs.serpentSting, 12) &&
    player.hasTalent(HunterTalents.hydrasBite) &&
    !player.hasTalent(HunterTalents.serpentstalkersTrickery)
  ) {
    if (spell.Cast(target)) lastStingTarget = target;
  }
});

spells.serpentSting.Callback('mm.serpentSting.trickshots.2', (spell) => {
  const player = awful.player;

  const enemies = myCache.get(fourthyFightableLosFacing);

  const serpentStingCount = enemies.filter(
    (unit) => unit.debuff(HunterDebuffs.serpentSting, player) != undefined
  ).length;

  if (serpentStingCount > maxSerpentSting.value()) return;

  const target = lowestSerpentSting(
    myCache.get(fourthyFightableLosFacing) as unknown as IAwfulUnit[]
  );

  if (
    !target ||
    target.ttd < 8 ||
    (wasLastCastSting() && isLastStingTarget(target))
  )
    return;

  if (
    isRefreshable(target, HunterDebuffs.serpentSting, 12) &&
    player.hasTalent(HunterTalents.poisonInjection) &&
    !player.hasTalent(HunterTalents.serpentstalkersTrickery)
  ) {
    if (spell.Cast(target)) lastStingTarget = target;
  }
});

spells.serpentSting.Callback('sv.serpentSting.cleave.1', (spell) => {
  const player = awful.player;
  const target = hunterCache.minSerpentStingRemains(12);

  if (
    isRefreshable(target, HunterDebuffs.serpentSting, 12) &&
    target.ttd > 12 &&
    (!player.hasTalent(HunterTalents.vipersVenom) ||
      player.hasTalent(HunterTalents.hydrasBite))
  ) {
    spell.Cast(target);
  }
});

spells.serpentSting.Callback('sv.serpentSting.st.1', (spell) => {
  const player = awful.player;

  if (player.hasTalent(HunterTalents.vipersVenom)) return;

  const target = hunterCache.minSerpentStingRemains();

  if (
    target.ttd > 7 &&
    !target.debuff(HunterDebuffs.serpentSting, player) &&
    !player.hasTalent(HunterTalents.vipersVenom)
  ) {
    spell.Cast(target);
  }
});

spells.serpentSting.Callback('sv.serpentSting.st.2', (spell) => {
  const player = awful.player;

  if (player.hasTalent(HunterTalents.vipersVenom)) return;

  const target = hunterCache.minSerpentStingRemains();

  if (target.ttd > 7 && isRefreshable(target, HunterDebuffs.serpentSting, 12)) {
    spell.Cast(target);
  }
});

spells.wildfireBomb.Callback('sv.wildfireBomb.cleave.1', (spell) => {
  const target = awful.target;

  if (fullRechargeTime(spell) < awful.gcd + awful.buffer) {
    //TODO: best target
    spell.Cast(target);
  }
});

spells.wildfireBomb.Callback('sv.wildfireBomb.cleave.2', (spell) => {
  const target = awful.target;

  if (!hunterCache.wildfireBombTicking()) {
    //TODO: best target
    spell.Cast(target);
  }
});

spells.wildfireBomb.Callback('sv.wildfireBomb.st.1', (spell) => {
  const player = awful.player;
  const target = awful.target;

  if (
    (isNextBomb(Bombs.pheromoneBomb) &&
      !player.buff(HunterBuffs.mongooseFury) &&
      player.focus + castRegen(spell) <
        player.focusMax - svKillCommandRegen() * 2) ||
    (player.buff(HunterBuffs.coordinatedAssault) &&
      player.focus + castRegen(spell) < player.focusMax &&
      (player.hasTalent(HunterTalents.coordinatedKill) as number) > 1)
  ) {
    spell.Cast(target);
  }
});

spells.wildfireBomb.Callback('sv.wildfireBomb.st.2', (spell) => {
  const target = awful.target;

  if (fullRechargeTime(spell) < awful.gcd + awful.buffer && tierSet.count < 2) {
    spell.Cast(target);
  }
});

spells.wildfireBomb.Callback('sv.wildfireBomb.st.3', (spell) => {
  const target = awful.target;

  if (fullRechargeTime(spell) < awful.gcd + awful.buffer) {
    spell.Cast(target);
  }
});

spells.wildfireBomb.Callback('sv.wildfireBomb.st.4', (spell) => {
  const target = awful.target;

  if (!hunterCache.wildfireBombTicking()) {
    spell.Cast(target);
  }
});

const carveCallback = (spell: IAwfulSpell) => {
  const enemiesCount = myCache.get(eightFightableFacing).length;

  if (enemiesCount > 0) {
    spell.Cast();
  }
};

spells.carve.Callback(carveCallback);

spells.carve.Callback('sv.carve.cleave.1', (spell) => {
  const enemiesCount = myCache.get(eightFightableFacing).length;

  if (fullRechargeTime(spells.wildfireBomb) > enemiesCount / 2) {
    carveCallback(spell);
  }
});

spells.carve.Callback('sv.carve.cleave.2', (spell) => {
  if (hunterCache.carveShrapnelTicking()) {
    carveCallback(spell);
  }
});

spells.butchery.Callback('sv.butchery.cleave.1', (spell) => {
  if (fullRechargeTime(spell) < awful.gcd + awful.buffer) {
    spell.Cast();
  }
});

spells.butchery.Callback('sv.butchery.cleave.2', (spell) => {
  if (hunterCache.butcheryInternalBleedingStacks()) {
    spell.Cast();
  }
});

spells.butchery.Callback('sv.butchery.cleave.3', (spell) => {
  const player = awful.player;
  const enemiesCount = myCache.get(eightFightable).length;

  if (
    (!isNextBomb(Bombs.shrapnelBomb) ||
      !player.hasTalent(HunterTalents.wildfireInfusion)) &&
    fullRechargeTime(spell) > enemiesCount / 2
  ) {
    spell.Cast();
  }
});

const flakingStrikeRegenCallback = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = awful.target;

  if (player.focus + castRegen(spell, 30) < player.focusMax) {
    spell.Cast(target);
  }
};

spells.flankingStrike.Callback(
  'sv.flankingStrike.st.1',
  flakingStrikeRegenCallback
);

spells.flankingStrike.Callback(
  'sv.flankingStrike.cleave.1',
  flakingStrikeRegenCallback
);

const mongooseBiteCallbackCleave1 = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = hunterCache.maxLatentPoisonStacksMelee();

  if (target.debuffStacks(HunterDebuffs.latentPoison, player) > 8) {
    spell.Cast(target);
  }
};

spells.mongooseBite.Callback(
  'sv.mongooseBite.cleave.1',
  mongooseBiteCallbackCleave1
);

spells.mongooseBiteRanged.Callback(
  'sv.mongooseBite.cleave.1',
  mongooseBiteCallbackCleave1
);

const mongooseBiteCallbackCleave2 = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = player.hasTalent(HunterTalents.vipersVenom)
    ? hunterCache.minSerpentStingRemainsMelee()
    : awful.target;

  spell.Cast(target);
};

spells.mongooseBite.Callback(
  'sv.mongooseBite.cleave.2',
  mongooseBiteCallbackCleave2
);

spells.mongooseBiteRanged.Callback(
  'sv.mongooseBite.cleave.2',
  mongooseBiteCallbackCleave2
);

const mongooseBiteCallbackSt1 = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = awful.target;

  if (player.buff(HunterBuffs.spearhead)) {
    spell.Cast(target);
  }
};

spells.mongooseBite.Callback('sv.mongooseBite.st.1', mongooseBiteCallbackSt1);

spells.mongooseBiteRanged.Callback(
  'sv.mongooseBite.st.1',
  mongooseBiteCallbackSt1
);

const mongooseBiteCallbackSt2 = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = awful.target;
  const enemiesCount = myCache.get(eightFightable).length;

  if (
    (enemiesCount === 1 &&
      target.ttd <
        player.focus / (spell.cost.focus - castRegen(spell) * awful.gcd)) ||
    (player.buff(HunterBuffs.mongooseFury) &&
      player.buffRemains(HunterBuffs.mongooseFury) <
        awful.gcd + awful.buffer * 2)
  ) {
    spell.Cast(target);
  }
};

spells.mongooseBite.Callback('sv.mongooseBite.st.2', mongooseBiteCallbackSt2);

spells.mongooseBiteRanged.Callback(
  'sv.mongooseBite.st.2',
  mongooseBiteCallbackSt2
);

const mongooseBiteCallbackSt3 = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = awful.target;

  if (
    player.hasTalent(HunterTalents.alphaPredator) &&
    player.buff(HunterBuffs.mongooseFury) &&
    player.buffRemains(HunterBuffs.mongooseFury) <
      (player.focus / (spell.cost.focus - castRegen(spell))) * awful.gcd
  ) {
    spell.Cast(target);
  }
};

spells.mongooseBite.Callback('sv.mongooseBite.st.3', mongooseBiteCallbackSt3);

spells.mongooseBiteRanged.Callback(
  'sv.mongooseBite.st.3',
  mongooseBiteCallbackSt3
);

const mongooseBiteCallbackSt4 = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = awful.target;

  if (target.debuff(HunterDebuffs.shrapnelBomb, player)) {
    spell.Cast(target);
  }
};

spells.mongooseBite.Callback('sv.mongooseBite.st.4', mongooseBiteCallbackSt4);

spells.mongooseBiteRanged.Callback(
  'sv.mongooseBite.st.4',
  mongooseBiteCallbackSt4
);

const mongooseBiteCallbackSt5 = (spell: IAwfulSpell) => {
  const player = awful.player;

  if (player.buff(HunterBuffs.mongooseFury)) {
    const target = statusFrame.rotationMode.isST()
      ? awful.target
      : hunterCache.maxLatentPoisonStacksMelee();
    spell.Cast(target);
  }
};

spells.mongooseBite.Callback('sv.mongooseBite.st.5', mongooseBiteCallbackSt5);

spells.mongooseBiteRanged.Callback(
  'sv.mongooseBite.st.5',
  mongooseBiteCallbackSt5
);

const mongooseBiteCallbackSt6 = (spell: IAwfulSpell) => {
  const player = awful.player;

  if (player.focus + svKillCommandRegen() > player.focusMax - 10) {
    const target = statusFrame.rotationMode.isST()
      ? awful.target
      : hunterCache.maxLatentPoisonStacksMelee();
    spell.Cast(target);
  }
};

spells.mongooseBite.Callback('sv.mongooseBite.st.6', mongooseBiteCallbackSt6);

spells.mongooseBiteRanged.Callback(
  'sv.mongooseBite.st.6',
  mongooseBiteCallbackSt6
);

const raptorStrikeCallbackCleave1 = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = hunterCache.maxLatentPoisonStacksMelee();

  if (target.debuffStacks(HunterDebuffs.latentPoison, player) > 8) {
    spell.Cast(target);
  }
};

spells.raptorStrike.Callback(
  'sv.raptorStrike.cleave.1',
  raptorStrikeCallbackCleave1
);

spells.raptorStrikeRanged.Callback(
  'sv.raptorStrike.cleave.1',
  raptorStrikeCallbackCleave1
);

const raptorStrikeCallbackCleave2 = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = player.hasTalent(HunterTalents.vipersVenom)
    ? hunterCache.minSerpentStingRemainsMelee()
    : awful.target;

  spell.Cast(target);
};

spells.raptorStrike.Callback(
  'sv.raptorStrike.cleave.2',
  raptorStrikeCallbackCleave2
);

spells.raptorStrikeRanged.Callback(
  'sv.raptorStrike.cleave.2',
  raptorStrikeCallbackCleave2
);

const raptorStrikeCallbackSt1 = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = awful.target;
  const enemiesCount = myCache.get(eightFightable).length;

  if (
    enemiesCount === 1 &&
    target.ttd <
      player.focus / (spell.cost.focus - castRegen(spell) * awful.gcd)
  ) {
    spell.Cast(target);
  }
};

spells.raptorStrike.Callback('sv.raptorStrike.st.1', raptorStrikeCallbackSt1);

spells.raptorStrikeRanged.Callback(
  'sv.raptorStrike.st.1',
  raptorStrikeCallbackSt1
);

const raptorStrikeCallbackSt2 = (spell: IAwfulSpell) => {
  const target = statusFrame.rotationMode.isST()
    ? awful.target
    : hunterCache.maxLatentPoisonStacksMelee();

  spell.Cast(target);
};

spells.raptorStrike.Callback('sv.raptorStrike.st.2', raptorStrikeCallbackSt2);

spells.raptorStrikeRanged.Callback(
  'sv.raptorStrike.st.2',
  raptorStrikeCallbackSt2
);

spells.killCommandSV.Callback('sv.killCommand.cleave.1', (spell) => {
  const player = awful.player;

  if (
    player.focus + svKillCommandRegen() < player.focusMax &&
    fullRechargeTime(spell) < awful.gcd + awful.buffer
  ) {
    const target = hunterCache.minBloodseekerRemains();
    spell.Cast(target);
  }
});

spells.killCommandSV.Callback('sv.killCommand.st.1', (spell) => {
  const player = awful.player;

  if (
    fullRechargeTime(spell) < awful.gcd + awful.buffer &&
    player.focus + svKillCommandRegen() < player.focusMax &&
    player.buffStacks(HunterBuffs.deadlyDuo) > 1
  ) {
    const target = statusFrame.rotationMode.isST()
      ? awful.target
      : hunterCache.minBloodseekerRemains();
    spell.Cast(target);
  }
});

spells.killCommandSV.Callback('sv.killCommand.st.2', (spell) => {
  const player = awful.player;

  if (
    fullRechargeTime(spell) < awful.gcd + awful.buffer &&
    player.focus + svKillCommandRegen() < player.focusMax
  ) {
    const target = statusFrame.rotationMode.isST()
      ? awful.target
      : hunterCache.minBloodseekerRemains();
    spell.Cast(target);
  }
});

spells.killCommandSV.Callback('sv.killCommand.st.3', (spell) => {
  const player = awful.player;

  if (player.focus + svKillCommandRegen() < player.focusMax) {
    const target = statusFrame.rotationMode.isST()
      ? awful.target
      : hunterCache.minBloodseekerRemains();
    spell.Cast(target);
  }
});

spells.bestialWrath.Callback((spell) => {
  const player = awful.player;
  const pet = awful.pet;
  const target = awful.target;

  if (
    hunterGui.bestialWrath.enabled() &&
    pet.exists &&
    !pet.dead &&
    player.distanceTo(target) <= 50
  ) {
    spell.Cast();
  }
});

spells.salvo.Callback((spell) => {
  if (!hunterGui.salvo.enabled()) return;

  spell.Cast();
});

const salvoPreVolleyCallback = (spell: IAwfulSpell) => {
  if (
    !hunterGui.salvo.enabled() ||
    !hunterGui.volley.enabled() ||
    spells.volley.cd > awful.gcd ||
    !spells.volley.known
  )
    return;

  spell.Cast();
};

spells.salvo.Callback('mm.salvo.st.1', salvoPreVolleyCallback);

spells.salvo.Callback('mm.salvo.trickshots.1', salvoPreVolleyCallback);

spells.bloodshed.Callback((spell) => {
  const pet = awful.pet;
  const target = awful.target;

  if (
    hunterGui.bloodshed.enabled() &&
    pet.exists &&
    !pet.dead &&
    pet.distanceTo(target) < 50
  ) {
    spell.Cast(target);
  }
});

spells.aspectOfTheWild.Callback((spell) => {
  const target = awful.target;

  if (hunterGui.aspectOfTheWild.enabled()) {
    spell.Cast(target);
  }
});

spells.callOfTheWild.Callback((spell) => {
  if (hunterGui.callOfTheWild.enabled()) {
    spell.Cast();
  }
});

const explosiveShotCallback = (spell: IAwfulSpell) => {
  const target = awful.target;

  if (hunterGui.explosiveShot.enabled()) {
    spell.Cast(target);
  }
};

spells.explosiveShot.Callback(explosiveShotCallback);

spells.explosiveShot.Callback('sv.explosiveShot.st.1', (spell) => {
  const player = awful.player;

  if (player.hasTalent(HunterTalents.ranger)) {
    explosiveShotCallback(spell);
  }
});

spells.steelTrap.Callback((spell) => {
  const target = awful.target;

  if (hunterGui.steelTrap.enabled()) {
    spell.AoECast(target);
  }
});

const steelTrapNoTrueshot = (spell: IAwfulSpell) => {
  const player = awful.player;
  const target = awful.target;

  if (!player.buff(HunterBuffs.trueShot) && hunterGui.steelTrap.enabled()) {
    spell.AoECast(target);
  }
};

spells.steelTrap.Callback('mm.steelTrap.st.1', steelTrapNoTrueshot);

spells.steelTrap.Callback('mm.steelTrap.trickshots.1', steelTrapNoTrueshot);

spells.steelTrap.Callback('sv.steelTrap.cleave.1', (spell) => {
  const player = awful.player;
  const target = awful.target;

  if (
    hunterGui.steelTrap.enabled() &&
    player.focus + castRegen(spell) < player.focusMax
  ) {
    spell.AoECast(target);
  }
});

spells.deathChakram.Callback((spell) => {
  const target = awful.target;

  if (hunterGui.deathChakram.enabled()) {
    spell.Cast(target);
  }
});

spells.direBeast.Callback((spell) => {
  const target = awful.target;

  if (hunterGui.direBeast.enabled()) {
    spell.Cast(target);
  }
});

spells.stampede.Callback((spell) => {
  if (hunterGui.stampede.enabled()) {
    spell.Cast();
  }
});

spells.aMurderofCrows.Callback((spell) => {
  const target = awful.target;

  if (hunterGui.aMurderofCrows.enabled()) {
    spell.Cast(target);
  }
});

const wailingArrowCallback = (spell: IAwfulSpell): void => {
  const target = awful.target;

  if (hunterGui.wailingArrow.enabled()) {
    spell.Cast(target);
  }
};

spells.wailingArrow.Callback(wailingArrowCallback);

const canWailingArrowCallback = (): boolean => {
  const pet = awful.pet;

  return (
    !pet.buff(PetBuffs.frenzy) ||
    pet.buffRemains(PetBuffs.frenzy) >
      spells.wailingArrow.castTime + awful.buffer * 2 ||
    awful.FightRemains() < 5
  );
};

spells.wailingArrow.Callback('bm.wailingArrow.st.1', (spell) => {
  if (canWailingArrowCallback()) wailingArrowCallback(spell);
});

spells.wailingArrow.Callback('bm.wailingArrow.cleave.1', (spell) => {
  if (canWailingArrowCallback()) wailingArrowCallback(spell);
});

spells.wailingArrow.Callback('mm.wailingArrow.st.1', (spell) => {
  //const enemiesAround = myCache.get(modeParams).length;

  //if (enemiesAround > 1) {
  wailingArrowCallback(spell);
  //}
});

spells.wailingArrow.Callback('mm.wailingArrow.st.2', (spell) => {
  const player = awful.player;

  if (!player.buff(HunterBuffs.trueShot)) {
    wailingArrowCallback(spell);
  }
});

const isTrueShotReady = (): boolean => {
  return (
    (spells.steelTrap.cd > awful.gcd ||
      !spells.steelTrap.known ||
      !hunterGui.steelTrap.enabled()) &&
    (spells.explosiveShot.cd > awful.gcd ||
      !spells.explosiveShot.known ||
      !hunterGui.explosiveShot.enabled()) &&
    (spells.deathChakram.cd > awful.gcd ||
      !spells.deathChakram.known ||
      !hunterGui.deathChakram.enabled()) &&
    (spells.stampede.cd > awful.gcd ||
      !spells.stampede.known ||
      !hunterGui.stampede.enabled()) &&
    (spells.wailingArrow.cd > awful.gcd ||
      !spells.wailingArrow.known ||
      !hunterGui.wailingArrow.enabled()) &&
    (spells.volley.cd > awful.gcd ||
      !spells.volley.known ||
      !hunterGui.volley.enabled()) &&
    (spells.rapidFire.cd > awful.gcd ||
      !spells.rapidFire.known ||
      !hunterGui.rapidFire.enabled(true))
  );
};

spells.trueshot.Callback((spell) => {
  if (hunterGui.trueshot.enabled() && isTrueShotReady()) {
    spell.Cast();
  }
});

spells.volley.Callback((spell) => {
  const target = awful.target;

  if (hunterGui.volley.enabled()) {
    spell.AoECast(target);
  }
});

spells.volley.Callback('mm.volley.st.1', (spell) => {
  const player = awful.player;
  const target = awful.target;

  if (hunterGui.volley.enabled() && player.buff(HunterBuffs.salvo)) {
    spell.AoECast(target);
  }
});

spells.coordinatedAssault.Callback((spell) => {
  const target = awful.target;

  if (hunterGui.coordinatedAssault.enabled()) {
    spell.Cast(target);
  }
});

spells.furyOfTheEagle.Callback((spell) => {
  const enemiesCount = myCache.get(eightFightableFacing).length;

  if (hunterGui.furyOfTheEagle.enabled() && enemiesCount > 0) {
    spell.Cast();
  }
});

spells.spearhead.Callback('sv.spearhead.st.1', (spell) => {
  const player = awful.player;
  const target = awful.target;

  if (
    hunterGui.spearhead.enabled() &&
    player.focus + svKillCommandRegen() > player.focusMax - 10 &&
    (!hunterGui.deathChakram.enabled() ||
      spells.deathChakram.cd > awful.gcd ||
      !player.hasTalent(HunterTalents.deathChakram))
  ) {
    spell.Cast(target);
  }
});

spells.counterShot.Callback((spell) => {
  if (!hunterGui.counterShot.enabled() || !statusFrame.interrupts.enabled())
    return;

  const enemies = myCache.get(fourthyEngagedLosFacing);

  for (const enemy of enemies) {
    if (canKickEnemy(enemy)) {
      if (spell.Cast(enemy)) {
        interruptsHistory.set(enemy);
        return;
      }
    }
  }
});

spells.muzzle.Callback((spell) => {
  if (!hunterGui.muzzle.enabled() || !statusFrame.interrupts.enabled()) return;

  const enemies = myCache.get(meleeFightableLosFacing);

  for (const enemy of enemies) {
    if (canKickEnemy(enemy)) {
      if (spell.Cast(enemy)) {
        interruptsHistory.set(enemy);
        return;
      }
    }
  }
});

spells.counterShot.Callback('mechanic', (spell, unit) => {
  const player = awful.player;
  const target = unit as IAwfulUnit;

  if (target.los && target.playerFacing && target.distanceTo(player) < 40) {
    spell.Cast(target);
  }
});

spells.tranquilizingShot.Callback((spell) => {
  if (!hunterGui.tranquilizingShot.enabled()) return;

  const enemies = myCache.get(fourthyEngagedLosFacing);

  for (const enemy of enemies) {
    if (
      canDispelBuff(enemy, {
        listDispelType: [DispelType.Enrage, DispelType.Magic],
        //delay: hunterGui.tranquilizingShotDelay.getDelay(),
      })
    ) {
      if (spell.Cast(enemy)) return;
    }
  }
});

spells.freezingTrap.Callback((spell) => {
  if (!hunterGui.freezingTrap.enabled() || !statusFrame.interrupts.enabled())
    return;

  const enemies = myCache.get(fourthyEngagedLos);

  for (const enemy of enemies) {
    if (canStunEnemy(enemy, 1)) {
      if (spell.AoECast(enemy)) {
        interruptsHistory.set(enemy);
        return;
      }
    }
  }
});

spells.tranquilizingShot.Callback('mechanic', (spell, unit) => {
  if (unit.los && unit.distance < 40) {
    spell.Cast(unit);
  }
});

spells.freezingTrap.Callback('mechanic', (spell, unit) => {
  const player = awful.player;
  const target = unit as IAwfulUnit;

  if (target.los && target.distanceTo(player) < 40) {
    spell.AoECast(target);
  }
});

spells.tarTrap.Callback('mechanic', (spell, unit) => {
  const player = awful.player;
  const target = unit as IAwfulUnit;

  if (target.los && target.distanceTo(player) <= 40) {
    spell.AoECast(target);
  }
});

spells.bindingShot.Callback('mechanic', (spell, unit) => {
  const player = awful.player;
  const target = unit as IAwfulUnit;

  if (target.los && target.distanceTo(player) <= 30) {
    spell.AoECast(target);
  }
});

spells.serpentSting.Callback('mechanic', (spell, unit) => {
  const player = awful.player;
  const target = unit as IAwfulUnit;

  if (target.los && target.playerFacing && target.distanceTo(player) <= 40) {
    spell.Cast(target);
  }
});

spells.intimidation.Callback((spell) => {
  const pet = awful.pet;
  if (
    !pet.exists ||
    pet.dead ||
    !hunterGui.intimidation.enabled() ||
    !statusFrame.interrupts.enabled()
  )
    return;

  const enemies = myCache.get(fourthyEngagedLos);

  for (const enemy of enemies) {
    if (enemy.distanceTo(pet) <= 50 && canStunEnemy(enemy, 0.5)) {
      if (spell.Cast(enemy)) {
        interruptsHistory.set(enemy);
        return;
      }
    }
  }
});

spells.intimidation.Callback('mechanic', (spell, unit) => {
  const pet = awful.pet;
  const player = awful.player;
  const target = unit as IAwfulUnit;

  if (!pet.exists || pet.dead) return;

  if (
    target.los &&
    target.distanceTo(player) < 100 &&
    target.distanceTo(pet) < 50
  ) {
    spell.AoECast(target);
  }
});

spells.feignDeath.Callback('mechanic', (spell, unit) => {
  spell.Cast();
});

export const petStatus = {
  triedPetCall: false,
};

spells.mendRevivePet.Callback('revive', (spell) => {
  const player = awful.player;
  const pet = awful.pet;

  if (
    !hunterGui.summonRevive.enabled() ||
    hunterStatusFrame.hunterPet.disabled() ||
    (hunterGui.loneWolf.enabled() && player.hasTalent(HunterTalents.loneWolf))
  )
    return;

  if ((pet.exists && pet.dead) || (!pet.exists && petStatus.triedPetCall)) {
    spell.Cast();
    petStatus.triedPetCall = false;
  }
});

spells.mendRevivePet.Callback('mend', (spell) => {
  const pet = awful.pet;

  if (
    pet.exists &&
    !pet.dead &&
    hunterGui.mendPet.canUse() &&
    !pet.buff(PetBuffs.mend)
  ) {
    spell.Cast();
  }
});

const callPetCallback = (spell: IAwfulSpell): void => {
  if (spell.Cast()) petStatus.triedPetCall = true;
};

spells.callPet1.Callback(callPetCallback);

spells.callPet2.Callback(callPetCallback);

spells.callPet3.Callback(callPetCallback);

spells.callPet4.Callback(callPetCallback);

spells.callPet5.Callback(callPetCallback);

spells.disengage.Callback((spell) => {
  if (spell.Cast()) {
    disengageTrigger.disable();
  }
});

export const disengageForwardInfos = {
  inverseTime: 0,
  playerRotation: undefined as number | undefined,
};

spells.disengage.Callback('forward', (spell) => {
  if (disengageForwardInfos.inverseTime > awful.time) return;

  if (spell.Cast()) {
    disengageTrigger.disable();
    disengageForwardInfos.inverseTime = awful.time + 0.05;
  }
});

spells.exhilaration.Callback((spell) => {
  if (hunterGui.exhilaration.canUse()) {
    spell.Cast();
  }
});

spells.survivalOfTheFittest.Callback((spell) => {
  const time = timeLine.timeTillDamages();
  if (
    hunterGui.survivalOfTheFittest.canUse() &&
    time &&
    time < 2 &&
    time >= awful.buffer
  ) {
    spell.Cast();
  }
});

spells.fortitudeOfTheBear.Callback((spell) => {
  const pet = awful.pet;
  const time = timeLine.timeTillDamages();
  if (
    pet.exists &&
    !pet.dead &&
    hunterGui.fortitudeOfTheBear.canUse() &&
    time &&
    time < 2 &&
    time >= awful.buffer
  ) {
    spell.Cast();
  }
});

spells.aspectOfTheTurtle.Callback((spell) => {
  if (
    hunterGui.aspectOfTheTurtle.canUse() &&
    !awful.player.buff(HunterBuffs.aspectOfTheTurtle)
  ) {
    spell.Cast();
  }
});

spells.misdirection.Callback((spell) => {
  const allies = awful.group;

  const pet = awful.pet;

  for (const ally of allies) {
    if (ally.los && !ally.dead && ally.distance < 100 && ally.isTank) {
      if (spell.Cast(ally)) return;
    }
  }

  if (pet.exists && !pet.dead && pet.distance < 100 && pet.los) {
    spell.Cast(pet);
  }
});

// Base callback

const racialCallback = (spell: IAwfulSpell): void => {
  if (hunterGui.racial.enabled()) {
    spell.Cast();
  }
};

baseSpells.bloodFury.Callback(racialCallback);

baseSpells.ancestralCall.Callback(racialCallback);

baseSpells.fireblood.Callback(racialCallback);

baseSpells.berserking.Callback(racialCallback);

baseSpells.arcaneTorrent.Callback(racialCallback);

baseSpells.lightsJudgment.Callback((spell) => {
  const player = awful.player;
  const target = awful.target;

  if (
    !player.buff(HunterBuffs.trueShot) &&
    !player.buff(HunterBuffs.bestialWrath) &&
    hunterGui.racial.enabled()
  ) {
    spell.AoECast(target);
  }
});

baseSpells.bagOfTricks.Callback((spell) => {
  const player = awful.player;
  const target = awful.target;

  if (!player.buff(HunterBuffs.trueShot) && hunterGui.racial.enabled()) {
    spell.Cast(target);
  }
});

baseSpells.bagOfTricks.Callback('sv.bagOfTricks.cds.1', (spell) => {
  const target = awful.target;

  if (
    hunterGui.racial.enabled() &&
    fullRechargeTime(spells.killCommandSV) > awful.gcd + awful.buffer
  ) {
    spell.Cast(target);
  }
});
