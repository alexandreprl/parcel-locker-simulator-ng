import {Component, computed, inject, Input} from '@angular/core';
import {Locker, LockerService, Parcel} from "../locker-service";

@Component({
  selector: 'app-parcel-row',
  imports: [],
  templateUrl: './parcel-row.html',
  styleUrl: './parcel-row.css'
})
export class ParcelRow {
  @Input() parcel!: Parcel;
  private lockerService = inject(LockerService);
  private destination = computed(() => this.lockerService.getDestinationOfParcel(this.parcel))
  private onDestination = computed(() => {
    return this.lockerService.getLockerOfParcel(this.parcel) == this.getDestination();
  })

  isOnDestination = () => this.onDestination();

  transfer() {
    this.lockerService.transfer(this.parcel)
  }

  getDestination(): Locker | undefined {
    return this.destination()
  }

  getDestinationAsString(): string {
    const d = this.destination()?.location;
    if (d == undefined)
      return '';
    return d;
  }

  isOnRoad() {
    return this.lockerService.getOnRoadTrucksOfParcel(this.parcel) != undefined
  }

  isOnTruckOnDestination() {
    const truckOfParcel = this.lockerService.getTruckOfParcel(this.parcel);
    if (truckOfParcel == undefined)
      return false;
    return this.lockerService.getLockerOfTruck(truckOfParcel) == this.getDestination();
  }
}
