import {Component, effect, inject} from '@angular/core';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe} from '@angular/common';
import {Locker, LockerService, Position} from '../locker-service';
import * as uuid from 'uuid';

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

  newTruckPrice() {
    const basePrice = 3
    return Math.round(basePrice * Math.pow(1.4, this.lockerService.getAllTrucks().length - 1));
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

  addTruck() {
    const price = this.newTruckPrice()
    if (this.moneyService.getOwned() < price)
      return;
    this.moneyService.remove(price);
    this.lockerService.addTruck({
      position: Position.ZERO,
      id: uuid.v4(),
      parcels: [],
      slot: 3
    });
  }

  cheatAddMoney() {
    this.moneyService.add(1000)
  }
}
