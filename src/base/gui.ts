import { refreshingHealingPotionThree, healthStone } from './items';

const green = [170, 211, 114, 1] as AwfulColor;
const white = [255, 255, 255, 1] as AwfulColor;
const dark = [21, 21, 21, 0.45] as AwfulColor;

export const title = 'PROJECT_NAME';

const [awfulGui, awfulSettings, awfulCmd] = awful.UI.New('PROJECT_CMD', {
  title: title,
  show: awful.DevMode,
  colors: {
    title: green,
    primary: white,
    accent: green,
    background: dark,
  },
});

export const myGui = {
  awfulGui: awfulGui,
  awfulSettings: awfulSettings,
  awfulCmd: awfulCmd,
};

export const awfulStatusFrame = awfulGui.StatusFrame({
  fontSize: 6,
  maxWidth: 450,
  colors: {
    background: dark,
  },
});

export class MyText {
  constructor(tab: IAwfulTab, label: string, header = false) {
    tab.Text({
      text: label,
      header: header,
    });
  }
}

export class MyCheckBox {
  private eVar: string;

  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    tooltip?: string,
    defaultValue = true
  ) {
    this.eVar = eVar;

    tab.Checkbox({
      text: label,
      var: eVar,
      default: defaultValue,
      tooltip: tooltip,
    });
  }

  public enabled(): boolean {
    return awfulSettings.get(this.eVar) as boolean;
  }

  public invert(): void {
    awfulSettings.set(this.eVar, !this.enabled());
  }
}

export class MyCheckBoxBySpell extends MyCheckBox {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    spell: IAwfulSpell,
    tooltip?: string,
    defaultValue?: boolean
  ) {
    super(
      eVar,
      tab,
      `${awful.textureEscape(spell.id, 20, '4:13')} - ${spell['name']}`,
      tooltip,
      defaultValue
    );
  }
}

const interruptsVar = 'interrupts';

export class MyInterrupt extends MyCheckBox {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    tooltip?: string,
    defaultValue?: boolean
  ) {
    super(
      eVar,
      tab,
      label,
      tooltip ?? `Use ${label} to interrupt.`,
      defaultValue
    );
  }

  public enabled(): boolean {
    return super.enabled() && (awfulSettings.get(interruptsVar) as boolean);
  }
}

export class MyInterruptBySpell extends MyInterrupt {
  constructor(eVar: string, tab: IAwfulTab, spell: IAwfulSpell) {
    const name = spell['name'];

    super(
      eVar,
      tab,
      `${awful.textureEscape(spell.id, 20, '4:13')} - ${name}`,
      `Use ${name} to interrupt.`
    );
  }
}

export class MySlider {
  private eVar: string;

  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    optionals?: {
      tooltip?: string;
      min?: number;
      max?: number;
      defaultValue?: number;
      valueType?: string;
      step?: number;
    }
  ) {
    this.eVar = eVar;

    tab.Slider({
      text: label,
      var: eVar,
      tooltip: optionals?.tooltip,
      min: optionals?.min,
      max: optionals?.max,
      step: optionals?.step,
      default: optionals?.defaultValue,
      valueType: optionals?.valueType,
    });
  }

  public value(): number {
    return awfulSettings.get(this.eVar) as number;
  }
}

export class MyDropdown {
  private readonly eVar: string;

  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    options: IAwfulDropdownOptions[],
    optionals?: {
      tooltip?: string;
      placeholder?: string;
      defaultValue?: string | number;
    }
  ) {
    this.eVar = eVar;

    tab.Dropdown({
      header: label,
      var: eVar,
      placeholder: optionals?.placeholder,
      tooltip: optionals?.tooltip,
      options: options,
      default: optionals?.defaultValue,
    });
  }

  public value(): string {
    return awfulSettings.get(this.eVar) as string;
  }
}

export enum CooldownsOptions {
  Always = 'always',
  Toggle = 'toggle',
  MiniToggle = 'miniToggle',
  Never = 'never',
}

