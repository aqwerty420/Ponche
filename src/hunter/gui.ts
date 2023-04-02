import {
  myGui,
  awfulStatusFrame,
  ModulableGui,
  MyCheckBox,
  MyTrigger,
  MyPetDefensive,
  MyColorPicker,
  MySlider,
  MyCooldownsBySpell,
  MyDefensiveBySpell,
  MyDropdown,
  MyCheckBoxBySpell,
  MyInterruptBySpell,
  CooldownsOptions,
  generalGui,
  MyText,
} from '../base/gui';

import * as spells from './spells';

const awfulGui = myGui.awfulGui;
const awfulSettings = myGui.awfulSettings;
const awfulCmd = myGui.awfulCmd;

enum MisdirectionModes {
  Smart = 'smart',
  Engage = 'engage',
  Aggro = 'aggro',
  Always = 'always',
  Never = 'never',
}

const misdirectionOptions: IAwfulDropdownOptions[] = [
  {
    label: 'Smart',
    value: MisdirectionModes.Smart,
    tooltip: 'Use on engage and when taking aggro',
  },
  {
    label: 'Engage',
    value: MisdirectionModes.Engage,
    tooltip: 'Use on combat start.',
  },
  {
    label: 'Aggro',
    value: MisdirectionModes.Aggro,
    tooltip: 'Use when taking aggro of a mob.',
  },
  {
    label: 'Always',
    value: MisdirectionModes.Always,
    tooltip: 'Always use on cooldown.',
  },
  {
    label: 'Never',
    value: MisdirectionModes.Never,
    tooltip: 'Never use.',
  },
];

class MisdirectionMode extends MyDropdown {
  constructor(eVar: string, tab: IAwfulTab) {
    const name = spells.misdirection['name'];

    super(
      eVar,
      tab,
      `${awful.textureEscape(spells.misdirection.id, 20)} - ${name}`,
      misdirectionOptions,
      {
        tooltip: `${name} usage mode.`,
        defaultValue: misdirectionOptions[0].value,
      }
    );
  }

  public onEngage(): boolean {
    return (
      this.value() === MisdirectionModes.Smart ||
      this.value() === MisdirectionModes.Engage
    );
  }

  public onAggro(): boolean {
    return (
      this.value() === MisdirectionModes.Smart ||
      this.value() === MisdirectionModes.Aggro
    );
  }

  public always(): boolean {
    return this.value() === MisdirectionModes.Always;
  }
}

export const maxSerpentSting = new MySlider(
  'maxSerpentSting',
  generalGui.combat,
  'Max Serpent Sting',
  {
    tooltip: 'Maximum number of Serpent Sting active.',
    defaultValue: 2,
    min: 1,
    max: 5,
    step: 1,
  }
);

class HunterPet {
  protected eVar = 'sfPetSlot';

  constructor() {
    awfulStatusFrame.Toggle({
      label: 'Pet: ',
      var: this.eVar,
      valueText: () => {
        return this.getStatus();
      },
      onClick: () => {
        this.update();
      },
    });
    if (awfulSettings.get(this.eVar) === null) awfulSettings.set(this.eVar, 1);
  }

  private getStatus(): string {
    return `|cffbfff81${awfulSettings.get(this.eVar)}`;
  }

  private update(): void {
    awfulSettings.set(this.eVar, (awfulSettings.get(this.eVar) as number) + 1);
    if ((awfulSettings.get(this.eVar) as number) > 5)
      awfulSettings.set(this.eVar, 0);
  }

  public value(): number {
    return awfulSettings.get(this.eVar) as number;
  }

  public disabled(): boolean {
    return this.value() === 0;
  }
}

class HunterGui extends ModulableGui {
  // Cooldowns

  // Hunter - Cooldowns

  public readonly aMurderofCrows = new MyCooldownsBySpell(
    'aMurderOfCrows',
    this.cooldownsClassTab,
    spells.aMurderofCrows,
    CooldownsOptions.Always
  );

  public readonly aspectOfTheWild = new MyCooldownsBySpell(
    'aspectofTheWild',
    this.cooldownsClassTab,
    spells.aspectOfTheWild,
    CooldownsOptions.Toggle
  );

  public barrage = new MyCooldownsBySpell(
    'barrage',
    this.cooldownsClassTab,
    spells.barrage,
    CooldownsOptions.Always
  );

  public readonly deathChakram = new MyCooldownsBySpell(
    'deathChakram',
    this.cooldownsClassTab,
    spells.deathChakram,
    CooldownsOptions.Always
  );

