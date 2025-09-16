import {computed, inject, Injectable, signal} from '@angular/core';
import {MoneyService} from './service/money-service';
import * as uuid from 'uuid';

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
  id: number;
  origin: Locker | undefined,
  destination: Locker | undefined,
  timer?: number | 0
}

export interface Truck {
  automaticMode?: boolean;
  status?: "manual" | "idle" | "on road" | "arrived" |"transferring";
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
  private selectedLocker = signal<Locker | undefined>(undefined);
  private availableLockers: Locker[] = [
    { city: "Akikawa", position: new Position(0.79, 0.2) },
    { city: "Minamishi", position: new Position(0.69, 0.26) },
    { city: "Takayama", position: new Position(0.55, 0.08) },
    { city: "Fujisaki", position: new Position(0.05, 0.59) },
    { city: "Harumura", position: new Position(0.64, 0.83) },
    { city: "Kitanaka", position: new Position(0.94, 0.29) },
    { city: "Yoshihama", position: new Position(0.46, 0.02) },
    { city: "Okutani", position: new Position(0.24, 0.05) },
    { city: "Nishikawa", position: new Position(0.74, 0.4) },
    { city: "Morishima", position: new Position(0.81, 0.56) },
    { city: "Kazehara", position: new Position(0.31, 0.98) },
    { city: "Tsubakida", position: new Position(0.55, 0.52) },
    { city: "Hoshizaki", position: new Position(0.4, 0.6) },
    { city: "Nakayori", position: new Position(0.87, 0.37) },
    { city: "Akimoto", position: new Position(0.80, 0.03) },
    { city: "Tokihama", position: new Position(0.91, 0.48) },
    { city: "Midoriyama", position: new Position(0.57, 0.17) },
    { city: "Shirosaki", position: new Position(0.38, 0.92) },
    { city: "Tanabe", position: new Position(0.48, 0.38) },
    { city: "Uenohara", position: new Position(0.80, 0.95) },
    { city: "Kumizawa", position: new Position(0.20, 0.75) },
    { city: "Hayashida", position: new Position(0.82, 0.09) },
    { city: "Nogizawa", position: new Position(0.42, 0.43) },
    { city: "Sakuragi", position: new Position(0.02, 0.82) },
    { city: "Kawamura", position: new Position(0.01, 0.68) },
    { city: "Isogawa", position: new Position(0.22, 0.92) },
    { city: "Mashiro", position: new Position(0.34, 0.37) },
    { city: "Takemura", position: new Position(0.20, 0.82) },
    { city: "Hinokawa", position: new Position(0.52, 0.99) },
    { city: "Yamashiro", position: new Position(0.88, 0.23) },
    { city: "Oshimori", position: new Position(0.18, 0.46) },
    { city: "Hanazaki", position: new Position(0.08, 0.15) },
    { city: "Takamori", position: new Position(0.33, 0.48) },
    { city: "Shirahata", position: new Position(0.07, 0.9) },
    { city: "Furumori", position: new Position(0.07, 0.08) },
    { city: "Nagisawa", position: new Position(0.43, 0.72) },
    { city: "Okazaki", position: new Position(0.1, 0.97) },
    { city: "Kitano", position: new Position(0.89, 0.16) },
    { city: "Hoshimura", position: new Position(0.19, 0.57) },
    { city: "Arakawa", position: new Position(0.73, 0.15) },
    { city: "Midorikawa", position: new Position(0.55, 0.23) },
    { city: "Aokita", position: new Position(0.52, 0.30) },
    { city: "Shigemura", position: new Position(0.43, 0.21) },
    { city: "Nanahara", position: new Position(0.28, 0.2) },
    { city: "Tokimori", position: new Position(0.15, 0.26) },
    { city: "Haruzawa", position: new Position(0.37, 0.8) },
    { city: "Mizushima", position: new Position(0.67, 0.75) },
    { city: "Yamanobe", position: new Position(0.32, 0.65) },
    { city: "Kanezawa", position: new Position(0.7, 0.99) }
  ].map(({ city, position }) => ({
    id: uuid.v4(),
    location: city,
    parcels: [],
    trucks: [],
    slot: 1,
    position,
  })).reverse();

