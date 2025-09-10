import {Component, inject, Input} from '@angular/core';
import {Locker} from '../locker-service';
import {ParcelRow} from '../parcel-row/parcel-row';
import {TruckRow} from '../truck-row/truck-row';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-locker-row',
  imports: [
    ParcelRow,
    TruckRow,
    CurrencyPipe
  ],
  templateUrl: './locker-row.html',
  styleUrl: './locker-row.css'
})
export class LockerRow {
  @Input() locker!: Locker;
  private moneyService = inject(MoneyService)
  constructor() {

  }
  newSlotPrice() {
    const basePrice = 2
    return Math.round(basePrice * Math.pow(1.4, this.locker.slot-1));
  }
  newLockerSlot() {
    const price = this.newSlotPrice()
    if (this.moneyService.getOwned() < price)
      return
    this.moneyService.remove(price)
    this.locker.slot++;
  }
}