export const cdOptions: IAwfulDropdownOptions[] = [
  {
    label: 'Always',
    value: CooldownsOptions.Always,
    tooltip: 'Always use.',
  },
  {
    label: 'On Toggle',
    value: CooldownsOptions.Toggle,
    tooltip: 'Use on cooldowns &/or mini cooldowns toggle.',
  },
  {
    label: 'On Mini Toggle',
    value: CooldownsOptions.MiniToggle,
    tooltip: 'Use on mini cooldowns toggle.',
  },
  {
    label: 'Never',
    value: CooldownsOptions.Never,
    tooltip: 'Never use.',
  },
];

const cdsToggleVar = 'cdsToggle';
const mCdsToggleVar = 'mCdsToggle';
const minTTDVar = 'minTTD';
const minTTDValueVar = 'minTTDValue';

export class MyBaseCooldowns extends MyDropdown {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    tooltip: string,
    defaultValue = cdOptions[1].value
  ) {
    super(eVar, tab, label, cdOptions, {
      tooltip: tooltip,
      defaultValue: defaultValue,
    });
  }

  public enabled(ignoreTTD = false): boolean {
    const value = this.value();

    return (
      (ignoreTTD ||
        (!awfulSettings.get(minTTDVar) as boolean) ||
        awful.FightRemains() > (awfulSettings.get(minTTDValueVar) as number)) &&
      (value == cdOptions[0].value ||
        ((value == cdOptions[1].value || value == cdOptions[2].value) &&
          (awfulSettings.get(cdsToggleVar) as boolean)) ||
        (value == cdOptions[2].value &&
          (awfulSettings.get(mCdsToggleVar) as boolean)))
    );
  }
}

export class MyCooldowns extends MyBaseCooldowns {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    defaultValue?: number | string
  ) {
    super(eVar, tab, label, `${label} usage mode.`, defaultValue);
  }
}

export class MyCooldownsBySpell extends MyBaseCooldowns {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    spell: IAwfulSpell,
    defaultValue?: number | string
  ) {
    const name = spell['name'];

    super(
      eVar,
      tab,
      `${awful.textureEscape(spell.id, 20)} - ${name}`,
      `${name} usage mode.`,
      defaultValue
    );
  }
}

abstract class MyDropdownCheckbox {
  protected checkBox: MyCheckBox;
  protected slider: MySlider;

  constructor(
    eVar: string,
    tab: IAwfulTab,
    label1: string,
    tooltip1: string,
    label2: string,
    tooltip2: string,
    valueType: string,
    defaultValue?: number
  ) {
    this.checkBox = new MyCheckBox(`${eVar}CheckBox`, tab, label1, tooltip1);
    this.slider = new MySlider(`${eVar}Slider`, tab, label2, {
      tooltip: tooltip2,
      min: 0,
      max: 100,
      defaultValue: defaultValue,
      valueType: valueType,
      step: 5,
    });
  }
}

const defensivesToggleVar = 'defensivesToggle';

export class MyBaseDefensive extends MyDropdownCheckbox {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    name: string,
    defaultValue?: number
  ) {
    super(
      eVar,
      tab,
      label,
      `Use ${name} depending on min. HP set.`,
      'Below',
      `Min. hp to use ${name}.`,
      'hp',
      defaultValue
    );
  }

  public canUse(): boolean {
    return (
      (awfulSettings.get(defensivesToggleVar) as boolean) &&
      this.checkBox.enabled() &&
      awful.player.hp <= this.slider.value()
    );
  }
}

export class MyDefensive extends MyBaseDefensive {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    defaultValue?: number
  ) {
    super(eVar, tab, label, label, defaultValue);
  }
}

export class MyDefensiveBySpell extends MyBaseDefensive {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    spell: IAwfulSpell,
    defaultValue?: number
  ) {
    const name = spell['name'];

    super(
      eVar,
      tab,
      `${awful.textureEscape(spell.id, 20, '4:13')}   - ${name}`,
      name,
      defaultValue
    );
  }
}

export class MyDefensiveByItem extends MyBaseDefensive {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    item: IAwfulItem,
    secureName: string,
    defaultValue?: number
  ) {
    // eslint-disable-next-line prefer-const
    let [name, , , , , , , , , texture] = GetItemInfo(item.id);
    if (!name) name = secureName;

    super(
      eVar,
      tab,
      `${awful.textureEscape(texture, 20, '4:13')}   - ${name}`,
      name,
      defaultValue
    );
  }
}

