import { damages, aoeList, magicList } from './lists';

enum BigWigsBars {
  Pull = 'Pull',
}

class BigWigsTimeLine {
  private bars: { [key: string]: IBigWigsAnchorBar } = {};

  constructor() {
    awful.addUpdateCallback(() => {
      this.run();
    }, false);
  }

  public run() {
    this.updateBars();
  }

  private updateBars() {
    if (BigWigsEmphasizeAnchor === undefined) return;

    for (const bar of BigWigsEmphasizeAnchor.bars) {
      if (
        bar.remaining > 0.1 &&
        (this.bars[bar.candyBarLabel.text] === undefined ||
          this.bars[bar.candyBarLabel.text].start != bar.start)
      )
        this.bars[bar.candyBarLabel.text] = bar;
    }

    // Remove old bars
    for (const barName in this.bars) {
      if (this.bars[barName].remaining < 0.1) delete this.bars[barName];
    }
  }

  public pullTimer(): number {
    return this.bars[BigWigsBars.Pull]
      ? this.bars[BigWigsBars.Pull].remaining
      : 0;
  }

  public timeTillDamages(): number | undefined {
    let lowest: number | undefined = undefined;

    for (const barName in this.bars) {
      if (damages.has(barName)) {
        const remaining = this.bars[barName].remaining;
        if (!lowest || remaining < lowest) lowest = remaining;
      }
    }

    return lowest;
  }

  public timeTillAoe(): number | undefined {
    let lowest: number | undefined = undefined;

    for (const barName in this.bars) {
      if (aoeList.has(barName)) {
        const remaining = this.bars[barName].remaining;
        if (!lowest || remaining < lowest) lowest = remaining;
      }
    }

    return lowest;
  }

  public timeTillMagic(): number | undefined {
    let lowest: number | undefined = undefined;

    for (const barName in this.bars) {
      if (magicList.has(barName)) {
        const remaining = this.bars[barName].remaining;
        if (!lowest || remaining < lowest) lowest = remaining;
      }
    }

    return lowest;
  }
}

export const timeLine = new BigWigsTimeLine();
