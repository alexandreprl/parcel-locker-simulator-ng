import {inject, Injectable, signal} from '@angular/core';
import {MoneyService} from './service/money-service';
import * as uuid from 'uuid';

export interface Locker {

  id: number;
  location: string;
  parcels: Parcel[];
  trucks: Truck[];
  slot: number;
}

export interface Parcel {
  id: string;
  destinationLockerId: number
}

export interface Truck {
  progress?: number;
  destination?: Locker;
  id: string;
  parcels: Parcel[];
  slot: number;
}

@Injectable({
  providedIn: 'root'
})
export class LockerService {
  private lockersList = signal<Locker[]>([]);
  private moneyService = inject(MoneyService)
  private onRoadTrucks = signal<Truck[]>([]);
  private time = signal<number>(0);


  getLockersList() {
    return this.lockersList;
  }

  getOnRoadTrucks() {
    return this.onRoadTrucks;
  }

  addLocker(locker: Locker) {
    this.lockersList.update((lockers: Locker[]) => {
      lockers.push(locker);
      return lockers
    });
  }

  fillTruck(truck: Truck) {
    this.lockersList.update((lockers: Locker[]) => {
      for (let i = 0; i < lockers.length; i++) {
        if (lockers[i].trucks.includes(truck)) {
          for (const parcel of lockers[i].parcels) {
            truck.parcels.push(parcel);
          }
          lockers[i].parcels = [];
        }
      }

      return lockers
    });
  }

  emptyTruck(truck: Truck) {

    this.lockersList.update((lockers: Locker[]) => {
      for (let i = 0; i < lockers.length; i++) {
        if (lockers[i].trucks.includes(truck)) {


          for (const parcel of truck.parcels) {
            lockers[i].parcels.push(parcel);
          }
          truck.parcels = [];
        }
      }

      return lockers
    });
  }

  goto(truck: Truck, target: Locker) {
    this.lockersList.update((lockers: Locker[]) => {
      for (let i = 0; i < lockers.length; i++) {
        if (lockers[i].trucks.includes(truck)) {
          lockers[i].trucks = lockers[i].trucks.filter(t => t !== truck);
        }
      }
      truck.destination = target;
      truck.progress = 0;
      this.onRoadTrucks.update((trucks: Truck[]) => {
        trucks.push(truck);
        return trucks;
      });

      return lockers
    })
  }

  getLockerOfTruck(truck: Truck): Locker | null {
    for (const locker of this.lockersList()) {
      if (locker.trucks.includes(truck)) {
        return locker;
      }
    }
    return null;
  }

  isOnRoad(truck: Truck) {
    return this.onRoadTrucks().includes(truck);
  }

  update() {
    this.time.update(time => time + 1)
    this.moveTrucks();
    this.checkSuccessfulParcels()
    this.addNewParcels()
  }

  private moveTrucks() {
    for (const truck of this.onRoadTrucks()) {
      truck.progress = (truck.progress || 0) + 10;
      if (truck.progress >= 100) {
        this.lockersList.update((lockers: Locker[]) => {

          this.onRoadTrucks.update((trucks: Truck[]) => {
            return trucks.filter(t => t.id != truck.id);
          });
          truck.destination?.trucks.push(truck);

          return lockers
        })

      }
    }
  }

  transfer(parcel: Parcel) {
    const locker = this.getLockerOfParcel(parcel);
    const truck = this.getTruckOfParcel(parcel);
    const lockerTruck = truck != undefined ? this.getLockerOfTruck(truck) : undefined
    if (locker != undefined && locker.trucks.length > 0 && locker.trucks[0].parcels.length < locker.trucks[0].slot) {
      const truck = locker.trucks[0];
      truck.parcels.push(parcel);
      locker.parcels = locker.parcels.filter(p => p != parcel);
    } else if (truck != undefined && lockerTruck != undefined && lockerTruck.parcels.length < lockerTruck.slot) {
      truck.parcels = truck.parcels.filter(p => p != parcel);
      lockerTruck.parcels.push(parcel);
    }
  }

  getLockerOfParcel(parcel: Parcel) {
    for (const l of this.lockersList()) {
      if (l.parcels.includes(parcel)) {
        return l;
      }
    }
    return undefined;
  }

  private getTruckOfParcel(parcel: Parcel) {
    for (const truck of this.getAllTrucks()) {
      if (truck.parcels.includes(parcel)) {
        return truck;
      }
    }
    return undefined;
  }

  isParkedTruck(truck: Truck) {
    const locker = this.getLockerOfTruck(truck);
    if (locker == undefined) {
      return false
    }
    return locker.trucks.indexOf(truck) == 0;
  }

  parkTruck(truck: Truck) {
    const locker = this.getLockerOfTruck(truck);
    if (locker == undefined)
      return;
    locker.trucks = locker.trucks.filter(t => t != truck);
    locker.trucks.unshift(truck);
    // this.lockersList.update((value)=>value)
  }

  private checkSuccessfulParcels() {
    for (const locker of this.lockersList()) {
      for (const parcel of locker.parcels) {
        if (parcel.destinationLockerId == locker.id && Math.random() * 24 < 1) {
          this.moneyService.add(1)
          locker.parcels = locker.parcels.filter(p => p != parcel);
        }
      }
    }
  }

  private addNewParcels() {
    this.lockersList.update((lockersList: Locker[]) => {
      for (const locker of lockersList) {
        let maxNewParcelForLocker = locker.slot - locker.parcels.length;

        while (maxNewParcelForLocker > 0) {
          if (Math.random() * 24 < 1) {
            const newParcel = {
              id: uuid.v4(),
              destinationLockerId: this.getRandomLockerExcept(locker).id,
            }
            locker.parcels.push(newParcel)
          }
          maxNewParcelForLocker--;
        }
      }
      return lockersList;
    })
  }

  private getRandomLockerExcept(locker: Locker) {
    const ll = this.lockersList()
    let l = this.lockersList()[0]
    do {
      l = ll[Math.floor(Math.random() * ll.length)]
    } while (l == locker);
    return l
  }

  getDestinationOfParcel(parcel: Parcel) {
    for (const locker of this.lockersList()) {
      if (locker.id == parcel.destinationLockerId) {
        return locker
      }
    }
    return undefined
  }

  addTruck(truck: Truck) {
    this.lockersList.update(ll => {
      if (ll.length > 0)
        ll[0].trucks.push(truck)
      return ll
    })
  }

  getOnRoadTrucksOfParcel(parcel: Parcel) {
    for (const truck of this.onRoadTrucks()) {
      if (truck.parcels.includes(parcel)) {
        return truck;
      }
    }
    return undefined
  }

  getAllTrucks() {
    const trucks: Truck[] = []
    for (const t of this.onRoadTrucks()) {
      trucks.push(t);
    }
    for (const l of this.lockersList()) {
      for (const truck of l.trucks) {
        trucks.push(truck);
      }
    }
    return trucks
  }
}
