import {Component, inject, Input} from '@angular/core';
import {colors, Locker, LockerService} from '../locker-service';
import {ParcelRow} from '../parcel-row/parcel-row';
import {TruckRow} from '../truck-row/truck-row';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe, DecimalPipe} from '@angular/common';
import {firstWarehousePosition} from '../app';
import * as uuid from 'uuid';

@Component({
  selector: 'app-locker-row',
  imports: [
    ParcelRow,
    TruckRow,
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './locker-row.html',
  styleUrl: './locker-row.css'
})
export class LockerRow {
  @Input() locker!: Locker;
  private moneyService = inject(MoneyService)
  private lockerService = inject(LockerService);
  constructor() {

  }
  newSlotPrice() {
    const basePrice = 1
    return Math.round(basePrice * Math.pow(1.4, this.locker.slot-1));
  }
  newLockerSlot() {
    const price = this.newSlotPrice()
    if (this.moneyService.getOwned() < price)
      return
    this.moneyService.remove(price)
    this.locker.slot++;
  }

  newTruckPrice() {
    const basePrice = 3
    return Math.round(basePrice * Math.pow(1.4, this.lockerService.getAllTrucks().length - 1));
  }

  addTruck() {
    const price = this.newTruckPrice()
    if (this.moneyService.getOwned() < price)
      return;
    this.moneyService.remove(price);
    this.lockerService.addTruck({
      position: this.locker.position,
      color: colors[Math.floor(Math.random() * colors.length)],
      id: uuid.v4(),
      parcels: [],
      slot: 3
    }, this.locker);
  }
}
