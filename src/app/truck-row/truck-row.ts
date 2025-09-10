import {Component, computed, inject, Input, Signal} from '@angular/core';
import {Locker, LockerService, Truck} from "../locker-service";
import {ParcelRow} from '../parcel-row/parcel-row';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-truck-row',
  imports: [
    ParcelRow,
    CurrencyPipe
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
    let l: Locker | null = this.lockerService.getLockerOfTruck(this.truck);

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
    const basePrice = 2
    return Math.round(basePrice * Math.pow(1.4, this.truck.slot-1));
  }

  newTruckSlot() {
    const price = this.newSlotPrice()
    if (this.moneyService.getOwned() < price)
      return
    this.moneyService.remove(price)
    this.truck.slot++;
  }
}