export class MyPetDefensive extends MyDefensive {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    defaultValue?: number
  ) {
    super(eVar, tab, label, defaultValue);
  }

  public canUse(): boolean {
    return this.checkBox.enabled() && awful.pet.hp <= this.slider.value();
  }
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const colors = {
  black: {
    r: 0,
    g: 0,
    b: 0,
  },
  white: {
    r: 255,
    g: 255,
    b: 255,
  },
  red: {
    r: 255,
    g: 0,
    b: 0,
  },
  lime: {
    r: 0,
    g: 255,
    b: 0,
  },
  blue: {
    r: 0,
    g: 0,
    b: 255,
  },
  yellow: {
    r: 255,
    g: 255,
    b: 0,
  },
  cyan: {
    r: 0,
    g: 255,
    b: 255,
  },
  magenta: {
    r: 255,
    g: 0,
    b: 255,
  },
  silver: {
    r: 192,
    g: 192,
    b: 192,
  },
  gray: {
    r: 128,
    g: 128,
    b: 128,
  },
  maroon: {
    r: 128,
    g: 0,
    b: 0,
  },
  olive: {
    r: 128,
    g: 128,
    b: 0,
  },
  green: {
    r: 0,
    g: 128,
    b: 0,
  },
  purple: {
    r: 128,
    g: 0,
    b: 128,
  },
  teal: {
    r: 0,
    g: 128,
    b: 128,
  },
  navy: {
    r: 0,
    g: 0,
    b: 128,
  },
};

const colorOptions = [
  {
    label: 'Black',
    value: 'black',
  },
  {
    label: 'White',
    value: 'white',
  },
  {
    label: 'Red',
    value: 'red',
  },
  {
    label: 'Lime',
    value: 'lime',
  },
  {
    label: 'Blue',
    value: 'blue',
  },
  {
    label: 'Yellow',
    value: 'yellow',
  },
  {
    label: 'Cyan',
    value: 'cyan',
  },
  {
    label: 'Magenta',
    value: 'magenta',
  },
  {
    label: 'Silver',
    value: 'silver',
  },
  {
    label: 'Gray',
    value: 'gray',
  },
  {
    label: 'Maroon',
    value: 'maroon',
  },
  {
    label: 'Olive',
    value: 'olive',
  },
  {
    label: 'Green',
    value: 'green',
  },
  {
    label: 'Purple',
    value: 'purple',
  },
  {
    label: 'Teal',
    value: 'teal',
  },
  {
    label: 'Navy',
    value: 'navy',
  },
];

export class MyRgbSelector extends MyDropdown {
  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    optionals?: { tooltip?: string; defaultValue?: string }
  ) {
    if (optionals == null) {
      optionals = {};
    }
    optionals.defaultValue = optionals.defaultValue ?? colorOptions[0].value;
    super(eVar, tab, label, colorOptions, optionals);
  }

  public getColor(): RgbColor {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return colors[this.value()];
  }
}

const tooltipAlpha = 'The opacity of the element';
const tooltipColor = 'The color of the element';

export class MyColorPicker {
  private readonly color: MyRgbSelector;
  private readonly alpha: MySlider;

  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    optionals?: {
      defaultColor?: string;
      defaultAlpha?: number;
      tooltipColor?: string;
      tooltipAlpha?: string;
    }
  ) {
    this.color = new MyRgbSelector(`${eVar}Rgb`, tab, label + ' color', {
      tooltip: optionals?.tooltipColor ?? tooltipColor,
      defaultValue: optionals?.defaultColor,
    });

    this.alpha = new MySlider(`${eVar}Alpha`, tab, label + ' opacity', {
      tooltip: optionals?.tooltipAlpha ?? tooltipAlpha,
      min: 0,
      max: 255,
      defaultValue: optionals?.defaultAlpha ?? 255,
      step: 5,
    });
  }

  public get(): AwfulColor {
    const color = this.color.getColor();
    const alpha = this.alpha.value();

    return [color.r, color.g, color.b, alpha];
  }
}

export class Opacity {
  private readonly alpha: MySlider;

  constructor(
    eVar: string,
    tab: IAwfulTab,
    label: string,
    optionals?: {
      defaultAlpha?: number;
      tooltipAlpha?: string;
    }
  ) {
    this.alpha = new MySlider(`${eVar}Alpha`, tab, label + ' opacity', {
      tooltip: optionals?.tooltipAlpha ?? tooltipAlpha,
      min: 0,
      max: 255,
      defaultValue: optionals?.defaultAlpha ?? 255,
      step: 5,
    });
  }

