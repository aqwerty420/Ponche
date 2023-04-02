import { timeLine } from '../base/bigWigs';
import { myCache } from '../base/cache';
import { generalGui, statusFrame } from '../base/gui';
import { selectNewTarget, useTrinkets } from '../base/rotation';
import { regenRate } from '../base/simc';
import * as baseSpells from '../base/spells';
import { fixKillShotCallback } from './callbacks';
import { hunterGui } from './gui';
import {
  fourthyFightableLosFacing,
  HunterBuffs,
  HunterTalents,
  modeParams,
  PetBuffs,
} from './lists';
import { hunterMechanics } from './mechanics';
import {
  hunterDefensives,
  hunterInterrupts,
  misdirectionHandler,
  petManager,
} from './rotation';
import * as hunterSpells from './spells';

const cdsRotation = (): void => {
  baseSpells.ancestralCall();

  baseSpells.fireblood();

  baseSpells.berserking();

  baseSpells.bloodFury();

  baseSpells.lightsJudgment();
};

const waitForBarbedShot = (): boolean => {
  const pet = awful.pet;

  return (
    pet.exists &&
    !pet.dead &&
    pet.buff(PetBuffs.frenzy) != null &&
    pet.buffRemains(PetBuffs.frenzy) <= awful.gcd + awful.buffer * 2 &&
    pet.buffRemains(PetBuffs.frenzy) >=
      hunterSpells.barbedShot.cd + awful.buffer
  );
};

const aoe = () => {
  const player = awful.player;

  // 1 - actions.cleave=barbed_shot,target_if=max:debuff.latent_poison.stack,if=debuff.latent_poison.stack>9&(pet.main.buff.frenzy.up&pet.main.buff.frenzy.remains<=gcd+0.25|talent.scent_of_blood&cooldown.bestial_wrath.remains<12+gcd|full_recharge_time<gcd&cooldown.bestial_wrath.remains)
  // 1 - bis - actions.cleave+=/barbed_shot,target_if=min:dot.barbed_shot.remains,if=pet.main.buff.frenzy.up&pet.main.buff.frenzy.remains<=gcd+0.25|talent.scent_of_blood&cooldown.bestial_wrath.remains<12+gcd|full_recharge_time<gcd&cooldown.bestial_wrath.remains
  hunterSpells.barbedShot('bm.barbedShot.cleave.1');

  if (waitForBarbedShot()) return;

  // 1 - actions.cleave+=/multishot,if=gcd-pet.main.buff.beast_cleave.remains>0.25
  hunterSpells.multiShotBM('bm.multishot.cleave.1');

  // 1 - actions.cleave+=/kill_command,if=full_recharge_time<gcd&talent.alpha_predator&talent.kill_cleave
  hunterSpells.killCommandBM('bm.killCommand.cleave.1');

  // 0 - actions.cleave+=/call_of_the_wild
  hunterSpells.callOfTheWild();

  // 0 - actions.cleave+=/explosive_shot
  hunterSpells.explosiveShot();

  // 0 - actions.cleave+=/stampede,if=buff.bestial_wrath.up|target.time_to_die<15
  hunterSpells.stampede();

  // 0 - actions.cleave+=/bloodshed
  hunterSpells.bloodshed();

  // 0 - actions.cleave+=/death_chakram
  hunterSpells.deathChakram();

  // 0 - actions.cleave+=/bestial_wrath
  hunterSpells.bestialWrath();

  // 0 - actions.cleave+=/steel_trap
  hunterSpells.steelTrap();

  // 0 - actions.cleave+=/a_murder_of_crows
  hunterSpells.aMurderofCrows();

  // 2 - actions.cleave+=/barbed_shot,target_if=max:debuff.latent_poison.stack,if=debuff.latent_poison.stack>9&(talent.wild_instincts&buff.call_of_the_wild.up|fight_remains<9|talent.wild_call&charges_fractional>1.2)
  // 2 - bis - actions.cleave+=/barbed_shot,target_if=min:dot.barbed_shot.remains,if=talent.wild_instincts&buff.call_of_the_wild.up|fight_remains<9|talent.wild_call&charges_fractional>1.2
  hunterSpells.barbedShot('bm.barbedShot.cleave.2');

  // 0 - actions.cleave+=/kill_command
  hunterSpells.killCommandBM();

  // 0 - actions.cleave+=/dire_beast
  hunterSpells.direBeast();

  // 0 - actions.cleave+=/serpent_sting,target_if=min:remains,if=refreshable&target.time_to_die>duration
  // TODO

  // 1 - actions.cleave+=/barrage,if=pet.main.buff.frenzy.remains>execute_time
  hunterSpells.barrage('bm.barrage.cleave.1');

  // 0 - actions.cleave+=/kill_shot
  //hunterSpells.killShot();
  fixKillShotCallback();

  // 0 - actions.cleave+=/aspect_of_the_wild
  hunterSpells.aspectOfTheWild();

  // 1 - actions.cleave+=/cobra_shot,if=focus.time_to_max<gcd*2|buff.aspect_of_the_wild.up&focus.time_to_max<gcd*4
  hunterSpells.cobraShot('bm.cobraShot.cleave.1');

  // 1 - actions.cleave+=/wailing_arrow,if=pet.main.buff.frenzy.remains>execute_time|fight_remains<5
  hunterSpells.wailingArrow('bm.wailingArrow.cleave.1');

  //actions.cleave+=/bag_of_tricks,if=buff.bestial_wrath.down|target.time_to_die<5
  baseSpells.bagOfTricks();

  //actions.cleave+=/arcane_torrent,if=(focus+focus.regen+30)<focus.max
  if (player.power + regenRate() + 30 < player.powerMax) {
    baseSpells.arcaneTorrent();
  }
};

