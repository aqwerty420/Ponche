export const bloodFury = awful.NewSpell(20572, { targeted: false });

export const ancestralCall = awful.NewSpell(274738, { targeted: false });

export const fireblood = awful.NewSpell(265221, { targeted: false });

export const lightsJudgment = awful.NewSpell(255647, {
  targeted: false,
  ranged: true,
  radius: 5,
});

export const bagOfTricks = awful.NewSpell(312411, {
  targeted: true,
  ranged: true,
  damage: AwfulSpellType.physical,
});

export const berserking = awful.NewSpell(26297, { targeted: false });

export const arcaneTorrent = awful.NewSpell(25046, { targeted: false });
