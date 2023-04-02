import { bypassThreat, unitBlacklist } from './lists';

class MyCache {
  protected cache!: IDynamicCache;

  constructor() {
    awful.addUpdateCallback(() => this.reset());
  }

  public reset() {
    this.cache = {};
  }

  public static groupTagged(unit: IAwfulUnit): boolean {
    if (bypassThreat.has(unit.id)) return true;

    for (const ally of awful.fGroup) {
      if (UnitThreatSituation(ally.pointer, unit.pointer) != undefined)
        return true;
    }

    return false;
  }

  public static isImmune(unit: IAwfulUnit): boolean {
    return unit.buff(374779) != undefined || unit.buff(384132) != undefined;
  }

  public dynamicFilter(options: IDynamicParameters, unit: IAwfulUnit): boolean {
    if (!awful.player.canAttack(unit)) return false;

    if (unit.health <= 2) return false;

    if (options.range != undefined && unit.distance > options.range)
      return false;

    if (
      options.rangeLiteral != undefined &&
      unit.distanceLiteral > options.rangeLiteral
    )
      return false;

    if (
      options.rangeFrom != undefined &&
      options.rangeFromUnit != undefined &&
      unit.distanceTo(options.rangeFromUnit) > options.rangeFrom
    )
      return false;

    if (
      options.rangeFromLiteral != undefined &&
      options.rangeFromUnit != undefined &&
      unit.distanceToLiteral(options.rangeFromUnit) > options.rangeFromLiteral
    )
      return false;

    if (
      options.rangeFromMelee != undefined &&
      options.rangeFromUnit != undefined &&
      unit.meleeRangeOf(options.rangeFromUnit)
    )
      return false;

    if (
      options.xSpellRange != undefined &&
      Number(IsSpellInRange(options.xSpellRange, unit.pointer)) != 1 &&
      !unit.meleeRangeOf(awful.player)
    )
      return false;

    if (options.melee != undefined && !unit.meleeRange) return false;

    if (options.alive != undefined && unit.dead) return false;

    if (options.affectingCombat != undefined && !MyCache.groupTagged(unit))
      return false;

    if (options.notCc != undefined && unit.cc) return false;

    if (options.notBlacklisted != undefined && unitBlacklist.has(unit.id))
      return false;

    if (options.los != undefined && !unit.los) return false;

    if (options.facing != undefined && !unit.playerFacing) return false;

    if (options.facingPlayer != undefined && !unit.facing(awful.player))
      return false;

    if (options.immune != undefined && MyCache.isImmune(unit)) return false;

    return true;
  }

  protected getIndex(options: IDynamicParameters): string {
    let index = '';

    if (options.all != undefined) index += 'all';
    if (options.range != undefined) index += `range${options.range}`;
    if (options.rangeLiteral != undefined)
      index += `rangeLiteral${options.rangeLiteral}`;
    if (options.melee != undefined) index += 'melee';
    if (options.rangeFromUnit != undefined) index += options.rangeFromUnit.guid;
    if (options.rangeFrom != undefined)
      index += `rangeFrom${options.rangeFrom}`;
    if (options.rangeFromLiteral != undefined)
      index += `rangeFromLiteral${options.rangeFromLiteral}`;
    if (options.rangeFromMelee != undefined) index += 'rangeFromMelee';
    if (options.alive != undefined) index += 'alive';
    if (options.affectingCombat != undefined) index += 'affectingCombat';
    if (options.notCc != undefined) index += 'notCc';
    if (options.notBlacklisted != undefined) index += 'notBlacklisted';
    if (options.los != undefined) index += 'los';
    if (options.facing != undefined) index += 'facing';
    if (options.facingPlayer != undefined) index += 'facingPlayer';
    if (options.immune != undefined) index += 'immune';

    return index;
  }

  public get(options: IDynamicParameters): IAwfulList<IAwfulUnit> {
    const index = this.getIndex(options);
    if (this.cache[index] != null) return this.cache[index];

    const enemies = options.all
      ? awful.units.filter((unit) => this.dynamicFilter(options, unit))
      : awful.enemies.filter((unit) => this.dynamicFilter(options, unit));
    this.cache[index] = enemies;

    return enemies;
  }

  public getExplosives(options: IDynamicParameters): IAwfulList<IAwfulUnit> {
    const enemies = awful.explosives.filter((unit) =>
      this.dynamicFilter(options, unit)
    );
    return enemies;
  }
}

export const myCache = new MyCache();
