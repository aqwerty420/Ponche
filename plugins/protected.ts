import ts from 'typescript';
import * as tstl from 'typescript-to-lua';

const protectedList = [
  'TargetUnit',
  'UseInventoryItem',
  'CastSpellByName',
  'PetAttack',
  'AttackTarget',
  'UseItemByName',
  'StartAttack',
  'UnitSpellHaste',
  'GetPowerRegen',
  'UnitDetailedThreatSituation',
  'UnitAffectingCombat',
  'UnitChannelInfo',
  'UnitPower',
  'GetInventoryItemCooldown',
  'GetInventoryItemLink',
  'IsSpellInRange',
  'UnitGUID',
  'UnitIsTapDenied',
  'UnitCreatureType',
  'UnitIsUnit',
  'UnitExists',
  'UnitClass',
  'UnitRace',
  'UnitAura',
  'UnitThreatSituation',
];

const plugin: tstl.Plugin = {
  beforeEmit(
    program: ts.Program,
    options: tstl.CompilerOptions,
    emitHost: tstl.EmitHost,
    result: tstl.EmitFile[]
  ) {
    void program;
    void options;
    void emitHost;

    for (const file of result) {
      for (const protectedFunction of protectedList) {
        file.code = file.code.replace(
          new RegExp(`(${protectedFunction}\\(\\))`, 'g'),
          `awful.call("${protectedFunction}")`
        );

        file.code = file.code.replace(
          new RegExp(`(${protectedFunction}\\()`, 'g'),
          `awful.call("${protectedFunction}", `
        );
      }
    }
  },
};

export default plugin;
