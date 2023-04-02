import { myCache } from './cache';
import { ModulableGui, generalGui } from './gui';
import {
  refreshingHealingPotionOne,
  refreshingHealingPotionTwo,
  refreshingHealingPotionThree,
  healthStone,
  trinket1,
  trinket2,
} from './items';
import {
  EnemyBuffs,
  kickCast,
  kickChanneled,
  kickChanneling,
  stunCast,
  stunChanneled,
  stunChanneling,
  unitStunBlacklis,
} from './lists';
import { interruptsHistory } from './mechanics';

awful.DevMode = true;
awful.ttd_enabled = true;

export const selectNewTarget = (options: IDynamicParameters): void => {
  const player = awful.player;
  const target = awful.target;

  if (
    !generalGui.autoSwap.enabled() ||
    (target.exists &&
      player.canAttack(target) &&
      !target.dead &&
      target.health > 2)
  )
    return;

  const enemies = myCache.get(options);

  let bestEnemy: IAwfulUnit | undefined;

  enemies.loop((enemy) => {
    if (!bestEnemy || bestEnemy.health < enemy.health) {
      bestEnemy = enemy;
    }
  });

  if (bestEnemy) {
    bestEnemy.setTarget();
  }
};

export const baseDefensives = (classGui: ModulableGui): void => {
  const player = awful.player;

  if (!player.combat) return;

  if (healthStone.usable && classGui.healthStone.canUse()) {
    healthStone.Use();
  }

  if (classGui.refreshingHealingPotion.canUse()) {
    if (refreshingHealingPotionThree.usable) refreshingHealingPotionThree.Use();
    if (refreshingHealingPotionTwo.usable) refreshingHealingPotionTwo.Use();
    if (refreshingHealingPotionOne.usable) refreshingHealingPotionOne.Use();
  }
};

export const useTrinkets = (
  classGui: ModulableGui,
  ignoreGriefTorche = false
): boolean => {
  const player = awful.player;

  if (!player.combat) return false;

  if (classGui.trinket1.enabled() && trinket1.use(ignoreGriefTorche)) {
    return true;
  }
  if (classGui.trinket2.enabled() && trinket2.use(ignoreGriefTorche)) {
    return true;
  }
  return false;
};

export const isEnemyKickImmune = (enemy: IAwfulUnit): boolean => {
  return (
    enemy.buff(EnemyBuffs.sentinelsWatch) != undefined ||
    enemy.buff(EnemyBuffs.iceShield) != undefined ||
    enemy.buff(EnemyBuffs.iceBulwark) != undefined
  );
};

export const canRawKickCast = (enemy: IAwfulUnit, spellId: number): boolean => {
  return enemy.castID === spellId && enemy.castRemains >= awful.buffer;
};

export const canRawKickChannel = (
  enemy: IAwfulUnit,
  spellId: number
): boolean => {
  return enemy.channelID === spellId && enemy.channelRemains >= awful.buffer;
};

export const canKickCast = (enemy: IAwfulUnit): boolean => {
  return (
    enemy.casting != undefined &&
    enemy.castRemains >= awful.buffer &&
    ((enemy.castPct >= generalGui.interruptAt.value() &&
      enemy.castTimeComplete >= generalGui.interrupDelay.getDelay()) ||
      enemy.castRemains < awful.gcd + awful.buffer * 2) &&
    ((!generalGui.whitelist.enabled() && !enemy.casting8) ||
      kickCast.has(enemy.castID))
  );
};

export const canKickChannel = (enemy: IAwfulUnit): boolean => {
  const [, , , , , , notInterruptible] = UnitChannelInfo(enemy.pointer);

  return (
    enemy.channeling != undefined &&
    enemy.channelRemains >= awful.buffer &&
    ((!generalGui.whitelist.enabled() && !notInterruptible) ||
      (kickChanneling.has(enemy.channelID) && enemy.channelRemains > 1.5) ||
      kickChanneled.has(enemy.channelID))
  );
};

export const canKickEnemy = (enemy: IAwfulUnit): boolean => {
  return (
    (!generalGui.focus.enabled() || enemy.isUnit(awful.focus)) &&
    !isEnemyKickImmune(enemy) &&
    !interruptsHistory.recentlyHandled(enemy) &&
    (canKickCast(enemy) || canKickChannel(enemy))
  );
};

