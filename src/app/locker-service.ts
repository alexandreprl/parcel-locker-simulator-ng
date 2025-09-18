import {computed, inject, Injectable, isDevMode, signal} from '@angular/core';
import {MoneyService} from './service/money-service';
import * as uuid from 'uuid';
import {fasterTruck1, reduceAutomaticModeTransferTime, reduceBeforeCollectTime} from './service/upgrades';

export class Position {
  x: number;
  y: number;
  static ZERO: Position = new Position(0, 0);

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString(): string {
    return `${this.x} ${this.y}`;
  }

  directionTo(destination: Position): Position {
    return new Position(destination.x - this.x, destination.y - this.y).normalize();
  }

  normalize(): Position {
    const length = Math.hypot(this.x, this.y); // same as sqrt(x^2 + y^2)
    if (length === 0) {
      return new Position(0, 0); // can't normalize a zero vector
    }
    return new Position(this.x / length, this.y / length);
  }

  distanceTo(other: Position): number {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }

  add(x: number, y: number) {
    return new Position(this.x + x, this.y + y);
  }
}

export interface Locker {

  id: string;
  warehouse?: boolean;
  location: string;
  parcels: Parcel[];
  trucks: Truck[];
  slot: number;
  position: Position;
}

export interface Parcel {
  status?: "waiting for customer" | "collecting";
  id: number;
  origin: Locker,
  destination: Locker,
  timer?: number | 0
}

export interface Truck {
  parcelTargetsFilterForward?: Locker[];
  parcelTargetsFilterBackward?: Locker[];
  automaticMode?: boolean;
  status?: "manual" | "idle" | "on road" | "arrived" | "transferring";
  timer?: number;
  routeFrom?: Locker;
  routeTo?: Locker;
  color: string;
  destination?: Locker;
  id: number;
  parcels: Parcel[];
  slot: number;
  position: Position;
}

export const colors = [
  "#46425e",
  "#15788c",
  "#00b9be",
  "#ffeecc",
  "#ffb0a3",
  "#ff6973"
];

@Injectable({
  providedIn: 'root'
})
export class LockerService {
  private lockersList = signal<Locker[]>([]);
  private moneyService = inject(MoneyService)
  private onRoadTrucks = signal<Truck[]>([]);
  private allTrucks = computed(() => {
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
  })
  private lastParcelId: number = 0;
  private lastTruckId: number = 0;

  getAllTrucks() {
    return this.allTrucks();
  }


  private time = signal<number>(0);
  private availableLockers: Locker[] = [
    {city: "Akikawa", position: new Position(0.79, 0.2)},
    {city: "Minamishi", position: new Position(0.69, 0.26)},
    {city: "Takayama", position: new Position(0.55, 0.08)},
    {city: "Fujisaki", position: new Position(0.05, 0.59)},
    {city: "Harumura", position: new Position(0.64, 0.83)},
    {city: "Yoshihama", position: new Position(0.46, 0.02)},
    {city: "Okutani", position: new Position(0.24, 0.05)},
    {city: "Nishikawa", position: new Position(0.74, 0.4)},
    {city: "Morishima", position: new Position(0.81, 0.56)},
    {city: "Kazehara", position: new Position(0.31, 0.98)},
    {city: "Tsubakida", position: new Position(0.55, 0.52)},
    {city: "Hoshizaki", position: new Position(0.4, 0.6)},
    {city: "Nakayori", position: new Position(0.87, 0.37)},
    {city: "Akimoto", position: new Position(0.80, 0.03)},
    {city: "Tokihama", position: new Position(0.91, 0.48)},
    {city: "Midoriyama", position: new Position(0.57, 0.17)},
    {city: "Shirosaki", position: new Position(0.38, 0.92)},
    {city: "Tanabe", position: new Position(0.48, 0.38)},
    {city: "Uenohara", position: new Position(0.80, 0.95)},
    {city: "Kumizawa", position: new Position(0.20, 0.75)},
    {city: "Hayashida", position: new Position(0.82, 0.09)},
    {city: "Nogizawa", position: new Position(0.42, 0.43)},
    {city: "Sakuragi", position: new Position(0.02, 0.82)},
    {city: "Kawamura", position: new Position(0.01, 0.68)},
    {city: "Isogawa", position: new Position(0.22, 0.92)},
    {city: "Mashiro", position: new Position(0.34, 0.37)},
    {city: "Hinokawa", position: new Position(0.52, 0.99)},
    {city: "Yamashiro", position: new Position(0.88, 0.23)},
    {city: "Oshimori", position: new Position(0.18, 0.46)},
    {city: "Hanazaki", position: new Position(0.08, 0.15)},
    {city: "Takamori", position: new Position(0.33, 0.48)},
    {city: "Shirahata", position: new Position(0.07, 0.9)},
    {city: "Furumori", position: new Position(0.07, 0.08)},
    {city: "Nagisawa", position: new Position(0.43, 0.72)},
    {city: "Okazaki", position: new Position(0.1, 0.97)},
    {city: "Kitano", position: new Position(0.89, 0.16)},
    {city: "Hoshimura", position: new Position(0.19, 0.57)},
    {city: "Arakawa", position: new Position(0.73, 0.15)},
    {city: "Midorikawa", position: new Position(0.55, 0.23)},
    {city: "Aokita", position: new Position(0.52, 0.30)},
    {city: "Shigemura", position: new Position(0.43, 0.21)},
    {city: "Nanahara", position: new Position(0.28, 0.2)},
    {city: "Tokimori", position: new Position(0.15, 0.26)},
    {city: "Haruzawa", position: new Position(0.37, 0.8)},
    {city: "Mizushima", position: new Position(0.67, 0.75)},
    {city: "Yamanobe", position: new Position(0.32, 0.65)},
    {city: "Kanezawa", position: new Position(0.7, 0.99)}
  ].map(({city, position}) => ({
    id: uuid.v4(),
    location: city,
    parcels: [],
    trucks: [],
    slot: 1,
    position,
  })).reverse();

