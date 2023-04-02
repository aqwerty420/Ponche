import { Bombs } from './lists';

export const isNextBomb = (bomb: Bombs): boolean => {
  const [, , nextBomb] = GetSpellInfo(Bombs.wildfireBomb);
  const [, , seekBomb] = GetSpellInfo(bomb);

  return nextBomb === seekBomb;
};

//TODO: implement & test
export const isInExplosion = (base: IAwfulUnit, unit: IAwfulUnit): boolean => {
  if (base.distanceToLiteral(unit) > 8) return false;

  const [baseX, baseY] = base.position();
  const [playerX, playerY] = awful.player.position();
  const [unitX, unitY] = unit.position();

  const v1x = baseX - playerX;
  const v1y = baseY - playerY;
  const v2x = unitX - baseX;
  const v2y = unitY - baseY;

  const t = math.atan2(v1x * v2y - v1y * v2x, v1x * v2x + v1y * v2y);

  return math.abs(t) <= math.pi / 2;
};
