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
  id: string;
  origin: Locker | undefined,
  destination: Locker | undefined,
}

export interface Truck {
  color: string;
  destination?: Locker;
  id: string;
  parcels: Parcel[];
  slot: number;
  position: Position;
}

export const colors = [
  "#D4A373", // warm sand
  "#E6B89C", // peach cream
  "#C38E70", // cocoa brown
  "#A97155", // caramel
  "#FFE8D6", // cream
  "#F5CAC3", // soft blush
  "#EDBBB4", // muted rose
  "#FFDDD2", // warm apricot
  "#FFD6A5", // peachy glow
  "#FFB5A7", // dusty pink
  "#E5989B", // vintage rose
  "#B5838D", // mauve taupe
  "#6D6875", // cozy plum
  "#7E6A9F", // lavender dusk
  "#C9ADA7", // misty lilac
  "#DDBEA9", // latte beige
  "#B08968", // cinnamon
  "#A98467", // earthy mocha
  "#9C6644", // spiced brown
  "#CB997E", // rustic clay
  "#DDC2A3", // almond cream
  "#E3D5CA", // oatmeal
  "#F8EDEB", // pale pink
  "#EDE7E3", // linen
  "#DFD3C3", // warm parchment
  "#F4F1DE", // soft ivory
  "#FAF3E0", // vanilla
  "#EDE6DB", // eggshell
  "#DAD7CD", // soft moss
  "#A3B18A", // sage green
  "#588157", // cozy pine
  "#3A5A40", // forest shade
  "#344E41", // deep pine
  "#6A994E", // mossy leaf
  "#9BC1BC", // mint mist
  "#A5C9CA", // dusty aqua
  "#B5D2CB", // pale seafoam
  "#CCE2CB", // faded green
  "#AEC5EB", // muted sky
  "#9FA6A7", // soft gray
  "#CED4DA", // cloudy mist
  "#ADB5BD", // stone gray
  "#495057", // charcoal cozy
  "#6C757D", // warm slate
  "#343A40", // deep gray
  "#432818", // dark cocoa
  "#99582A", // toffee
  "#FFE5B4", // soft apricot
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

  getAllTrucks() {
    return this.allTrucks();
  }


  private time = signal<number>(0);
  private selectedLocker = signal<Locker | undefined>(undefined);
  private availableLockers: Locker[] = [
    "Akikawa", "Minamishi", "Takayama", "Fujisaki", "Harumura", "Kitanaka", "Yoshihama", "Okutani", "Nishikawa", "Morishima",
    "Kazehara", "Tsubakida", "Hoshizaki", "Nakayori", "Akimoto", "Tokihama", "Midoriyama", "Shirosaki", "Tanabe", "Uenohara",
    "Kumizawa", "Hayashida", "Nogizawa", "Sakuragi", "Kawamura", "Isogawa", "Mashiro", "Takemura", "Hinokawa", "Yamashiro",
    "Oshimori", "Hanazaki", "Takamori", "Shirahata", "Furumori", "Nagisawa", "Okazaki", "Matsuhara", "Kitano", "Hoshimura",
    "Arakawa", "Midorikawa", "Aokita", "Shigemura", "Nanahara", "Tokimori", "Haruzawa", "Mizushima", "Yamanobe", "Kanezawa"
  ].map((city, i) => ({
    id: uuid.v4(),
    location: city,
    parcels: [],
    trucks: [],
    slot: 1,
    position: new Position(Math.random(), Math.random())
  }));

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

  update() {
    this.time.update(time => time + 1)
    this.moveTrucks();
    this.checkSuccessfulParcels()
    this.addNewParcels()
  }

  private moveTrucks() {
    for (const truck of this.onRoadTrucks()) {
      if (truck.destination !== undefined) {
        const dir = truck.position.directionTo(truck.destination.position);
        const speed = 0.001;
        truck.position = truck.position.add(dir.x * speed, dir.y * speed);

        if (truck.position.distanceTo(truck.destination.position) < speed) {
          truck.position = truck.destination.position
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
  }

  transfer(parcel: Parcel) {
    const locker = this.getLockerOfParcel(parcel);
    const truck = this.getTruckOfParcel(parcel);
    const lockerTruck = truck != undefined ? this.getLockerOfTruck(truck) : undefined
    if (locker != undefined && locker.trucks.length > 0 && locker.trucks[0].parcels.length < locker.trucks[0].slot) {
      const truck = locker.trucks[0];
      locker.parcels = locker.parcels.filter(p => p != parcel);
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

  public getTruckOfParcel(parcel: Parcel) {
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
        if (parcel.destination == locker && Math.random() * 1 < 0.1) {
          const distance = parcel.origin?.position.distanceTo(parcel.destination.position);
          const gain = distance == undefined ? 1 : Math.max(1, distance / 0.3)
          this.moneyService.add(gain)
          locker.parcels = locker.parcels.filter(p => p != parcel);
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
                  id: uuid.v4(),
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

  private getRandomLockerExcept(locker: Locker) {
    const ll = this.lockersList()
    let l = this.lockersList()[0]
    do {
      l = ll[Math.floor(Math.random() * ll.length)]
    } while (l == locker || l.warehouse);
    return l
  }

  addTruck(truck: Truck, locker: Locker) {
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

  deliver(truck: Truck) {
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
}