export const isEnemyStunImmune = (enemy: IAwfulUnit): boolean => {
  return (
    unitStunBlacklis.has(enemy.id) ||
    enemy.buff(EnemyBuffs.inspiringPresence) != undefined ||
    enemy.buff(EnemyBuffs.sentinelsWatch) != undefined ||
    enemy.buff(EnemyBuffs.iceShield) != undefined
  );
};

export const canStunCast = (enemy: IAwfulUnit, delay: number): boolean => {
  return (
    enemy.casting != undefined &&
    enemy.castRemains >= delay &&
    ((enemy.castPct >= generalGui.interruptAt.value() &&
      enemy.castTimeComplete >= generalGui.interrupDelay.getDelay()) ||
      enemy.castRemains < awful.gcd + awful.buffer * 2) &&
    ((!generalGui.whitelist.enabled() && !enemy.casting8) ||
      stunCast.has(enemy.castID) ||
      kickCast.has(enemy.castID))
  );
};

export const canStunChannel = (enemy: IAwfulUnit, delay: number): boolean => {
  const [, , , , , , notInterruptible] = UnitChannelInfo(enemy.pointer);

  return (
    enemy.channeling != undefined &&
    enemy.channelRemains >= delay &&
    ((!generalGui.whitelist.enabled() && !notInterruptible) ||
      ((stunChanneling.has(enemy.channelID) ||
        kickChanneling.has(enemy.channelID)) &&
        enemy.channelRemains > 1 + delay) ||
      stunChanneled.has(enemy.channelID) ||
      kickChanneled.has(enemy.channelID))
  );
};

export const canStunEnemy = (enemy: IAwfulUnit, delay?: number): boolean => {
  delay = (delay || 0) + awful.buffer;
  return (
    (!generalGui.focus.enabled() || enemy.isUnit(awful.focus)) &&
    !isEnemyStunImmune(enemy) &&
    !interruptsHistory.recentlyHandled(enemy) &&
    (canStunCast(enemy, delay) || canStunChannel(enemy, delay))
  );
};

const drawPlayerFeetDot = (
  draw: IAwfulDrawer,
  classGui: ModulableGui
): void => {
  if (!classGui.playerFeetDot.enabled()) return;

  const player = awful.player;

  const [px, py, pz] = player.position();

  const playerFeetDotColor = classGui.playerFeetDotColor.get();
  draw.SetColor(
    playerFeetDotColor[0],
    playerFeetDotColor[1],
    playerFeetDotColor[2],
    playerFeetDotColor[3]
  );

  draw.FilledCircle(px, py, pz, 0.2);
};

const drawAttackRange = (
  draw: IAwfulDrawer,
  classGui: ModulableGui,
  range: number,
  melee: boolean
): void => {
  if (!classGui.drawAttackRange.enabled()) return;

  const player = awful.player;
  const target = awful.target;

  if (target.boundingRadius == false || player.boundingRadius == false) return;

  const [px, py, pz] = player.position();

  const attackRangeColor =
    !target.exists ||
    (melee &&
      target.distanceLiteral - target.combatReach - player.combatReach >
        range) ||
    (!melee && target.distance > range)
      ? classGui.attackRangeOutColor.get()
      : classGui.attackRangeInColor.get();

  draw.SetColor(
    attackRangeColor[0],
    attackRangeColor[1],
    attackRangeColor[2],
    attackRangeColor[3]
  );

  draw.Circle(px, py, pz, range);

  draw.SetColor(
    attackRangeColor[0],
    attackRangeColor[1],
    attackRangeColor[2],
    attackRangeColor[3] / 10
  );
  if (classGui.playerFilledCircle.enabled())
    draw.FilledCircle(px, py, pz, range);
};

const drawTargetCircle = (draw: IAwfulDrawer, classGui: ModulableGui): void => {
  if (!classGui.drawTargetAttackRange.enabled()) return;

  const target = awful.target;
  if (target.boundingRadius == false || target.distance > 100) return;

  const [tx, ty, tz] = target.position();

  const targetRange = target.combatReach;

  const targetAttackRangeColor = classGui.targetAttackRangeColor.get();

  draw.SetColor(
    targetAttackRangeColor[0],
    targetAttackRangeColor[1],
    targetAttackRangeColor[2],
    targetAttackRangeColor[3]
  );
  draw.Circle(tx, ty, tz, targetRange);

  draw.SetColor(
    targetAttackRangeColor[0],
    targetAttackRangeColor[1],
    targetAttackRangeColor[2],
    targetAttackRangeColor[3] / 10
  );
  if (classGui.targetFilledCircle.enabled())
    draw.FilledCircle(tx, ty, tz, targetRange);
};

