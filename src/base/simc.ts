export const fullRechargeTime = (spell: IAwfulSpell): number => {
  const [currentCharges, maxCharges, cooldownStart, cooldownDuration] =
    GetSpellCharges(spell.id);

  if (!currentCharges) return 0;

  const currentChargeTime =
    ((currentCharges || 0) < (maxCharges || 0) &&
      cooldownDuration - (GetTime() - (cooldownStart || 0))) ||
    0;

  const leftChargesTotalTime =
    (maxCharges - currentCharges - 1) * cooldownDuration;

  if (currentCharges !== maxCharges) {
    return currentChargeTime + leftChargesTotalTime;
  }

  return 0;
};

export const regenRate = (): number => {
  const [, regenRate] = GetPowerRegen(awful.player.pointer);

  return regenRate;
};

export const timeToMax = (): number => {
  const player = awful.player;

  const maxPower = player.powerMax;
  const power = player.power;

  return maxPower === power ? 0 : (maxPower - power) * (1.0 / regenRate());
};

export const executeTime = (baseTime: number): number => {
  const haste = UnitSpellHaste(awful.player.pointer);
  return baseTime / (1 + haste / 100);
};

export const isRefreshable = (
  unit: IAwfulUnit,
  debuffId: number,
  duration: number
): boolean => {
  const remains = unit.debuffRemains(debuffId, awful.player);
  return remains <= (duration - remains) * 0.3;
};

export const castRegen = (spell: IAwfulSpell, tooltip?: number): number => {
  const regen = regenRate();
  let castTime = spell.castTime;

  if (castTime === 0 || castTime < awful.gcd) castTime = awful.gcd;

  return regen * castTime + (tooltip ?? 0);
};

export const isRefreshableBuff = (
  unit: IAwfulUnit,
  buffId: number,
  duration: number
): boolean => {
  const remains = unit.buffRemains(buffId);
  return remains <= (duration - remains) * 0.3;
};
