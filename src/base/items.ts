export class MyTrinket {
  private slot: number;
  private trinket: IAwfulItem | null;

  constructor(slot: number) {
    this.slot = slot;
    this.trinket = null;
  }

  private canUse(): boolean {
    const [start, , enable] = GetInventoryItemCooldown('player', this.slot);
    return enable === 1 && start === 0;
  }

  public use(ignoreGriefTorche = false): boolean {
    const player = awful.player;

    if (!this.canUse()) return false;

    const itemId = GetInventoryItemID('player', this.slot);
    if (this.trinket == null || this.trinket.id != itemId)
      this.trinket = awful.NewItem(itemId);

    if (this.trinket.casttime > 0 && player.moving) return false;

    if (ignoreGriefTorche == true && itemId == 194308) return false;

    if (this.trinket.Use(awful.target)) return true;

    return this.trinket.Use();
  }
}

export const trinket1 = new MyTrinket(13);
export const trinket2 = new MyTrinket(14);

export const healthStone = awful.NewItem(5512);

export const refreshingHealingPotionOne = awful.NewItem(191378);
export const refreshingHealingPotionTwo = awful.NewItem(191379);
export const refreshingHealingPotionThree = awful.NewItem(191380);

export const elementalPotionOfUltimatePowerOne = awful.NewItem(191381);
export const elementalPotionOfUltimatePowerTwo = awful.NewItem(191382);
export const elementalPotionOfUltimatePowerThree = awful.NewItem(191383);

export const elementalPotionOfPowerOne = awful.NewItem(191387);
export const elementalPotionOfPowerTwo = awful.NewItem(191388);
export const elementalPotionOfPowerThree = awful.NewItem(191389);

export const fleetingElementalPotionOfUltimatePowerOne = awful.NewItem(191912);
export const fleetingElementalPotionOfUltimatePowerTwo = awful.NewItem(191913);
export const fleetingElementalPotionOfUltimatePowerThree =
  awful.NewItem(191914);

export const fleetingElementalPotionOfPowerOne = awful.NewItem(191905);
export const fleetingElementalPotionOfPowerTwo = awful.NewItem(191906);
export const fleetingElementalPotionOfPowerThree = awful.NewItem(191907);
