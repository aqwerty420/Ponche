import { timeLine } from '../base/bigWigs';
import { myCache } from '../base/cache';
import { generalGui, statusFrame } from '../base/gui';
import { selectNewTarget, useTrinkets } from '../base/rotation';
import { hunterGui } from './gui';
import {
  eightFightable,
  eightFightableFacing,
  fourthyFightableLosFacing,
  HunterBuffs,
} from './lists';
import { hunterMechanics } from './mechanics';
import * as baseSpells from '../base/spells';
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

  // 1 - actions.cds+=/bag_of_tricks,if=cooldown.kill_command.full_recharge_time>gcd
  baseSpells.bagOfTricks('sv.bagOfTricks.cds.1');
};

const cleave = () => {
  // 1 - actions.cleave=wildfire_bomb,if=full_recharge_time<gcd
  hunterSpells.wildfireBomb('sv.wildfireBomb.cleave.1');

  // TODO 1 - actions.cleave+=/death_chakram,if=focus+cast_regen<focus.max
  hunterSpells.deathChakram();

  // 0 - actions.cleave+=/stampede
  hunterSpells.stampede();

  // 0 - actions.cleave+=/coordinated_assault
  hunterSpells.coordinatedAssault();

  // 1 - actions.cleave+=/kill_shot,if=buff.coordinated_assault_empower.up
  hunterSpells.killShotSV('sv.killShot.cleave.1');

  // 0 - actions.cleave+=/explosive_shot
  hunterSpells.explosiveShot();

  // 1 - actions.cleave+=/carve,if=cooldown.wildfire_bomb.full_recharge_time>spell_targets%2
  hunterSpells.carve('sv.carve.cleave.1');

  // 1 - actions.cleave+=/butchery,if=full_recharge_time<gcd
  hunterSpells.butchery('sv.butchery.cleave.1');

  // 2 - actions.cleave+=/wildfire_bomb,if=!dot.wildfire_bomb.ticking
  hunterSpells.wildfireBomb('sv.wildfireBomb.cleave.2');

  // 2 - actions.cleave+=/butchery,if=dot.shrapnel_bomb.ticking&(dot.internal_bleeding.stack<2|dot.shrapnel_bomb.remains<gcd)
  hunterSpells.butchery('sv.butchery.cleave.2');

  // 0 - actions.cleave+=/fury_of_the_eagle
  hunterSpells.furyOfTheEagle();

  // 2 - actions.cleave+=/carve,if=dot.shrapnel_bomb.ticking
  hunterSpells.carve('sv.carve.cleave.2');

  // 1 - actions.cleave+=/flanking_strike,if=focus+cast_regen<focus.max
  hunterSpells.flankingStrike('sv.flankingStrike.cleave.1');

  // 3 - actions.cleave+=/butchery,if=(!next_wi_bomb.shrapnel|!talent.wildfire_infusion)&cooldown.wildfire_bomb.full_recharge_time>spell_targets%2
  hunterSpells.butchery('sv.butchery.cleave.3');

  // 1 - actions.cleave+=/mongoose_bite,target_if=max:debuff.latent_poison.stack,if=debuff.latent_poison.stack>8
  hunterSpells.mongooseBite('sv.mongooseBite.cleave.1');
  hunterSpells.mongooseBiteRanged('sv.mongooseBite.cleave.1');

  // 1 - actions.cleave+=/raptor_strike,target_if=max:debuff.latent_poison.stack,if=debuff.latent_poison.stack>8
  hunterSpells.raptorStrike('sv.raptorStrike.cleave.1');
  hunterSpells.raptorStrikeRanged('sv.raptorStrike.cleave.1');

  // 1 - actions.cleave+=/kill_command,target_if=min:bloodseeker.remains,if=focus+cast_regen<focus.max&full_recharge_time<gcd
  hunterSpells.killCommandSV('sv.killCommand.cleave.1');

  // 0 - actions.cleave+=/carve
  hunterSpells.carve();

  // 2 - actions.cleave+=/kill_shot,if=!buff.coordinated_assault.up
  hunterSpells.killShotSV('sv.killShot.cleave.2');

  // 1 - actions.cleave+=/steel_trap,if=focus+cast_regen<focus.max
  hunterSpells.steelTrap('sv.steelTrap.cleave.1');

  // 1 - actions.cleave+=/serpent_sting,target_if=min:remains,if=refreshable&target.time_to_die>12&(!talent.vipers_venom|talent.hydras_bite)
  hunterSpells.serpentSting('sv.serpentSting.cleave.1');

  // 2 - actions.cleave+=/mongoose_bite,target_if=min:dot.serpent_sting.remains
  hunterSpells.mongooseBite('sv.mongooseBite.cleave.2');
  hunterSpells.mongooseBiteRanged('sv.mongooseBite.cleave.2');

  // 2 - actions.cleave+=/raptor_strike,target_if=min:dot.serpent_sting.remains
  hunterSpells.raptorStrike('sv.raptorStrike.cleave.2');
  hunterSpells.raptorStrikeRanged('sv.raptorStrike.cleave.2');
};