  public get(): number {
    const alpha = this.alpha.value();

    return alpha;
  }
}

export class MyMode {
  protected eVar = 'awful.mode';

  constructor() {
    awfulStatusFrame.Toggle({
      label: 'Mode: ',
      var: this.eVar,
      valueText: () => {
        return this.getValueText();
      },
      onClick: () => {
        this.invert();
      },
    });
    if (awfulSettings.get(this.eVar) === null)
      awfulSettings.set(this.eVar, RotationMode.auto);
  }

  private getValueText(): string {
    return '|cffbfff81' + awfulSettings.get(this.eVar);
  }

  public invert(): void {
    if (awfulSettings.get(this.eVar) === RotationMode.st)
      awfulSettings.set(this.eVar, RotationMode.auto);
    else awfulSettings.set(this.eVar, RotationMode.st);
  }

  public isST(): boolean {
    return awfulSettings.get(this.eVar) === RotationMode.st;
  }
}

export class Run {
  constructor() {
    awfulStatusFrame.Toggle({
      label: 'Run: ',
      var: 'Is Running',
      valueText: () => {
        return awful.enabled ? '|cff00ff00ON' : '|cffff0000OFF';
      },
      onClick: () => {
        this.invert();
      },
    });
  }

  private getValueText(): string {
    if (awful.enabled) return 'ON';
    return 'Off';
  }

  public invert(): void {
    awful.enabled = !awful.enabled;
  }
}

export class MyToggle {
  private eVar: string;

  constructor(eVar: string, label: string) {
    this.eVar = eVar;

    awfulStatusFrame.Toggle({
      label: label,
      var: eVar,

      onClick: () => {
        this.invert();
      },

      valueText: () => {
        return (awfulSettings.get(this.eVar) as boolean)
          ? '|cff00ff00ON'
          : '|cffff0000OFF';
      },
    });
  }

  public invert(): void {
    awfulSettings.set(this.eVar, !awfulSettings.get(this.eVar) as boolean);
  }

  public enabled(): boolean {
    return awfulSettings.get(this.eVar) as boolean;
  }
}

abstract class MyCooldownsToggle extends MyToggle {
  private lastCooldowns = 0;
  private disableVar: string;
  private disableAfterVar: string;

  constructor(
    eVar: string,
    disableVar: string,
    disableAfterVar: string,
    label: string
  ) {
    super(eVar, label);
    this.disableVar = disableVar;
    this.disableAfterVar = disableAfterVar;
    awful.addUpdateCallback(() => this.update());
  }

  public invert(): void {
    if (!this.enabled()) {
      this.lastCooldowns = GetTime();
    }
    super.invert();
  }

  private update(): void {
    if (
      this.enabled() &&
      awfulSettings.get(this.disableVar) &&
      GetTime() - this.lastCooldowns >
        (awfulSettings.get(this.disableAfterVar) as number)
    ) {
      super.invert();
    }
  }
}

const cdsDisablerVar = 'cdsAutoDisabler';
const mCdsDisablerVar = 'mCdsAutoDisabler';

const cdsDisableAfterVar = 'cdsDisableAfter';
const mCdsDisableAfterVar = 'mCdsDisableAfter';

class MyCdsToggle extends MyCooldownsToggle {
  constructor() {
    super(cdsToggleVar, cdsDisablerVar, cdsDisableAfterVar, 'Cds: ');
  }
}

class MyMiniCdsToggle extends MyCooldownsToggle {
  constructor() {
    super(mCdsToggleVar, mCdsDisablerVar, mCdsDisableAfterVar, 'M.Cds: ');
  }
}

export class MyTrigger {
  protected enable = false;
  protected timer = 0;

  constructor() {
    awful.addUpdateCallback(() => this.update());
  }

  public enabled(): boolean {
    return this.enable;
  }

  public disable(): void {
    this.enable = false;
  }

  public trigger(): void {
    this.timer = GetTime();
    this.enable = true;
  }

  private update(): void {
    if (this.timer < GetTime() - 1.5) {
      this.enable = false;
    }
  }
}

