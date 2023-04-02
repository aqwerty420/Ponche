import { myCache } from './cache';

class InterruptsHistory {
  private history: {
    [key: string]: {
      time: number;
      delay: number;
    };
  } = {};

  public recentlyHandled(unit: IAwfulUnit): boolean {
    const guid = unit.id;
    const unitHistory = this.history[guid];

    if (unitHistory === undefined) return false;

    const delay = unitHistory.delay;
    const elapsedTime = awful.time - unitHistory.time;

    return elapsedTime > 0.2 && elapsedTime < delay;
  }

  public set(unit: IAwfulUnit, delay = 2.5): void {
    const guid = unit.id;

    this.history[guid] = {
      time: awful.time,
      delay: delay,
    };
  }
}

export const interruptsHistory = new InterruptsHistory();

type MechanicCallback = (unit: IAwfulUnit) => boolean;

class Mechanic {
  private readonly spells: IAwfulSpell[];
  private readonly check: MechanicCallback;
  private lastHandle = 0;

  constructor(spells: IAwfulSpell[], check: MechanicCallback) {
    this.spells = spells;
    this.check = check;
  }

  public handle(unit?: IAwfulUnit): void {
    if (unit === undefined) unit = awful.player;

    const elapsedTime = awful.time - this.lastHandle;

    if (elapsedTime < awful.gcd || elapsedTime > 2)
      if (this.lastHandle < awful.time && this.check(unit)) {
        for (const spell of this.spells) {
          if (spell('mechanic', unit)) {
            this.lastHandle = awful.time;
            return;
          }
        }
      }
  }
}

type MechanicsList = { [key: number]: Mechanic[] };

class MechanicsHandler {
  private mechanics: MechanicsList = {};
  private selfMechanics: Mechanic[] = [];

  public run(): void {
    for (const mechanic of this.selfMechanics) {
      mechanic.handle();
    }

    const enemies = myCache.get({
      range: 40,
      affectingCombat: true,
      alive: true,
    });

    for (const enemy of enemies) {
      const enemyMechanics = this.mechanics[enemy.id];
      if (enemyMechanics != undefined) {
        enemyMechanics.forEach((mechanic) => mechanic.handle(enemy));
      }
    }
  }

  public add(
    check: MechanicCallback,
    spells: IAwfulSpell[],
    unitId: number | undefined = undefined
  ): void {
    if (!unitId) {
      this.selfMechanics.push(new Mechanic(spells, check));
      return;
    }

    if (!this.mechanics[unitId]) {
      this.mechanics[unitId] = [];
    }

    this.mechanics[unitId].push(new Mechanic(spells, check));
  }
}

export const mechanicsHandler = new MechanicsHandler();
