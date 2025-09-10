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

  isOnDestination() {
    return (this.lockerService.getLockerOfParcel(this.parcel) == this.getDestination())
  }

  isOnRoad() {
    return this.lockerService.getOnRoadTrucksOfParcel(this.parcel) != undefined
  }
}
