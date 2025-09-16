import {Component, effect, inject, isDevMode} from '@angular/core';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe} from '@angular/common';
import {Locker, LockerService} from '../locker-service';
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

  newWarehousePrice() {
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

  addWarehouse() {
    const price = this.newWarehousePrice()
    if (this.moneyService.getOwned() < price)
      return;

    const newLocker: Locker | undefined = this.lockerService.popAvailableWarehouse()
    if (newLocker == undefined)
      return;
    this.moneyService.remove(price);
    this.lockerService.addLocker(newLocker);
  }

  cheatAddMoney() {
    this.moneyService.add(10000000000)
  }

  automaticModePrice() {
    return this.upgradeService.getAutomaticModePrice();
  }

  allowAutomaticMode() {
    this.upgradeService.unlockAutomaticMode()
  }

  protected readonly isDevMode = isDevMode;

  cheatAddLockers() {
    let locker: Locker | undefined;
    locker = this.lockerService.popAvailableLocker()
    while (locker != undefined) {
      this.lockerService.addLocker(locker);
      locker = this.lockerService.popAvailableLocker()
    }
  }

  newWarehouseAvailable() {
    return this.lockerService.availableWarehousesCount() >0
  }
  newLockerAvailable() {
    return this.lockerService.availableLockersCount() >0

  }
}
