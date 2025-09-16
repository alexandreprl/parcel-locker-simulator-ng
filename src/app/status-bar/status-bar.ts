import {Component, effect, inject} from '@angular/core';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe} from '@angular/common';
import {colors, Locker, LockerService, Position} from '../locker-service';
import * as uuid from 'uuid';
import {firstWarehousePosition} from '../app';
import {UpgradeService} from '../service/upgrade-service';


@Component({
  selector: 'app-status-bar',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './status-bar.html',
  styleUrl: './status-bar.css'
})

export class StatusBar {
  private moneyService = inject(MoneyService)
  private lockerService = inject(LockerService)
  protected upgradeService = inject(UpgradeService)
  ownedMoney = 0;

  constructor() {
    effect(() => {
      this.ownedMoney = this.moneyService.getOwned();
    });
  }

  newLockerPrice() {
    const basePrice = 4
    return Math.round(basePrice * Math.pow(1.4, this.lockerService.getLockersList()().length - 2));
  }

  addLocker() {
    const price = this.newLockerPrice()
    if (this.moneyService.getOwned() < price)
      return;

    const newLocker: Locker | undefined = this.lockerService.popAvailableLocker()
    if (newLocker == undefined)
      return;
    this.moneyService.remove(price);
    this.lockerService.addLocker(newLocker);
  }

  cheatAddMoney() {
    this.moneyService.add(1000)
  }

  automaticModePrice() {
    return this.upgradeService.getAutomaticModePrice();
  }

  allowAutomaticMode() {
    this.upgradeService.unlockAutomaticMode()
  }
}
