import {Component, effect, inject} from '@angular/core';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe} from '@angular/common';
import {LockerService} from '../locker-service';
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
    const basePrice = 10
    return Math.round(basePrice * Math.pow(1.4, this.lockerService.getLockersList()().length - 2));
  }

  newTruckPrice() {
    const basePrice = 5
    return Math.round(basePrice * Math.pow(1.4, this.lockerService.getAllTrucks().length - 1));
  }

  addLocker() {
    const price = this.newLockerPrice()
    if (this.moneyService.getOwned() < price)
      return;
    this.moneyService.remove(price);
    const lockersList = this.lockerService.getLockersList()()
    const newId = lockersList.length > 0 ? Math.max(...lockersList.map(l => l.id)) + 1 : 1;
    this.lockerService.addLocker({
      id: newId, location: "test",
      parcels: [],
      trucks: [],
      slot: 1
    });
  }

  addTruck() {
    const price = this.newTruckPrice()
    if (this.moneyService.getOwned() < price)
      return;
    this.moneyService.remove(price);
    this.lockerService.addTruck({
      id: uuid.v4(),
      parcels: [],
      slot: 3
    });
  }
}
