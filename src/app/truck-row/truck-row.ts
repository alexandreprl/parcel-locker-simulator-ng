import {Component, inject, Input} from '@angular/core';
import {Locker, LockerService, Truck} from "../locker-service";
import {ParcelRow} from '../parcel-row/parcel-row';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UpgradeService} from '../service/upgrade-service';
import {allowTwoWayDelivery} from '../service/upgrades';

@Component({
  selector: 'app-truck-row',
  imports: [
    ParcelRow,
    CurrencyPipe,
    FormsModule
  ],
  templateUrl: './truck-row.html',
  styleUrl: './truck-row.css'
})
export class TruckRow {
  lockerService = inject(LockerService);
  private moneyService = inject(MoneyService)
  upgradeService = inject(UpgradeService)
  @Input() truck!: Truck;
  automaticMode: boolean = false;
  routeFromId: string = "";
  routeToId: string = "";
  private checkedLockersForward: Locker[] = [];
  private checkedLockersBackward: Locker[] = [];

  ngOnInit(): void {
    this.routeFromId = this.truck.routeFrom?.id ?? "";
    this.routeToId = this.truck.routeTo?.id ?? "";
    this.checkedLockersForward = [...this.truck.parcelTargetsFilterForward ?? []]
    this.checkedLockersBackward = [...this.truck.parcelTargetsFilterBackward ?? []]
  }

  updateAutomaticMode(evt: Event) {
    this.truck.automaticMode = (<HTMLInputElement>evt.target).checked
  }


  fillTruck(): void {
    this.lockerService.fillTruck(this.truck)
  }

  getPotentialDestinationLockersList(): Locker[] {
    let l: Locker | undefined = this.lockerService.getLockerOfTruck(this.truck);

    let ll: Locker[] = this.lockerService.getLockersList()()
    return ll.filter(i => i != l)
  }

  getLockersList(): Locker[] {
    return this.lockerService.getLockersList()()
  }

  goto(l: Locker) {
    this.lockerService.goto(this.truck, l)
  }

  emptyTruck() {
    this.lockerService.emptyTruck(this.truck)
  }

  isOnRoad() {
    return this.lockerService.isOnRoad(this.truck);
  }

  isParkedTruck() {
    return this.lockerService.isParkedTruck(this.truck);
  }

  parkTruck() {
    this.lockerService.parkTruck(this.truck)
  }

  newSlotPrice() {
    const basePrice = 1
    return Math.round(basePrice * Math.pow(1.4, this.truck.slot - 1));
  }

  newTruckSlot() {
    const price = this.newSlotPrice()
    if (this.moneyService.getOwned() < price)
      return
    this.moneyService.remove(price)
    this.truck.slot++;
  }

  activateAutomaticMode() {

    this.truck.routeFrom = this.lockerService.getLockerFromId(this.routeFromId)
    this.truck.routeTo = this.lockerService.getLockerFromId(this.routeToId)
    this.truck.parcelTargetsFilterForward = [...this.checkedLockersForward]
    this.truck.parcelTargetsFilterBackward = [...this.checkedLockersBackward]

    if (this.truck.parcelTargetsFilterForward.length != 0 && this.truck.routeFrom != undefined && this.truck.routeTo != undefined && this.truck.routeTo != this.truck.routeFrom) {
      this.truck.automaticMode = true;
      this.truck.timer = 3;
      this.truck.status = "idle";
    }

  }

  deactivateAutomaticMode() {
    this.truck.automaticMode = false
  }

  protected readonly Math = Math;

  isCheckedForward(l: Locker) {
    return this.checkedLockersForward.includes(l)
  }

  checkForward(l: Locker) {
    if (!this.isCheckedForward(l))
      this.checkedLockersForward.push(l)
    else
      this.checkedLockersForward = this.checkedLockersForward.filter(l => l != l)
  }

  isCheckedBackward(l: Locker) {
    return this.checkedLockersBackward.includes(l)
  }

  checkBackward(l: Locker) {
    if (!this.isCheckedForward(l))
      this.checkedLockersBackward.push(l)
    else
      this.checkedLockersBackward = this.checkedLockersBackward.filter(l => l != l)
  }

  getLockersListExceptWarehouse() {
    return this.getLockersList().filter(l => !l.warehouse)
  }

  protected readonly allowTwoWayDelivery = allowTwoWayDelivery;
}
