import { timeLine } from '../base/bigWigs';
import { myCache } from '../base/cache';
import { generalGui, statusFrame } from '../base/gui';
import { selectNewTarget, useTrinkets } from '../base/rotation';
import * as baseSpells from '../base/spells';
import { hunterGui } from './gui';
import {
  fourthyFightableLosFacing,
  HunterBuffs,
  HunterTalents,
  modeParams,
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

const trickshots = (): void => {
  // 1 - actions.trickshots=steady_shot,if=talent.steady_focus&steady_focus_count&buff.steady_focus.remains<8
  hunterSpells.steadyShot('mm.steadyShot.trickshots.1');

  // 1 - actions.trickshots+=/kill_shot,if=buff.razor_fragments.up
  hunterSpells.killShot('mm.killShot.trickshots.1');

  // 0 - actions.trickshots+=/explosive_shot
  hunterSpells.explosiveShot();

  // 0 - actions.trickshots+=/death_chakram
  hunterSpells.deathChakram();

  // 0 - actions.trickshots+=/stampede
  hunterSpells.stampede();

  // 0 - actions.trickshots+=/wailing_arrow
  hunterSpells.wailingArrow();

  // 1 - actions.trickshots+=/serpent_sting,target_if=min:dot.serpent_sting.remains,if=refreshable&talent.hydras_bite&!talent.serpentstalkers_trickery
  hunterSpells.serpentSting('mm.serpentSting.trickshots.1');

  // 0 - actions.trickshots+=/barrage,if=active_enemies>7

  //OWN
  hunterSpells.salvo('mm.salvo.trickshots.1');

  // 0 - actions.trickshots+=/volley
  hunterSpells.volley();

  // 0 - actions.trickshots+=/trueshot
  hunterSpells.trueshot();

  // 1 - actions.trickshots+=/rapid_fire,if=buff.trick_shots.remains>=execute_time&talent.surging_shots
  hunterSpells.rapidFire('mm.rapidFire.trickshots.1');

  // For Serpentstalker's Trickery, target the lowest remaining Serpent Sting. Generally only cast if it would cleave with Trick Shots. Don't overwrite Precise Shots unless Trueshot is up or Aimed Shot would cap otherwise.
  // 1 - actions.trickshots+=/aimed_shot,target_if=min:dot.serpent_sting.remains+action.serpent_sting.in_flight_to_target*99,if=talent.serpentstalkers_trickery&(buff.trick_shots.remains>=execute_time&(buff.precise_shots.down|buff.trueshot.up|full_recharge_time<cast_time+gcd))
  hunterSpells.aimedShot('mm.aimedShot.trickshots.1');

  // For no Serpentstalker's Trickery, target the highest Latent Poison stack. Same general rules as the previous line.
  // 2 - actions.trickshots+=/aimed_shot,target_if=max:debuff.latent_poison.stack,if=(buff.trick_shots.remains>=execute_time&(buff.precise_shots.down|buff.trueshot.up|full_recharge_time<cast_time+gcd))
  hunterSpells.aimedShot('mm.aimedShot.trickshots.2');

  // 2 - actions.trickshots+=/rapid_fire,if=buff.trick_shots.remains>=execute_time
  hunterSpells.rapidFire('mm.rapidFire.trickshots.2');

  // 1 - actions.trickshots+=/chimaera_shot,if=buff.trick_shots.up&buff.precise_shots.up&focus>cost+action.aimed_shot.cost&active_enemies<4
  hunterSpells.chimaeraShot('mm.chimaeraShot.trickshots.1');

  //OWN
  hunterSpells.salvo();

  // actions.trickshots+=/multishot,if=buff.trick_shots.down|(buff.precise_shots.up|buff.bulletstorm.stack=10)&focus>cost+action.aimed_shot.cost
  hunterSpells.multiShotMM('mm.multiShot.trickshots.1');

  // Only use baseline Serpent Sting as a filler in cleave if it's the only source of applying Latent Poison.
  // 2 - actions.trickshots+=/serpent_sting,target_if=min:dot.serpent_sting.remains,if=refreshable&talent.poison_injection&!talent.serpentstalkers_trickery
  hunterSpells.serpentSting('mm.serpentSting.trickshots.2');

  // 0 - actions.trickshots+=/steel_trap,if=buff.trueshot.down
  hunterSpells.steelTrap('mm.steelTrap.trickshots.1');

  // 2 - actions.trickshots+=/kill_shot,if=focus>cost+action.aimed_shot.cost
  hunterSpells.killShot('mm.killShot.trickshots.2');

  // 2 - actions.trickshots+=/multishot,if=focus>cost+action.aimed_shot.cost
  hunterSpells.multiShotMM('mm.multiShot.trickshots.2');

  // actions.trickshots+=/bag_of_tricks,if=buff.trueshot.down
  baseSpells.bagOfTricks();

  // 0 - actions.trickshots+=/steady_shot
  hunterSpells.steadyShot();
};

const st = (): void => {
  // 1 - actions.st=steady_shot,if=talent.steady_focus&(steady_focus_count&buff.steady_focus.remains<5|buff.steady_focus.down&!buff.trueshot.up)
  hunterSpells.steadyShot('mm.steadyShot.st.1');

  // 0 - actions.st+=/kill_shot
  hunterSpells.killShot();

  // 1 - actions.st+=/volley,if=buff.salvo.up
  hunterSpells.volley('mm.volley.st.1');

  // 1 - actions.st+=/steel_trap,if=buff.trueshot.down
  hunterSpells.steelTrap('mm.steelTrap.st.1');

  // 1 - actions.st+=/serpent_sting,target_if=min:dot.serpent_sting.remains,if=refreshable&!talent.serpentstalkers_trickery&buff.trueshot.down
  hunterSpells.serpentSting('mm.serpentSting.st.1');

  // 0 - actions.st+=/explosive_shot
  hunterSpells.explosiveShot();

  // 0 - actions.st+=/stampede
  hunterSpells.stampede();

  // 0 - actions.st+=/death_chakram
  hunterSpells.deathChakram();

  // 1 - actions.st+=/wailing_arrow,if=active_enemies>1
  hunterSpells.wailingArrow('mm.wailingArrow.st.1');

  hunterSpells.salvo('mm.salvo.st.1');

  //  0 - actions.st+=/volley
  hunterSpells.volley();

  // With at least Streamline, Double Tap Rapid Fire unless Careful Aim is active.
  // 1 - actions.st+=/rapid_fire,if=talent.surging_shots
  hunterSpells.rapidFire('mm.rapidFire.st.1');

  hunterSpells.salvo();

  // 0 - actions.st+=/trueshot,if=variable.trueshot_ready
  hunterSpells.trueshot();

  // Trigger Trick Shots from Bombardment if it isn't already up, or trigger Salvo if Volley isn't being used to trigger it.
  // 1 - actions.st+=/multishot,if=buff.bombardment.up&buff.trick_shots.down&active_enemies>1|talent.salvo&buff.salvo.down&!talent.volley
  hunterSpells.multiShotMM('mm.multiShot.st.1');

  // With Serpentstalker's Trickery target the lowest remaining Serpent Sting. Without Chimaera Shot don't overwrite Precise Shots unless either Trueshot is active or Aimed Shot would cap before its next cast. On two targets with Chimaera Shot don't overwrite Precise Shots unless the target is within Careful Aim range in addition to either Trueshot being active or Aimed Shot capping before its next cast. Overwrite freely if it can cleave.
  // 1 - actions.st+=/aimed_shot,target_if=min:dot.serpent_sting.remains+action.serpent_sting.in_flight_to_target*99,if=talent.serpentstalkers_trickery&(buff.precise_shots.down|(buff.trueshot.up|full_recharge_time<gcd+cast_time)&(!talent.chimaera_shot|active_enemies<2|ca_active)|buff.trick_shots.remains>execute_time&active_enemies>1)
  hunterSpells.aimedShot('mm.aimedShot.st.1');

  // Without Serpentstalker's Trickery, target the highest Latent Poison stack. Same rules as the previous line.
  // 2 - actions.st+=/aimed_shot,target_if=max:debuff.latent_poison.stack,if=buff.precise_shots.down|(buff.trueshot.up|full_recharge_time<gcd+cast_time)&(!talent.chimaera_shot|active_enemies<2|ca_active)|buff.trick_shots.remains>execute_time&active_enemies>1
  hunterSpells.aimedShot('mm.aimedShot.st.2');

  // Refresh Steady Focus if it would run out while refreshing it.
  // 2 - actions.st+=/steady_shot,if=talent.steady_focus&buff.steady_focus.remains<execute_time*2
  hunterSpells.steadyShot('mm.steadyShot.st.2');

  // 0 - actions.st+=/rapid_fire
  hunterSpells.rapidFire();

  // 2 - actions.st+=/wailing_arrow,if=buff.trueshot.down
  hunterSpells.wailingArrow('mm.wailingArrow.st.2');

  // 1 - actions.st+=/chimaera_shot,if=buff.precise_shots.up|focus>cost+action.aimed_shot.cost
  hunterSpells.chimaeraShot('mm.chimaeraShot.st.1');

  // 1 - actions.st+=/arcane_shot,if=buff.precise_shots.up|focus>cost+action.aimed_shot.cost
  hunterSpells.arcaneShot('mm.arcaneShot.st.1');

  // actions.st+=/bag_of_tricks,if=buff.trueshot.down
  baseSpells.bagOfTricks();

  // 0 - actions.st+=/steady_shot
  hunterSpells.steadyShot();
};

const opener = (enemies: number): void => {
  const player = awful.player;
  const pulltimer = timeLine.pullTimer();

  if (pulltimer === 0) return;

  // actions.precombat+=/salvo,precast_time=10
  if (pulltimer <= 10) hunterSpells.salvo();

  if (
    hunterGui.aimedShot.enabled() &&
    enemies < 3 &&
    (!player.hasTalent(HunterTalents.volley) || enemies < 2)
  ) {
    if (pulltimer <= hunterSpells.aimedShot.castTime + awful.buffer)
      hunterSpells.aimedShot();
  } else if (
    hunterGui.wailingArrow.enabled() &&
    (enemies > 2 || !player.hasTalent(HunterTalents.steadyFocus))
  ) {
    if (pulltimer <= hunterSpells.wailingArrow.castTime + awful.buffer)
      hunterSpells.wailingArrow();
  } else {
    if (pulltimer <= hunterSpells.steadyShot.castTime + awful.buffer)
      hunterSpells.steadyShot();
  }
};

let waiter = 0;

const mm = (): void => {
  const player = awful.player;
  const target = awful.target;

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
    enemiesAround < 3 ||
    !player.hasTalent(HunterTalents.trickShots);

  opener(enemiesAround);

  if (!player.combat && !target.combat && !generalGui.startCombat.enabled())
    return;

  StartAttack();

  useTrinkets(hunterGui);

  cdsRotation();

  if (isST) {
    st();
  } else {
    trickshots();
  }
};

ponche.hunter.marksmanship = awful.Actor.New({
  spec: AwfulSpecs.Second,
  class: AwfulClasses.hunter,
});

ponche.hunter.marksmanship.Init(() => {
  mm();
});