const st = () => {
  // TODO 1 - actions.st=death_chakram,if=focus+cast_regen<focus.max|talent.spearhead&!cooldown.spearhead.remains
  hunterSpells.deathChakram();

  // 1 - actions.st+=/spearhead,if=focus+action.kill_command.cast_regen>focus.max-10&(cooldown.death_chakram.remains|!talent.death_chakram)
  hunterSpells.spearhead('sv.spearhead.st.1');

  // 1 - actions.st+=/kill_shot,if=buff.coordinated_assault_empower.up
  hunterSpells.killShotSV('sv.killShot.st.1');

  // 1 - actions.st+=/kill_command,target_if=min:bloodseeker.remains,if=full_recharge_time<gcd&focus+cast_regen<focus.max&buff.deadly_duo.stack>1
  hunterSpells.killCommandSV('sv.killCommand.st.1');

  // 1 - actions.st+=/mongoose_bite,if=buff.spearhead.remains
  hunterSpells.mongooseBite('sv.mongooseBite.st.1');
  hunterSpells.mongooseBiteRanged('sv.mongooseBite.st.1');

  // 2 - actions.st+=/mongoose_bite,if=active_enemies=1&target.time_to_die<focus%(variable.mb_rs_cost-cast_regen)*gcd|buff.mongoose_fury.up&buff.mongoose_fury.remains<gcd
  hunterSpells.mongooseBite('sv.mongooseBite.st.2');
  hunterSpells.mongooseBiteRanged('sv.mongooseBite.st.2');

  // 2 - actions.st+=/kill_shot,if=!buff.coordinated_assault.up
  hunterSpells.killShotSV('sv.killShot.st.2');

  // 1 - actions.st+=/raptor_strike,if=active_enemies=1&target.time_to_die<focus%(variable.mb_rs_cost-cast_regen)*gcd
  hunterSpells.raptorStrike('sv.raptorStrike.st.1');
  hunterSpells.raptorStrikeRanged('sv.raptorStrike.st.1');

  // 1 - actions.st+=/serpent_sting,target_if=min:remains,if=!dot.serpent_sting.ticking&target.time_to_die>7&!talent.vipers_venom
  hunterSpells.serpentSting('sv.serpentSting.st.1');

  // 3 - actions.st+=/mongoose_bite,if=talent.alpha_predator&buff.mongoose_fury.up&buff.mongoose_fury.remains<focus%(variable.mb_rs_cost-cast_regen)*gcd
  hunterSpells.mongooseBite('sv.mongooseBite.st.3');
  hunterSpells.mongooseBiteRanged('sv.mongooseBite.st.3');

  // 1 - actions.st+=/flanking_strike,if=focus+cast_regen<focus.max
  hunterSpells.flankingStrike('sv.flankingStrike.st.1');

  // 0 - actions.st+=/stampede
  hunterSpells.stampede();

  // ? - actions.st+=/coordinated_assault,if=!talent.coordinated_kill&target.health.pct<20&(!buff.spearhead.remains&cooldown.spearhead.remains|!talent.spearhead)|talent.coordinated_kill&(!buff.spearhead.remains&cooldown.spearhead.remains|!talent.spearhead)
  hunterSpells.coordinatedAssault();

  // 1 - actions.st+=/wildfire_bomb,if=next_wi_bomb.pheromone&!buff.mongoose_fury.up&focus+cast_regen<focus.max-action.kill_command.cast_regen*2|buff.coordinated_assault.up&focus+cast_regen<focus.max&talent.coordinated_kill.rank>1
  hunterSpells.wildfireBomb('sv.wildfireBomb.st.1');

  // 2 - actions.st+=/kill_command,target_if=min:bloodseeker.remains,if=full_recharge_time<gcd&focus+cast_regen<focus.max
  hunterSpells.killCommandSV('sv.killCommand.st.2');

  // 4 - actions.st+=/mongoose_bite,if=dot.shrapnel_bomb.ticking
  hunterSpells.mongooseBite('sv.mongooseBite.st.4');
  hunterSpells.mongooseBiteRanged('sv.mongooseBite.st.4');

  // 2 - actions.st+=/serpent_sting,target_if=min:remains,if=refreshable&!talent.vipers_venom
  hunterSpells.serpentSting('sv.serpentSting.st.2');

  // 2 - actions.st+=/wildfire_bomb,if=full_recharge_time<gcd&!set_bonus.tier29_2pc
  hunterSpells.wildfireBomb('sv.wildfireBomb.st.2');

  // 5 - actions.st+=/mongoose_bite,target_if=max:debuff.latent_poison.stack,if=buff.mongoose_fury.up
  hunterSpells.mongooseBite('sv.mongooseBite.st.5');
  hunterSpells.mongooseBiteRanged('sv.mongooseBite.st.5');

  // 1 - actions.st+=/explosive_shot,if=talent.ranger
  hunterSpells.explosiveShot('sv.explosiveShot.st.1');

  // 3 - actions.st+=/wildfire_bomb,if=full_recharge_time<gcd
  hunterSpells.wildfireBomb('sv.wildfireBomb.st.3');

  // 6 - actions.st+=/mongoose_bite,target_if=max:debuff.latent_poison.stack,if=focus+action.kill_command.cast_regen>focus.max-10
  hunterSpells.mongooseBite('sv.mongooseBite.st.6');
  hunterSpells.mongooseBiteRanged('sv.mongooseBite.st.6');

  // 2 - actions.st+=/raptor_strike,target_if=max:debuff.latent_poison.stack
  hunterSpells.raptorStrike('sv.raptorStrike.st.2');
  hunterSpells.raptorStrikeRanged('sv.raptorStrike.st.2');

  // 0 - actions.st+=/steel_trap
  hunterSpells.steelTrap();

  // 4 - actions.st+=/wildfire_bomb,if=!dot.wildfire_bomb.ticking
  hunterSpells.wildfireBomb('sv.wildfireBomb.st.4');

  // 3 - actions.st+=/kill_command,target_if=min:bloodseeker.remains,if=focus+cast_regen<focus.max
  hunterSpells.killCommandSV('sv.killCommand.st.3');

  // TODO - actions.st+=/coordinated_assault,if=!talent.coordinated_kill&time_to_die>140

  // TODO - actions.st+=/fury_of_the_eagle,interrupt=1
};

