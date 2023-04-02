import { myCache } from '../base/cache';
import {
  eightFightable,
  eightFightableFacing,
  fourthyFightableLosFacing,
  HunterBuffs,
  HunterDebuffs,
  meleeFightableLosFacing,
  modeParams,
} from './lists';

class HunterCache {
  protected cache!: {
    lowestBarbedShot?: IAwfulUnit;
    wildfireBombTicking?: boolean;
    butcheryInternalBleedingStacks?: boolean;
    carveShrapnelTicking?: boolean;
    maxLatentPoisonStacksMelee?: IAwfulUnit;
    minBloodseekerRemains?: IAwfulUnit;
    minSerpentStingRemainsMelee?: IAwfulUnit;
    minSerpentStingByTTD?: { [key: string]: IAwfulUnit };
  };

  constructor() {
    awful.addUpdateCallback(() => this.reset());
  }

  public reset() {
    this.cache = {};
  }

  public wildfireBombTicking(): boolean {
    const player = awful.player;

    if (this.cache.wildfireBombTicking != undefined)
      return this.cache.wildfireBombTicking;

    const enemies = myCache.get(eightFightable);

    for (const enemy of enemies) {
      if (enemy.buff(HunterDebuffs.wildfireBomb, player)) {
        this.cache.wildfireBombTicking = true;
        return true;
      }
    }

    this.cache.wildfireBombTicking = false;
    return false;
  }

  public butcheryInternalBleedingStacks(): boolean {
    const player = awful.player;

    if (this.cache.butcheryInternalBleedingStacks != undefined)
      return this.cache.butcheryInternalBleedingStacks;

    const enemies = myCache.get(eightFightable);

    for (const enemy of enemies) {
      const bleedingStacks = enemy.buffStacks(
        HunterDebuffs.internalBleeding,
        player
      );
      const shrapnelRemaining = enemy.debuffRemains(
        HunterDebuffs.shrapnelBomb,
        player
      );
      if (
        shrapnelRemaining > 0 &&
        (bleedingStacks < 2 || shrapnelRemaining < awful.gcd + awful.buffer)
      ) {
        this.cache.butcheryInternalBleedingStacks = true;
        return true;
      }
    }

    return true;
  }

  public carveShrapnelTicking(): boolean {
    const player = awful.player;

    if (this.cache.carveShrapnelTicking != undefined)
      return this.cache.carveShrapnelTicking;

    const enemies = myCache.get(eightFightableFacing);

    for (const enemy of enemies) {
      if (enemy.debuff(HunterDebuffs.shrapnelBomb, player)) {
        this.cache.carveShrapnelTicking = true;
        return true;
      }
    }

    this.cache.carveShrapnelTicking = false;
    return false;
  }

  public maxLatentPoisonStacksMelee(): IAwfulUnit {
    const player = awful.player;

    if (this.cache.maxLatentPoisonStacksMelee != undefined)
      return this.cache.maxLatentPoisonStacksMelee;

    const enemies = player.buff(HunterBuffs.aspectOfTheEagle)
      ? myCache.get(fourthyFightableLosFacing)
      : myCache.get(meleeFightableLosFacing);

    let maxStacks = 0;
    let maxStacksUnit: IAwfulUnit = awful.target;

    for (const enemy of enemies) {
      const stacks = enemy.debuffStacks(HunterDebuffs.latentPoison, player);
      if (stacks > maxStacks) {
        maxStacks = stacks;
        maxStacksUnit = enemy;
      }
    }

    this.cache.maxLatentPoisonStacksMelee = maxStacksUnit;
    return maxStacksUnit;
  }

  public minBloodseekerRemains(): IAwfulUnit {
    const target = awful.target;
    const pet = awful.pet;

    if (this.cache.minBloodseekerRemains != undefined)
      return this.cache.minBloodseekerRemains;

    const enemies = myCache.get(modeParams);

    let minRemains = 100;
    let minRemainsUnit: IAwfulUnit = target;

    for (const enemy of enemies) {
      const remains = enemy.debuffRemains(HunterDebuffs.bloodseeker, pet);
      if (remains < minRemains) {
        minRemains = remains;
        minRemainsUnit = enemy;
      }
    }

    this.cache.minBloodseekerRemains = minRemainsUnit;
    return minRemainsUnit;
  }

  public lowestbarbedShot(): IAwfulUnit {
    const player = awful.player;

    if (this.cache.lowestBarbedShot != undefined)
      return this.cache.lowestBarbedShot;

    const enemies = myCache.get(modeParams);

    let best = awful.target;
    let bestRemains = best.debuffRemains(HunterDebuffs.barbedShot, player);

    for (const enemy of enemies) {
      const enemyRemains = enemy.debuffRemains(
        HunterDebuffs.barbedShot,
        player
      );
      if (
        enemyRemains < bestRemains ||
        (enemyRemains == bestRemains && enemy.health > best.health)
      ) {
        best = enemy;
        bestRemains = enemyRemains;
      }
    }

    this.cache.lowestBarbedShot = best;
    return best;
  }

  public minSerpentStingRemainsMelee(): IAwfulUnit {
    const player = awful.player;

    if (this.cache.minSerpentStingRemainsMelee != undefined)
      return this.cache.minSerpentStingRemainsMelee;

    const enemies = player.buff(HunterBuffs.aspectOfTheEagle)
      ? myCache.get(fourthyFightableLosFacing)
      : myCache.get(meleeFightableLosFacing);

    let minRemains = 100;
    let minRemainsUnit: IAwfulUnit = awful.target;

    if (!minRemainsUnit.debuffRemains(HunterDebuffs.serpentSting, player)) {
      this.cache.minSerpentStingRemainsMelee = minRemainsUnit;
      return minRemainsUnit;
    }

    for (const enemy of enemies) {
      const remains = enemy.debuffRemains(HunterDebuffs.serpentSting, player);
      if (
        enemy.ttd > 6 &&
        (remains < minRemains ||
          (remains === minRemains && enemy.hp > minRemainsUnit.hp))
      ) {
        minRemains = remains;
        minRemainsUnit = enemy;
      }
    }

    this.cache.minSerpentStingRemainsMelee = minRemainsUnit;
    return minRemainsUnit;
  }

  public minSerpentStingRemains(minTTD = 7): IAwfulUnit {
    const player = awful.player;

    if (
      this.cache.minSerpentStingByTTD &&
      this.cache.minSerpentStingByTTD[minTTD] != undefined
    )
      return this.cache.minSerpentStingByTTD[minTTD];

    const enemies = myCache.get(fourthyFightableLosFacing);

    let minRemains = 100;
    let minRemainsUnit: IAwfulUnit = awful.target;

    if (
      !minRemainsUnit.debuffRemains(HunterDebuffs.serpentSting, player) &&
      minRemainsUnit.ttd > minTTD
    ) {
      return minRemainsUnit;
    }

    for (const enemy of enemies) {
      const remains = enemy.debuffRemains(HunterDebuffs.serpentSting, player);
      if (
        enemy.ttd > minTTD &&
        (remains < minRemains ||
          (remains === minRemains && enemy.hp > minRemainsUnit.hp))
      ) {
        minRemains = remains;
        minRemainsUnit = enemy;
      }
    }

    this.cache.minSerpentStingByTTD = this.cache.minSerpentStingByTTD || {};
    this.cache.minSerpentStingByTTD[minTTD] = minRemainsUnit;

    return minRemainsUnit;
  }
}

export const hunterCache = new HunterCache();
