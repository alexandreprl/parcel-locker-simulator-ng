import {Component, computed, inject, Input, Signal} from '@angular/core';
import {Locker, LockerService, Truck} from "../locker-service";
import {ParcelRow} from '../parcel-row/parcel-row';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe, DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-truck-row',
  imports: [
    ParcelRow,
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './truck-row.html',
  styleUrl: './truck-row.css'
})
export class TruckRow {
  private lockerService = inject(LockerService);
  private moneyService = inject(MoneyService)
  @Input() truck!: Truck;


  fillTruck(): void {
    this.lockerService.fillTruck(this.truck)
  }

  getLockersList(): Locker[] {
    let l: Locker | undefined = this.lockerService.getLockerOfTruck(this.truck);

    let ll: Locker[] = this.lockerService.getLockersList()()
    return ll.filter(i => i != l)
  }

  goto(l: Locker) {
    this.lockerService.goto(this.truck, l)
  }

  emptyTruck() {
    this.lockerService.emptyTruck(this.truck)
  }

  isOnRoad() {return this.lockerService.isOnRoad(this.truck);
  }

  isParkedTruck() {
    return this.lockerService.isParkedTruck(this.truck);
  }

  parkTruck() {
    this.lockerService.parkTruck(this.truck)
  }

  newSlotPrice() {
    const basePrice = 1
    return Math.round(basePrice * Math.pow(1.4, this.truck.slot-1));
  }

  newTruckSlot() {
    const price = this.newSlotPrice()
    if (this.moneyService.getOwned() < price)
      return
    this.moneyService.remove(price)
    this.truck.slot++;
  }

  dropContent() {
    this.truck.parcels = []
  }

  deliver() {
    this.lockerService.deliver(this.truck)
  }
}