const opener = (): void => {
  const pulltimer = timeLine.pullTimer();

  if (pulltimer === 0) return;

  // actions.precombat+=/steel_trap,precast_time=2
  if (pulltimer <= 2) hunterSpells.steelTrap();
};

const survival = () => {
  const player = awful.player;
  const target = awful.target;

  if (
    !player.exists ||
    player.dead ||
    player.mounted ||
    player.channeling ||
    player.buff(HunterBuffs.feignDeath)
  )
    return;

  selectNewTarget(
    player.buff(HunterBuffs.aspectOfTheEagle) != undefined
      ? fourthyFightableLosFacing
      : eightFightableFacing
  );

  if (player.gcdRemains > awful.buffer) return;

  hunterDefensives();

  petManager();

  hunterMechanics();

  misdirectionHandler();

  hunterSpells.tranquilizingShot();

  hunterSpells.muzzle();

  hunterInterrupts();

  if (!target.exists || target.dead || target.friend) return;

  opener();

  if (!player.combat && !target.combat && !generalGui.startCombat.enabled())
    return;

  StartAttack();

  useTrinkets(hunterGui);

  const enemiesAround = myCache.get(eightFightable).length;
  const isST = statusFrame.rotationMode.isST() || enemiesAround < 2;

  cdsRotation();

  if (isST) {
    st();
  } else {
    cleave();
  }
};

ponche.hunter.survival = awful.Actor.New({
  spec: AwfulSpecs.Third,
  class: AwfulClasses.hunter,
});

ponche.hunter.survival.Init(() => {
  survival();
});