  public readonly explosiveShot = new MyCooldownsBySpell(
    'explosiveShot',
    this.cooldownsClassTab,
    spells.explosiveShot,
    CooldownsOptions.Always
  );

  public readonly stampede = new MyCooldownsBySpell(
    'stampede',
    this.cooldownsClassTab,
    spells.stampede,
    CooldownsOptions.Toggle
  );

  public readonly steelTrap = new MyCooldownsBySpell(
    'steelTrap',
    this.cooldownsClassTab,
    spells.steelTrap,
    CooldownsOptions.Always
  );

  public readonly wailingArrow = new MyCooldownsBySpell(
    'wailingArrow',
    this.cooldownsClassTab,
    spells.wailingArrow,
    CooldownsOptions.Always
  );

  // BM

  private readonly cooldownsBeastMasteryTab =
    this.cooldownsGroup.Tab('Beast M.');

  public readonly bestialWrath = new MyCooldownsBySpell(
    'bestialWrath',
    this.cooldownsBeastMasteryTab,
    spells.bestialWrath,
    CooldownsOptions.MiniToggle
  );

  public readonly bloodshed = new MyCooldownsBySpell(
    'bloodshed',
    this.cooldownsBeastMasteryTab,
    spells.bloodshed,
    CooldownsOptions.Always
  );

  public readonly callOfTheWild = new MyCooldownsBySpell(
    'callOfTheWild',
    this.cooldownsBeastMasteryTab,
    spells.callOfTheWild,
    CooldownsOptions.Toggle
  );

  public readonly direBeast = new MyCooldownsBySpell(
    'direBeast',
    this.cooldownsBeastMasteryTab,
    spells.direBeast,
    CooldownsOptions.Always
  );

  // MM

  private readonly cooldownsMarksmanshipTab =
    this.cooldownsGroup.Tab('Marksm.');

  public readonly aimedShot = new MyCooldownsBySpell(
    'aimedShot',
    this.cooldownsMarksmanshipTab,
    spells.aimedShot,
    CooldownsOptions.Always
  );

  public readonly rapidFire = new MyCooldownsBySpell(
    'rapidFire',
    this.cooldownsMarksmanshipTab,
    spells.rapidFire,
    CooldownsOptions.Always
  );

  public readonly salvo = new MyCooldownsBySpell(
    'salvo',
    this.cooldownsMarksmanshipTab,
    spells.salvo,
    CooldownsOptions.Toggle
  );

  public readonly trueshot = new MyCooldownsBySpell(
    'trueshot',
    this.cooldownsMarksmanshipTab,
    spells.trueshot,
    CooldownsOptions.Toggle
  );

  public readonly volley = new MyCooldownsBySpell(
    'volley',
    this.cooldownsMarksmanshipTab,
    spells.volley,
    CooldownsOptions.Toggle
  );

  // SV

  private readonly cooldownsSurvivalTab = this.cooldownsGroup.Tab('Survival');

  public readonly coordinatedAssault = new MyCooldownsBySpell(
    'coordinatedAssault',
    this.cooldownsSurvivalTab,
    spells.coordinatedAssault,
    CooldownsOptions.Toggle
  );

  public readonly furyOfTheEagle = new MyCooldownsBySpell(
    'furyOfTheEagle',
    this.cooldownsSurvivalTab,
    spells.furyOfTheEagle,
    CooldownsOptions.Toggle
  );

  public readonly spearhead = new MyCooldownsBySpell(
    'spearhead',
    this.cooldownsSurvivalTab,
    spells.spearhead,
    CooldownsOptions.Toggle
  );

  // Defensives

  public readonly exhilaration = new MyDefensiveBySpell(
    'exhilaration',
    this.defensivesTab,
    spells.exhilaration,
    40
  );

  public readonly aspectOfTheTurtle = new MyDefensiveBySpell(
    'aspectOfTheTurtle',
    this.defensivesTab,
    spells.aspectOfTheTurtle,
    10
  );

  public readonly survivalOfTheFittestDesc = new MyText(
    this.defensivesTab,
    'Spells below are only used before incoming dmg'
  );

  public readonly survivalOfTheFittest = new MyDefensiveBySpell(
    'survivalOfTheFittest',
    this.defensivesTab,
    spells.survivalOfTheFittest,
    75
  );

  public readonly fortitudeOfTheBear = new MyDefensiveBySpell(
    'fortitudeOfTheBear',
    this.defensivesTab,
    spells.fortitudeOfTheBear,
    60
  );

  // Interrupts