const drawTargetLine = (draw: IAwfulDrawer, classGui: ModulableGui): void => {
  if (!classGui.drawTargetLine.enabled()) return;

  const player = awful.player;
  const target = awful.target;

  if (
    target.boundingRadius == false ||
    player.boundingRadius == false ||
    target.distance > 100
  )
    return;

  const [px, py, pz] = player.position();

  const [tx, ty, tz] = target.position();

  if (classGui.drawTargetAttackRange.enabled()) {
    const deltaX = px - tx;
    const deltaY = py - ty;
    const distance = target.distanceLiteral;
    const diff = target.combatReach / distance;
    const nx = tx + diff * deltaX;
    const ny = ty + diff * deltaY;
    const targetAttackRangeColor = classGui.targetAttackRangeColor.get();
    draw.SetColor(
      targetAttackRangeColor[0],
      targetAttackRangeColor[1],
      targetAttackRangeColor[2],
      targetAttackRangeColor[3]
    );

    draw.Line(px, py, pz, nx, ny, tz);
  } else {
    draw.Line(px, py, pz, tx, ty, tz);
  }
};

const isTargetMyPet = (): boolean => {
  const player = awful.player;
  const target = awful.target;

  return target.isPet && target.creator.isUnit(player);
};

export const globalDraws = (
  draw: IAwfulDrawer,
  classGui: ModulableGui,
  range: number,
  melee = false
): void => {
  const player = awful.player;
  const target = awful.target;

  if (!player.exists || player.dead || player.mounted) return;

  drawAttackRange(draw, classGui, range, melee);
  drawPlayerFeetDot(draw, classGui);

  if (
    target.exists &&
    target.boundingRadius != false &&
    !player.isUnit(target) &&
    !isTargetMyPet()
  ) {
    drawTargetCircle(draw, classGui);
    drawTargetLine(draw, classGui);
  }
};

class FightTracker {
  private fightStart = 0;
  private started = false;

  constructor() {
    awful.addUpdateCallback(() => this.update());
  }

  private update(): void {
    const player = awful.player;

    if (player.combat) {
      if (!this.started) {
        this.fightStart = awful.time;
        this.started = true;
      }
    } else {
      this.fightStart = awful.time;
      this.started = false;
    }
  }

  public fightTime(): number {
    return awful.time - this.fightStart;
  }
}

export const fightTracker = new FightTracker();

const aroundParameters: IDynamicParameters = {
  range: 40,
  alive: true,
  affectingCombat: true,
  notCc: true,
  notBlacklisted: true,
};

export const playerHasAggro = (): boolean => {
  const player = awful.player;
  const enemies = myCache.get(aroundParameters);

  for (const enemy of enemies) {
    const threat = UnitThreatSituation(player.pointer, enemy.pointer);
    if (
      threat === ThreatStatus.highestTreat ||
      threat === ThreatStatus.highestAndPrimary
    )
      return true;
  }

  return false;
};

export const canDispell = (
  ally: IAwfulUnit,
  listDispelType?: Array<DispelType>
): boolean => {
  for (const [, , , type, , , , isStealable] of ally.debuffs)
    if (
      (!listDispelType ||
        (type != undefined && listDispelType.includes(type))) &&
      isStealable
    ) {
      return true;
    }
  return false;
};

export interface CanDispelParams {
  listDispelType?: Array<DispelType>;
  delay?: number;
}

export const canDispelBuff = (
  unit: IAwfulUnit,
  params?: CanDispelParams
): boolean => {
  for (const [, , , type, , expirationTime, , isStealable] of unit.buffs) {
    const time = awful.time;
    const timeElapsed = time - expirationTime;
    if (
      (!params || !params.delay || timeElapsed > params.delay) &&
      (!params ||
        !params.listDispelType ||
        (type != undefined && params.listDispelType.includes(type))) &&
      isStealable
    ) {
      return true;
    }
  }
  return false;
};