  private availableWarehouses: Locker[] = [
    { city: "Warehouse 2", position: new Position(0.57, 0.63), warehouse:true }
  ].map(({ city, position, warehouse }) => ({
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

  getSelectedLocker(): Locker | undefined {
    return this.selectedLocker();
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
    const firstTruck = this.getTruckOfParcel(parcel)
    if (firstTruck == undefined) {
      return;
    }
    this.transfer(parcel, firstTruck)
  }

  transfer(parcel: Parcel, truck: Truck) {
    const locker = this.getLockerOfParcel(parcel);
    // const truck = this.getTruckOfParcel(parcel);
    const lockerTruck = truck != undefined ? this.getLockerOfTruck(truck) : undefined

    if (locker != undefined && locker.trucks.length > 0 && locker.trucks[0].parcels.length < locker.trucks[0].slot) {
      // from locker to truck
      const truck = locker.trucks[0];
      locker.parcels = locker.parcels.filter(p => p != parcel);
      truck.parcels.push(parcel);
    } else if (truck != undefined && lockerTruck != undefined) {
      // from truck to locker
      if (lockerTruck.parcels.length < lockerTruck.slot) {
        truck.parcels = truck.parcels.filter(p => p != parcel);
        lockerTruck.parcels.push(parcel);
      } else if (parcel.destination == lockerTruck) {
        const replacementParcels = lockerTruck.parcels.filter(p => p.destination != lockerTruck);
        if (replacementParcels.length > 0) {
          const rp = replacementParcels[0];
          lockerTruck.parcels.push(parcel)
          truck.parcels = truck.parcels.filter(p => p != parcel)
          truck.parcels.push(rp);
          lockerTruck.parcels = lockerTruck.parcels.filter(p => p != rp);
        }
      }

      parcel.timer = 0;
    }
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
          if (Math.random() * 6 < 0.1 && timer == 0) {
            parcel.timer = 1;
          } else if (timer > 0) {
            if (timer >= 30) {
              const distance = parcel.origin?.position.distanceTo(parcel.destination.position);
              const gain = Math.round(distance == undefined ? 1 : Math.max(1, distance / 0.3))
              this.moneyService.add(gain)
              locker.parcels = locker.parcels.filter(p => p != parcel);
            }
            parcel.timer = parcel.timer == undefined ? 1 : parcel.timer + 1
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


  setSelectedLocker(l
                    :
                    Locker
  ) {
    this.selectedLocker.set(l)
  }

  popAvailableLocker() {
    return this.availableLockers.pop();
  }

  popAvailableWarehouse() {
    return this.availableWarehouses.pop();
  }

  deliver(truck
          :
          Truck
  ) {
    const locker = this.getLockerOfTruck(truck);
    if (locker == undefined)
      return;

    for (const parcel of truck.parcels) {
      if (parcel.destination == locker) {

        if (locker.parcels.length < locker.slot) {
          locker.parcels.push(parcel)
          truck.parcels = truck.parcels.filter(p => p != parcel);
        } else {
          const replacementParcels = locker.parcels.filter(p => p.destination != locker);
          if (replacementParcels.length > 0) {
            const rp = replacementParcels[0];
            locker.parcels.push(parcel)
            truck.parcels = truck.parcels.filter(p => p != parcel)
            truck.parcels.push(rp);
            locker.parcels = locker.parcels.filter(p => p != rp);

          }
        }

      }
    }
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
        const speed = 0.002;
        truck.position = truck.position.add(dir.x * speed, dir.y * speed);

        if (truck.position.distanceTo(truck.destination.position) < speed) {
          truck.position = truck.destination.position
          this.lockersList.update((lockers: Locker[]) => {

            this.onRoadTrucks.update((trucks: Truck[]) => {
              return trucks.filter(t => t.id != truck.id);
            });
            truck.destination?.trucks.push(truck);
            truck.status = "arrived";
            truck.timer = 10;

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

            // console.log("arrived");
            const locker = this.getLockerOfTruck(truck);
            // console.log("the locker is " + locker?.location);
            if (locker != undefined) {
              for (const parcel of truck.parcels) {
                if (parcel.destination == locker) {
                  // console.log("transfering because parcel on destination")
                  this.transfer(parcel, truck)
                } else if (locker.warehouse && parcel.destination != truck.routeTo && parcel.destination != truck.routeFrom) {
                  // console.log("tranferign because warehouse")
                  this.transfer(parcel, truck)

                }
              }
              for (const parcel of locker.parcels) {

                if ((parcel.destination == truck.routeTo && locker != truck.routeTo) || (parcel.destination == truck.routeFrom && locker != truck.routeFrom)) {
                  // console.log("transfering because parcel goes where I go")
                  this.transfer(parcel, truck)
                  // } else if (locker.warehouse && parcel.destination != truck.routeTo && parcel.destination != truck.routeFrom) {
                  //   console.log("tranferign because warehouse")
                  //   this.transfer(parcel)
                } else if (!locker.warehouse && parcel.destination != truck.routeTo && parcel.destination != truck.routeFrom) {
                  // console.log("transfering because I am going to warehouse")
                  this.transfer(parcel, truck)
                }
              }
            }
            truck.timer = 10;
            truck.status = "idle";
            break;
        }
      }


    }
  }

  getLockerFromId(id: string) {
    for (const locker of this.lockersList()) {
      if (locker.id == id) {
        return locker;
      }
    }
    return undefined;
  }

}