export class MyDelay {
  private readonly minDelay: MySlider;
  private readonly maxDelay: MySlider;
  private readonly delays: { [min: number]: { [max: number]: IAwfulDelay } } =
    {};

  constructor(eVar: string, tab: IAwfulTab, label: string) {
    this.minDelay = new MySlider(`${eVar}Min`, tab, `${label} min delay`, {
      tooltip: `Minimum delay to ${label}`,
      min: 0,
      max: 2,
      defaultValue: 0.1,
      valueType: 's',
      step: 0.1,
    });

    this.maxDelay = new MySlider(`${eVar}Max`, tab, `${label} max delay`, {
      tooltip: `Maximum delay to ${label}`,
      min: 0,
      max: 2,
      defaultValue: 0.25,
      valueType: 's',
      step: 0.1,
    });
  }

  public getDelay(): number {
    const min = this.minDelay.value();
    const max = this.maxDelay.value();

    if (!this.delays[min]) {
      this.delays[min] = {};
    }

    if (!this.delays[min][max]) {
      this.delays[min][max] = awful.delay(min, max);
    }

    return this.delays[min][max].now;
  }
}

export class ModulableGui {
  // Tabs

  public readonly cooldownsGroup = awfulGui.Group({
    name: 'Cooldowns',
  });

  public readonly defensivesTab = awfulGui.Tab('Defensives');

  public readonly interruptsTab = awfulGui.Tab('Interrupts');

  public readonly mechanicsGroup = awfulGui.Group({
    name: 'Mechanics',
  });

  public readonly drawGroup = awfulGui.Group({
    name: 'Draw',
  });

  // Groups - Cooldowns

  public readonly cooldownsClassTab: IAwfulTab;

  // Groups - Mechanics

  public readonly mechanicsClassTab: IAwfulTab;

  // Groups - Draw

  public readonly drawAttackRangeTab: IAwfulTab;

  public readonly drawTargetTab: IAwfulTab;

  // Elements - Cooldowns - Class

  public readonly racial: MyCooldowns;
  public readonly trinket1: MyCooldowns;
  public readonly trinket2: MyCooldowns;
  public readonly elementalPotionOfUltimatePower: MyCooldowns;
  public readonly elementalPotionOfPower: MyCooldowns;

  public readonly fleetingElementalPotionOfUltimatePower: MyCooldowns;
  public readonly fleetingElementalPotionOfPower: MyCooldowns;

  // Elements - Defensives

  public readonly healthStone: MyDefensive;
  public readonly refreshingHealingPotion: MyDefensive;

  // Elements - Draw - Attack Range

  public readonly drawAttackRange: MyCheckBox;
  public readonly attackRangeInColor: MyColorPicker;
  public readonly attackRangeOutColor: MyColorPicker;
  public readonly playerFilledCircle: MyCheckBox;
  public readonly playerFeetDot: MyCheckBox;
  public readonly playerFeetDotColor: MyColorPicker;

  // Elements - Draw - Target

  public readonly drawTargetAttackRange: MyCheckBox;
  public readonly targetAttackRangeColor: MyColorPicker;
  public readonly targetFilledCircle: MyCheckBox;

  public readonly drawTargetLine: MyCheckBox;

  // OLD

  //public drawCasterAttackRange: MyCheckBox | undefined;
  //public casterAttackRangeInColor: MyColorPicker | undefined;
  //public casterAttackRangeOutColor: MyColorPicker | undefined;

