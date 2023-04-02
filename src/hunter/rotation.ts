import {
  baseDefensives,
  fightTracker,
  globalDraws,
  playerHasAggro,
} from '../base/rotation';
import { disengageTrigger, hunterGui, hunterStatusFrame } from './gui';
import * as hunterSpells from './spells';
import { HunterTalents } from './lists';
import { disengageForwardInfos, petStatus } from './callbacks';

const callPet = (): void => {
  const player = awful.player;
  const pet = awful.pet;

  if (
    hunterStatusFrame.hunterPet.disabled() ||
    !hunterGui.summonRevive.enabled() ||
    (hunterGui.loneWolf.enabled() &&
      player.hasTalent(HunterTalents.loneWolf)) ||
    pet.exists ||
    petStatus.triedPetCall
  )
    return;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  hunterSpells[`callPet${hunterStatusFrame.hunterPet.value()}`]();
};

export const petManager = (): void => {
  hunterSpells.mendRevivePet('revive');

  callPet();

  hunterSpells.mendRevivePet('mend');
};

export const hunterDefensives = (): void => {
  const player = awful.player;

  if (!player.combat) return;

  hunterSpells.survivalOfTheFittest();
  hunterSpells.fortitudeOfTheBear();

  baseDefensives(hunterGui);

  hunterSpells.exhilaration();

  hunterSpells.aspectOfTheTurtle();
};

export const hunterInterrupts = (): void => {
  hunterSpells.freezingTrap();
  hunterSpells.intimidation();
};

const disengageForward = (): void => {
  const player = awful.player;

  if (!disengageTrigger.enabled()) {
    if (
      disengageForwardInfos.playerRotation != undefined &&
      disengageForwardInfos.inverseTime < awful.time
    ) {
      player.face(disengageForwardInfos.playerRotation);
      disengageForwardInfos.playerRotation = undefined;
    }
    return;
  }

  if (disengageForwardInfos.playerRotation === undefined) {
    disengageForwardInfos.playerRotation = player.rotation;
    player.face(awful.inverse(disengageForwardInfos.playerRotation));
    disengageForwardInfos.inverseTime = awful.time + 0.05;
  }

  hunterSpells.disengage('forward');
};

awful.addUpdateCallback(disengageForward);

export const misdirectionHandler = (): void => {
  if (!awful.player.combat) return;

  if (hunterGui.misdirection.always()) {
    hunterSpells.misdirection();
    return;
  }

  if (hunterGui.misdirection.onEngage() && fightTracker.fightTime() < 5) {
    hunterSpells.misdirection();
    return;
  }

  if (hunterGui.misdirection.onAggro() && playerHasAggro()) {
    hunterSpells.misdirection();
    return;
  }
};

awful.addUpdateCallback(() => {
  const target = awful.target;

  if (!target.exists) return;
});

const hunterDraws = (draw: IAwfulDrawer): void => {
  const player = awful.player;
  const pet = awful.pet;

  if (!player.exists || player.dead || player.mounted) return;

  const position = player.position();

  if (position == null) return;

  if (hunterGui.drawPetLine.enabled() && pet.exists && !pet.dead) {
    const petPosition = awful.pet.position();

    if (petPosition != null) {
      const petLineColor = hunterGui.petLineColor.get();
      draw.SetColor(
        petLineColor[0],
        petLineColor[1],
        petLineColor[2],
        petLineColor[3]
      );
      draw.Line(
        position[0],
        position[1],
        position[2],
        petPosition[0],
        petPosition[1],
        petPosition[2]
      );
    }
  }
};

const draws = (draw: IAwfulDrawer) => {
  globalDraws(draw, hunterGui, 40, false);
  hunterDraws(draw);
};

awful.Draw(draws);

ponche.hunter = {};