  public readonly counterShot = new MyInterruptBySpell(
    'counterShot',
    this.interruptsTab,
    spells.counterShot
  );

  public readonly muzzle = new MyInterruptBySpell(
    'muzzle',
    this.interruptsTab,
    spells.muzzle
  );

  public readonly freezingTrap = new MyInterruptBySpell(
    'freezingTrap',
    this.interruptsTab,
    spells.freezingTrap
  );

  public readonly intimidation = new MyInterruptBySpell(
    'intimidation',
    this.interruptsTab,
    spells.intimidation
  );

  // mechanics

  public readonly tranquilizingShot = new MyCheckBoxBySpell(
    'tranquilizingShot',
    this.mechanicsClassTab,
    spells.tranquilizingShot,
    `Use ${spells.tranquilizingShot['name']} on enemies with buff`
  );

  /*
  public readonly tranquilizingShotDelay = new MyDelay(
    'tranquilizingShotDelay',
    this.mechanicsClassTab,
    spells.tranquilizingShot['name']
  );
  */

  public readonly spiteful = new MyCheckBox(
    'spiteful',
    this.mechanicsClassTab,
    `${awful.textureEscape(135945, 20, '4:13')} - Spiteful`,
    'Use Binding Shot & Tar Trap on Spiteful shades'
  );

  public readonly misdirection = new MisdirectionMode(
    'misdirection',
    this.mechanicsClassTab
  );

  // Explosives

  private readonly explosivesTab = this.mechanicsGroup.Tab('Explosives');

  public readonly explosives = new MyCheckBox(
    'explosives',
    this.explosivesTab,
    'Handle Explosives',
    'Toggle for explosives handling'
  );

  public readonly explosivesMinCast = new MySlider(
    'explosivesMinCast',
    this.explosivesTab,
    'Min Cast % for Explosives',
    {
      tooltip: 'Minimum cast % to handle an explosive',
      min: 0,
      max: 100,
      defaultValue: 40,
      step: 1,
    }
  );

  public readonly explsivesDelay = new MySlider(
    'explosivesDelay',
    this.explosivesTab,
    'Explosives Delay',
    {
      tooltip: 'Delay to wait before killing another explosive',
      min: 0,
      max: 5,
      defaultValue: 2,
      valueType: 'sec',
      step: 0.1,
    }
  );

  public readonly explosivesBypassCast = new MyCheckBox(
    'exploivesBypassCast',
    this.explosivesTab,
    'Bypass if about to explode',
    'Bypass delay if explosives are about to explode'
  );

  public readonly explosivesBypassCount = new MyCheckBox(
    'explosivesBypassCount',
    this.explosivesTab,
    'Bypass depending on count',
    'Bypass delay if explosives number exceeds the count'
  );

  public readonly explosivesBypassCountNumber = new MySlider(
    'explosivesBypassCountNumber',
    this.explosivesTab,
    'Max Explosives Count',
    {
      tooltip: 'Number of explosives to bypass delay',
      min: 0,
      max: 6,
      defaultValue: 4,
      step: 1,
    }
  );

  // Pet

  private readonly petTab = awfulGui.Tab('Pet');

  public readonly summonRevive = new MyCheckBox(
    'summonRevive',
    this.petTab,
    'Summon / Revive Pet',
    'Automaticly summon or revive pet.'
  );

  public readonly loneWolf = new MyCheckBox(
    'loneWolf',
    this.petTab,
    'Lone Wolf',
    'Automaticly disable pet when playing MM with Lone Wolf talent.'
  );

  public readonly mendPet = new MyPetDefensive(
    'mendPet',
    this.petTab,
    'Mend Pet',
    40
  );

  // Draws

  private readonly drawPetTab = this.drawGroup.Tab('Draw Pet');

  public readonly drawPetLine = new MyCheckBox(
    'drawPetLine',
    this.drawPetTab,
    'Draw pet line',
    'Draws a line to your pet.'
  );

  public readonly petLineColor = new MyColorPicker(
    'petLineColor',
    this.drawPetTab,
    'Pet line',
    {
      defaultColor: 'olive',
    }
  );

  constructor() {
    super('Hunter');
  }
}

export const hunterGui = new HunterGui();

class HunterStatusFrame {
  public readonly hunterPet = new HunterPet();
}

export const hunterStatusFrame = new HunterStatusFrame();

export const disengageTrigger = new MyTrigger();

awfulCmd.New((msg: string) => {
  switch (msg) {
    case 'forward':
      disengageTrigger.trigger();
      break;

    default:
      break;
  }
});