  private availableWarehouses: Locker[] = [
    {city: "Warehouse 2", position: new Position(0.57, 0.63), warehouse: true},
    {city: "Warehouse 3", position: new Position(0.20, 0.82), warehouse: true},
    {city: "Warehouse 4", position: new Position(0.94, 0.29), warehouse: true},
  ].map(({city, position, warehouse}) => ({
    id: uuid.v4(),
    location: city,
    parcels: [],
    trucks: [],
    warehouse: warehouse,
    slot: 1,
    position,
  })).reverse();

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
      let lockerSource = undefined
      for (let i = 0; i < lockers.length; i++) {
        if (lockers[i].trucks.includes(truck)) {
          lockers[i].trucks = lockers[i].trucks.filter(t => t !== truck);
          lockerSource = lockers[i];
        }
      }

      truck.destination = target;
      truck.status = "on road";
      if (lockerSource !== undefined)
        truck.position = lockerSource.position;
      this.onRoadTrucks.update((trucks: Truck[]) => {
        trucks.push(truck);
        return trucks;
      });

      return lockers
    })
  }

  getLockerOfTruck(truck: Truck): Locker | undefined {
    for (const locker of this.lockersList()) {
      if (locker.trucks.includes(truck)) {
        return locker;
      }
    }
    return undefined;
  }

  isOnRoad(truck: Truck) {
    return this.onRoadTrucks().includes(truck);
  }

  transferToFirstTruck(parcel: Parcel) {
    const locker = this.getLockerOfParcel(parcel)
    let truck: Truck | undefined;
    if (locker == undefined) {
      truck = this.getTruckOfParcel(parcel);
    } else if (locker.trucks.length > 0) {
      truck = locker?.trucks[0]

    }
    if (truck == undefined || locker == undefined) {
      return;
    }
    this.tryToTransferFromLockerToTruck(parcel, locker, truck, false)
  }

  getLockerOfParcel(parcel
                    :
                    Parcel
  ) {
    for (const l of this.lockersList()) {
      if (l.parcels.includes(parcel)) {
        return l;
      }
    }
    return undefined;
  }

  public getTruckOfParcel(parcel
                          :
                          Parcel
  ) {
    for (const truck of this.getAllTrucks()) {
      if (truck.parcels.includes(parcel)) {
        return truck;
      }
    }
    return undefined;
  }

  isParkedTruck(truck
                :
                Truck
  ) {
    const locker = this.getLockerOfTruck(truck);
    if (locker == undefined) {
      return false
    }
    return locker.trucks.indexOf(truck) == 0;
  }

  parkTruck(truck
            :
            Truck
  ) {
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
        if (parcel.destination == locker) {
          const timer = (parcel.timer == undefined) ? 0 : parcel.timer;
          if (parcel.status == "waiting for customer") {
            if (timer <= 0) {
              parcel.timer = 10;
              parcel.status = "collecting";
            } else {
              parcel.timer = (parcel.timer ?? 1) - 1;
            }
          } else if (parcel.status == "collecting") {
            if (timer <= 0) {
              const distance = parcel.origin?.position.distanceTo(parcel.destination.position);
              const gain = Math.round(distance == undefined ? 1 : Math.max(1, distance / 0.3))
              this.moneyService.add(gain)
              locker.parcels = locker.parcels.filter(p => p != parcel);
            } else {
              parcel.timer = (parcel.timer ?? 1) - 1;
            }
          }
        }
      }
    }
  }

  private addNewParcels() {
    this.lockersList.update((lockersList: Locker[]) => {
        for (const locker of lockersList) {
          if (!locker.warehouse) {
            let maxNewParcelForLocker = locker.slot - locker.parcels.length;
            // if (locker.trucks.length == 0) {
            while (maxNewParcelForLocker > 0) {
              if (Math.random() * 6 < 0.1) {
                const newParcel = {
                  id: this.popNewParcelId(),
                  origin: locker,
                  destination: this.getRandomLockerExcept(locker),
                }
                locker.parcels.push(newParcel)
              }
              maxNewParcelForLocker--;
            }
            // }
          }
        }
        return lockersList;
      }
    )
  }

  private getRandomLockerExcept(locker
                                :
                                Locker
  ) {
    const ll = this.lockersList()
    let l = this.lockersList()[0]
    do {
      l = ll[Math.floor(Math.random() * ll.length)]
    } while (l == locker || l.warehouse);
    return l
  }

  addTruck(truck
           :
           Truck, locker
           :
           Locker
  ) {
    this.lockersList.update(ll => {
      locker.trucks.push(truck)
      return [...ll]
    })

  }

  getOnRoadTrucksOfParcel(parcel
                          :
                          Parcel
  ) {
    for (const truck of this.onRoadTrucks()) {
      if (truck.parcels.includes(parcel)) {
        return truck;
      }
    }
    return undefined
  }


  popAvailableLocker() {
    return this.availableLockers.pop();
  }

  popAvailableWarehouse() {
    return this.availableWarehouses.pop();
  }

  popNewParcelId() {
    this.lastParcelId++;
    return this.lastParcelId;
  }

  popNewTruckId() {
    this.lastTruckId++;
    return this.lastTruckId;
  }

  update() {
    this.time.update(time => time + 1)
    this.moveTrucks();
    this.checkSuccessfulParcels()
    this.addNewParcels()

    this.updateAutomaticTrucks();
  }

  private moveTrucks() {
    for (const truck of this.onRoadTrucks()) {
      if (truck.destination !== undefined) {
        const dir = truck.position.directionTo(truck.destination.position);
        let speed = 0.002;
        if (isDevMode())
          speed = 0.1;
        if (fasterTruck1.enabled)
          speed *= 2
        truck.position = truck.position.add(dir.x * speed, dir.y * speed);

        if (truck.position.distanceTo(truck.destination.position) < speed) {
          truck.position = truck.destination.position
          this.lockersList.update((lockers: Locker[]) => {

            this.onRoadTrucks.update((trucks: Truck[]) => {
              return trucks.filter(t => t.id != truck.id);
            });
            truck.destination?.trucks.push(truck);
            truck.status = "arrived";
            truck.timer = (reduceAutomaticModeTransferTime.enabled ? 0.5 : 1) * 10;

            return lockers
          })

        }
      }
    }
  }

  private updateAutomaticTrucks() {
    for (const truck of this.allTrucks()) {

      if (truck.automaticMode) {
        switch (truck.status ?? "idle") {
          case "idle":
            if ((truck.timer ?? 0) <= 0) {
              const locker = this.getLockerOfTruck(truck);
              if (locker != undefined) {
                if (truck.routeFrom == locker && truck.routeTo != undefined) {
                  this.goto(truck, truck.routeTo)
                } else if (truck.routeTo == locker && truck.routeFrom != undefined) {
                  this.goto(truck, truck.routeFrom)
                } else if (truck.routeFrom != undefined) {
                  this.goto(truck, truck.routeFrom)
                }
              }
            } else {
              truck.timer = (truck.timer ?? 0) - 1;
            }
            break;
          case "arrived":
            if ((truck.timer ?? 0) <= 0) {
              truck.status = "transferring";
            } else
              truck.timer = (truck.timer ?? 0) - 1;
            break;
          case "transferring":
            const locker = this.getLockerOfTruck(truck);
            if (locker != undefined) {
              const truckToLockerCandidates = []
              const lockerToTruckCandidates = []
              for (const parcel of truck.parcels) {
                if (locker == truck.routeTo && (truck.parcelTargetsFilterForward ?? []).includes(parcel.destination)) {
                  truckToLockerCandidates.push(parcel)
                } else if (locker == truck.routeFrom && (truck.parcelTargetsFilterBackward ?? []).includes(parcel.destination)) {
                  truckToLockerCandidates.push(parcel)
                }
              }
              for (const parcel of locker.parcels) {
                if (locker == truck.routeFrom && (truck.parcelTargetsFilterForward ?? []).includes(parcel.destination)) {
                  lockerToTruckCandidates.push(parcel)
                } else if (locker == truck.routeTo && (truck.parcelTargetsFilterBackward ?? []).includes(parcel.destination)) {
                  lockerToTruckCandidates.push(parcel)
                }
              }
              let swapCount = Math.min(truckToLockerCandidates.length, lockerToTruckCandidates.length)

              while (swapCount > 0) {
                swapCount--;
                const truckToLockerParcel = truckToLockerCandidates.pop()
                const lockerToTruckParcel = lockerToTruckCandidates.pop()
                if (truckToLockerParcel != undefined && lockerToTruckParcel != undefined) {
                  this.transferFromTruckToLockerNoCheck(truckToLockerParcel, truck, locker)
                  this.transferFromLockerToTruckNoCheck(lockerToTruckParcel, truck, locker)
                }
              }
              for (const parcel of truckToLockerCandidates) {
                this.tryToTransferFromTruckToLocker(parcel, truck, locker, false)
              }
              for (const parcel of lockerToTruckCandidates) {
                this.tryToTransferFromLockerToTruck(parcel, locker, truck, false)
              }
            }


            truck.timer = (reduceAutomaticModeTransferTime.enabled ? 0.5 : 1) * 10;
            truck.status = "idle";
            break;
        }
      }
    }
  }


  getLockerFromId(id
                  :
                  string
  ) {
    for (const locker of this.lockersList()) {
      if (locker.id == id) {
        return locker;
      }
    }
    return undefined;
  }

  availableWarehousesCount() {
    return this.availableWarehouses.length
  }

  availableLockersCount() {
    return this.availableLockers.length
  }

  private transferFromTruckToLockerNoCheck(parcel: Parcel, truck: Truck, locker: Locker) {
    truck.parcels = truck.parcels.filter(p => p != parcel);
    locker.parcels.push(parcel)
    if (parcel.destination == locker) {
      parcel.status = "waiting for customer"
      let time = 60
      if (reduceBeforeCollectTime.enabled)
        time *= 0.5
      parcel.timer = time;
    }
  }

  private transferFromLockerToTruckNoCheck(parcel: Parcel, truck: Truck, locker: Locker) {
    locker.parcels = locker.parcels.filter(p => p != parcel);
    truck.parcels.push(parcel)
  }

  private tryToTransferFromTruckToLocker(parcel
                                         :
                                         Parcel, truck
                                         :
                                         Truck, locker
                                         :
                                         Locker, force
                                         :
                                         boolean
  ) {
    if (this.lockerHasFreeSlot(locker)) {
      this.transferFromTruckToLockerNoCheck(parcel, truck, locker)
    } else if (force) {
      const replacementParcels = locker.parcels.filter(p => p.destination != parcel.destination);
      if (replacementParcels.length > 0) {
        const rp = replacementParcels[0];
        this.transferFromTruckToLockerNoCheck(parcel, truck, locker)
        this.transferFromLockerToTruckNoCheck(rp, truck, locker)
      }
    }
  }

  private tryToTransferFromLockerToTruck(parcel
                                         :
                                         Parcel, locker
                                         :
                                         Locker, truck
                                         :
                                         Truck, force
                                         :
                                         boolean
  ) {
    if (this.truckHasFreeSpot(truck)) {
      this.transferFromLockerToTruckNoCheck(parcel, truck, locker)
    } else if (force) {
      const replacementParcels = truck.parcels.filter(p => p.destination != parcel.destination);
      if (replacementParcels.length > 0) {
        const rp = replacementParcels[0];
        this.transferFromLockerToTruckNoCheck(parcel, truck, locker)
        this.transferFromTruckToLockerNoCheck(rp, truck, locker)
      }
    }
  }

  private lockerHasFreeSlot(locker
                            :
                            Locker
  ) {
    return locker.parcels.length < locker.slot;
  }

  private truckHasFreeSpot(truck
                           :
                           Truck
  ) {
    return truck.parcels.length < truck.slot;
  }

}

