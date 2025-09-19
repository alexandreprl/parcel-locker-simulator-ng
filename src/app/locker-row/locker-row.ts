import {Component, inject, Input} from '@angular/core';
import {colors, Locker, LockerService} from '../locker-service';
import {ParcelRow} from '../parcel-row/parcel-row';
import {TruckRow} from '../truck-row/truck-row';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe, UpperCasePipe} from '@angular/common';
import {reduceTruckPrice} from '../service/upgrades';
import {UiService} from '../service/ui-service';

@Component({
  selector: 'app-locker-row',
  imports: [
    ParcelRow,
    TruckRow,
    CurrencyPipe,
    UpperCasePipe,
  ],
  templateUrl: './locker-row.html',
  styleUrl: './locker-row.css'
})
export class LockerRow {
  @Input() locker!: Locker;
  private moneyService = inject(MoneyService)
  private lockerService = inject(LockerService);
  uiService = inject(UiService)

  constructor() {

  }

  newSlotPrice() {
    const basePrice = 1
    return Math.round(basePrice * Math.pow(1.4, this.locker.slot - 1));
  }

  newLockerSlot() {
    const price = this.newSlotPrice()
    if (this.moneyService.getOwned() < price)
      return
    this.moneyService.remove(price)
    this.locker.slot++;
  }

  newTruckPrice() {
    let basePrice = 3

    let price = Math.round(basePrice * Math.pow(1.4, this.lockerService.getAllTrucks().length - 1));
    if (reduceTruckPrice.enabled)
      price = Math.round(0.7 * price)
    return price
  }

  addTruck() {
    const price = this.newTruckPrice()
    if (this.moneyService.getOwned() < price)
      return;
    this.moneyService.remove(price);
    this.lockerService.addTruck({
      position: this.locker.position,
      color: colors[Math.floor(Math.random() * colors.length)],
      id: this.lockerService.popNewTruckId(),
      parcels: [],
      slot: 3
    }, this.locker);
  }
}