  constructor(className: string) {
    // Tabs

    this.cooldownsClassTab = this.cooldownsGroup.Tab(className);
    this.mechanicsClassTab = this.mechanicsGroup.Tab(className);
    this.drawAttackRangeTab = this.drawGroup.Tab('Attack Range');
    this.drawTargetTab = this.drawGroup.Tab('Target');

    // Elements - Cooldowns - General

    this.racial = new MyCooldowns(
      `${className}Racial`,
      this.cooldownsClassTab,
      'Racial'
    );

    this.trinket1 = new MyCooldowns(
      `${className}Trinket1`,
      this.cooldownsClassTab,
      'Trinket 1'
    );

    this.trinket2 = new MyCooldowns(
      `${className}Trinket2`,
      this.cooldownsClassTab,
      'Trinket 2'
    );

    this.elementalPotionOfUltimatePower = new MyCooldowns(
      `${className}ElementalPotionOfUltimatePower`,
      this.cooldownsClassTab,
      'Elemental Potion Of Ultimate Power'
    );

    this.elementalPotionOfPower = new MyCooldowns(
      `${className}ElementalPotionOfPower`,
      this.cooldownsClassTab,
      'Elemental Potion Of Power'
    );

    this.fleetingElementalPotionOfUltimatePower = new MyCooldowns(
      `${className}FleetingElementalPotionOfUltimatePower`,
      this.cooldownsClassTab,
      'Fleeting Elemental Potion Of Ultimate Power'
    );

    this.fleetingElementalPotionOfPower = new MyCooldowns(
      `${className}FleetingElementalPotionOfPower`,
      this.cooldownsClassTab,
      'Fleeting Elemental Potion Of Power'
    );

    // Elements - Defensives - General

    this.healthStone = new MyDefensiveByItem(
      `${className}HealthStone`,
      this.defensivesTab,
      healthStone,
      'Health Stone',
      30
    );

    this.refreshingHealingPotion = new MyDefensiveByItem(
      `${className}RefreshingHealingPotion`,
      this.defensivesTab,
      refreshingHealingPotionThree,
      'Refreshing Healing Potion',
      40
    );

    // Elements - Draw - Attack Range

    this.drawAttackRange = new MyCheckBox(
      `${className}DrawAttackRange`,
      this.drawAttackRangeTab,
      'Attack range'
    );
    this.playerFilledCircle = new MyCheckBox(
      `${className}PlayerFilledCircle`,
      this.drawAttackRangeTab,
      'Player Filled Circle',
      undefined,
      false
    );
    this.drawAttackRange = new MyCheckBox(
      `${className}DrawAttackRange`,
      this.drawAttackRangeTab,
      'Attack range'
    );
    this.attackRangeInColor = new MyColorPicker(
      `${className}AttackRangeInColor`,
      this.drawAttackRangeTab,
      'In attack range',
      {
        defaultColor: 'lime',
      }
    );
    this.attackRangeOutColor = new MyColorPicker(
      `${className}AttackRangeOutColor`,
      this.drawAttackRangeTab,
      'Out of attack range',
      {
        defaultColor: 'red',
      }
    );

    this.playerFeetDot = new MyCheckBox(
      `${className}PlayerFeetDot`,
      this.drawAttackRangeTab,
      'Player Feet Dot'
    );
    this.playerFeetDotColor = new MyColorPicker(
      `${className}PlayerFeetDotColor`,
      this.drawAttackRangeTab,
      'Player Feet Dot Color',
      {
        defaultColor: 'silver',
      }
    );

    // Elements - Draw - Target

    this.drawTargetAttackRange = new MyCheckBox(
      `${className}DrawTargetAttackRange`,
      this.drawTargetTab,
      'Target circle'
    );
    this.targetFilledCircle = new MyCheckBox(
      `${className}targetFilledCircle`,
      this.drawTargetTab,
      'Target Filled Circle',
      undefined,
      false
    );
    this.drawTargetLine = new MyCheckBox(
      `${className}DrawTargetLine`,
      this.drawTargetTab,
      'Target line'
    );
    this.targetAttackRangeColor = new MyColorPicker(
      `${className}TargetAttackRangeColor`,
      this.drawTargetTab,
      'Target circle/line',
      {
        defaultColor: 'yellow',
      }
    );
  }
}

class GeneralGui {
  private readonly group = awfulGui.Group({
    name: 'General',
  });

  // Combat

  public readonly combat = this.group.Tab('Combat');

  public readonly startCombat = new MyCheckBox(
    'startCombat',
    this.combat,
    'Auto Start Combat',
    'Start combat when an enemy is targeted.'
  );

  public readonly autoSwap = new MyCheckBox(
    'autoSwap',
    this.combat,
    'Auto Swap',
    'Swap to a new target when the current one dies.'
  );

  // Cooldowns

  private readonly cooldowns = this.group.Tab('Cooldowns');

  public readonly minTTD = new MyCheckBox(
    minTTDVar,
    this.cooldowns,
    'Check TTD before Cds',
    'Check units TTD before using cooldowns.',
    false
  );