const st = () => {
  const player = awful.player;

  // 1 - actions.st=barbed_shot,target_if=min:dot.barbed_shot.remains,if=pet.main.buff.frenzy.up&pet.main.buff.frenzy.remains<=gcd+0.25|talent.scent_of_blood&pet.main.buff.frenzy.stack<3&cooldown.bestial_wrath.ready
  hunterSpells.barbedShot('bm.barbedShot.st.1');

  if (waitForBarbedShot()) return;

  // 1 - actions.st+=/kill_command,if=full_recharge_time<gcd&talent.alpha_predator
  hunterSpells.killCommandBM('bm.killCommand.st.1');

  // 0 - actions.st+=/call_of_the_wild
  hunterSpells.callOfTheWild();

  // 0 - actions.st+=/death_chakram
  hunterSpells.deathChakram();

  // 0 - actions.st+=/bloodshed
  hunterSpells.bloodshed();

  // 0 - actions.st+=/stampede
  hunterSpells.stampede();

  // 0 - actions.st+=/a_murder_of_crows
  hunterSpells.aMurderofCrows();

  // 0 - actions.st+=/steel_trap
  hunterSpells.steelTrap();

  // 0 - actions.st+=/explosive_shot
  hunterSpells.explosiveShot();

  // 0 - actions.st+=/bestial_wrath
  hunterSpells.bestialWrath();

  // 0 - actions.st+=/kill_command
  hunterSpells.killCommandBM();

  // 2 - actions.st+=/barbed_shot,target_if=min:dot.barbed_shot.remains,if=talent.wild_instincts&buff.call_of_the_wild.up|talent.wild_call&charges_fractional>1.4|full_recharge_time<gcd&cooldown.bestial_wrath.remains|talent.scent_of_blood&(cooldown.bestial_wrath.remains<12+gcd|full_recharge_time+gcd<8&cooldown.bestial_wrath.remains<24+(8-gcd)+full_recharge_time)|fight_remains<9
  hunterSpells.barbedShot('bm.barbedShot.st.2');

  // 0 - actions.st+=/dire_beast
  hunterSpells.direBeast();

  // 1 - actions.st+=/serpent_sting,target_if=min:remains,if=refreshable&target.time_to_die>duration
  // TODO

  // 0 - actions.st+=/kill_shot
  //hunterSpells.killShot();
  fixKillShotCallback();

  // 0 - actions.st+=/aspect_of_the_wild
  hunterSpells.aspectOfTheWild();

  // 0 - actions.st+=/cobra_shot
  hunterSpells.cobraShot();

  // 1 - actions.st+=/wailing_arrow,if=pet.main.buff.frenzy.remains>execute_time|target.time_to_die<5
  hunterSpells.wailingArrow('bm.wailingArrow.st.1');

  //actions.st+=/bag_of_tricks,if=buff.bestial_wrath.down|target.time_to_die<5
  baseSpells.bagOfTricks();

  //actions.st+=/arcane_pulse,if=buff.bestial_wrath.down|target.time_to_die<5
  // TODO

  //actions.st+=/arcane_torrent,if=(focus+focus.regen+15)<focus.max
  if (player.power + regenRate() + 15 < player.powerMax) {
    baseSpells.arcaneTorrent();
  }
};

const opener = (): void => {
  const pulltimer = timeLine.pullTimer();

  if (pulltimer === 0) return;

  if (pulltimer <= hunterSpells.wailingArrow.castTime + awful.buffer)
    hunterSpells.wailingArrow();
};

let waiter = 0;

const bm = (): void => {
  const player = awful.player;
  const target = awful.target;
  const pet = awful.pet;

  if (
    !player.exists ||
    player.dead ||
    player.mounted ||
    player.buff(HunterBuffs.feignDeath)
  )
    return;

  selectNewTarget(fourthyFightableLosFacing);

  if (player.casting || player.channeling)
    waiter = awful.time + awful.buffer * 2;

  if (player.gcdRemains > awful.buffer || waiter > awful.time) return;

  hunterSpells.barbedShot('refresh');

  if (waitForBarbedShot()) return;

  hunterDefensives();

  petManager();

  hunterMechanics();

  misdirectionHandler();

  hunterSpells.tranquilizingShot();

  hunterSpells.counterShot();

  hunterInterrupts();

  if (!target.exists || target.dead || !player.canAttack(target)) return;

  const enemiesAround = myCache.get(modeParams).length;
  const isST =
    statusFrame.rotationMode.isST() ||
    enemiesAround < 2 ||
    (!player.hasTalent(HunterTalents.beastCleave) && enemiesAround < 3);

  opener();

  if (!player.combat && !target.combat && !generalGui.startCombat.enabled())
    return;

  StartAttack();

  if (player.gcdRemains > awful.buffer || !pet.exists || pet.dead) return;

  if (useTrinkets(hunterGui)) return;

  cdsRotation();

  if (isST) {
    st();
  } else {
    aoe();
  }
};

ponche.hunter.beastMastery = awful.Actor.New({
  spec: AwfulSpecs.First,
  class: AwfulClasses.hunter,
});

ponche.hunter.beastMastery.Init(() => {
  bm();
});
