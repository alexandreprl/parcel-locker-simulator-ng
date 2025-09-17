import {Component, inject, Input} from '@angular/core';
import {Upgrade, upgrades} from '../service/upgrades';
import {CurrencyPipe} from '@angular/common';
import {MoneyService} from '../service/money-service';

@Component({
  selector: 'app-upgrade-tree-item',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './upgrade-tree-item.html',
  styleUrl: './upgrade-tree-item.css'
})
export class UpgradeTreeItem {
  @Input() upgrade!: Upgrade;
  private moneyService = inject(MoneyService)

  unlockUpgrade(upgrade: Upgrade) {
    if (upgrade.dependencies.filter(u => !u.enabled).length > 0)
      return;
    const price = upgrade.price;
    if (this.moneyService.getOwned() < price)
      return
    this.moneyService.remove(price)
    upgrade.enabled = true;
  }

  getChildren(): Upgrade[] {
    return upgrades.filter(u => u.dependencies.includes(this.upgrade));
  }

  areDependenciesSatisfied() {

    return this.upgrade.dependencies.filter(u => !u.enabled).length == 0
  }
}