  public readonly minTTDValue = new MySlider(
    minTTDValueVar,
    this.cooldowns,
    'Min TTD',
    {
      tooltip: 'Min TTD to use cooldowns.',
      min: 0,
      max: 10,
      defaultValue: 5,
      valueType: 'sec',
      step: 0.5,
    }
  );

  public readonly cdsAutoDisabler = new MyCheckBox(
    cdsDisablerVar,
    this.cooldowns,
    'Cooldowns disabler',
    'Turn Off cooldowns automatically after time set.',
    false
  );

  public readonly cdsDisableAfter = new MySlider(
    cdsDisableAfterVar,
    this.cooldowns,
    'Disable after',
    {
      tooltip: 'Automaticly disable cooldowns after time set.',
      min: 5,
      max: 20,
      defaultValue: 5,
      valueType: 'sec',
      step: 1,
    }
  );

  public readonly mCdsAutoDisabler = new MyCheckBox(
    mCdsDisablerVar,
    this.cooldowns,
    'Mini cooldowns disabler',
    'Turn On/Off mini cooldowns automatically after time set.',
    false
  );

  public readonly mCdsDisableAfter = new MySlider(
    mCdsDisableAfterVar,
    this.cooldowns,
    'Disable after',
    {
      tooltip: 'Automaticly disable mini cooldowns after time set.',
      min: 5,
      max: 20,
      defaultValue: 5,
      valueType: 'sec',
      step: 1,
    }
  );

  // Interrupts

  private readonly interrupts = this.group.Tab('Interrupts');

  public readonly whitelist = new MyCheckBox(
    'whitelist',
    this.interrupts,
    'Whitelist',
    'Only interrupt spells from the whitelist.'
  );

  public readonly focus = new MyCheckBox(
    'focus',
    this.interrupts,
    'Focus',
    'Only interrupt focus if enable.',
    false
  );

  public readonly interruptAt = new MySlider(
    'interruptAt',
    this.interrupts,
    'Interrupt at',
    {
      tooltip: 'Min. cast % before interrupting.',
      min: 0,
      max: 100,
      defaultValue: 0,
      valueType: '%',
      step: 5,
    }
  );

  public readonly interrupDelay = new MyDelay(
    'interrupDelay',
    this.interrupts,
    'Interrupt'
  );

  // Others

  public readonly others = this.group.Tab('Others');

  public readonly debug = new MyCheckBox(
    'debug',
    this.others,
    'Debug       ',
    'Show debug messages.',
    false
  );
}

export const generalGui = new GeneralGui();

class StatusFrame {
  public readonly running = new Run();
  public readonly rotationMode = new MyMode();
  public readonly cds = new MyCdsToggle();
  public readonly mCds = new MyMiniCdsToggle();
  public readonly defensives = new MyToggle(defensivesToggleVar, 'Def: ');
  public readonly interrupts = new MyToggle(interruptsVar, 'Int: ');
}

export const statusFrame = new StatusFrame();

class StatusFrameHandler {
  public readonly statusFrameDisabler = new MyCheckBox(
    'statusFrameDisabler',
    generalGui.others,
    'Hide Status frame',
    'Hide the status frame.',
    false
  );

  private statusFrameVisible = true;

  constructor() {
    awful.addUpdateCallback(() => this.update());
  }

  public update(): void {
    if (this.statusFrameVisible && this.statusFrameDisabler.enabled()) {
      awfulStatusFrame.Hide();
      this.statusFrameVisible = !this.statusFrameVisible;
    } else if (
      !this.statusFrameVisible &&
      !this.statusFrameDisabler.enabled()
    ) {
      awfulStatusFrame.Show();
      this.statusFrameVisible = !this.statusFrameVisible;
    }
  }
}

const statusFrameHandler = new StatusFrameHandler();

awfulCmd.New((msg: string) => {
  switch (msg) {
    case 'sf':
      statusFrameHandler.statusFrameDisabler.invert();
      break;

    case 'mode':
      statusFrame.rotationMode.invert();
      break;

    case 'cooldowns':
      statusFrame.cds.invert();
      break;

    case 'miniCooldowns':
      statusFrame.mCds.invert();
      break;

    case 'defensives':
      statusFrame.defensives.invert();
      break;

    case 'interrupts':
      statusFrame.interrupts.invert();
      break;

    default:
      break;
  }
});
