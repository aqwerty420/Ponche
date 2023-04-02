interface IPonche {
  hunter: {
    beastMastery?: IAwfulSpecialization;
    marksmanship?: IAwfulSpecialization;
    survival?: IAwfulSpecialization;
  };
}

declare const ponche: IPonche;

declare const enum RotationMode {
  st = 'ST',
  auto = 'Auto',
}

interface IDynamicParameters {
  all?: true;
  range?: number;
  rangeLiteral?: number;
  melee?: true;
  rangeFromUnit?: IAwfulUnit;
  rangeFrom?: number;
  rangeFromLiteral?: number;
  rangeFromMelee?: true;
  alive?: true;
  affectingCombat?: true;
  notCc?: true;
  notBlacklisted?: true;
  los?: true;
  facing?: true;
  facingPlayer?: true;
  xSpellRange?: string;
  immune?: true;
}

interface IDynamicCache {
  [key: string]: IAwfulList<IAwfulUnit>;
}
