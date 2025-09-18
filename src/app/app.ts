import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {colors, LockerService, Parcel, Position} from './locker-service';


export const firstWarehousePosition = new Position(0.3, 0.3);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Parcel-LockerRow-Simulator');

  private lockerService = inject(LockerService);

  ngOnInit() {

    this.lockerService.addLocker({
      id: "0",
      warehouse: true,
      location: 'Warehouse',
      position: firstWarehousePosition,
      slot: 3, parcels: [],
      trucks: [
        {
          id: this.lockerService.popNewTruckId(),
          position: firstWarehousePosition,
          color: colors[Math.floor(Math.random() * colors.length)],
          parcels: [],
          slot: 3
        }
      ]
    });
    const locker1 = this.lockerService.popAvailableLocker()
    const locker2 = this.lockerService.popAvailableLocker()
    if (locker1 == undefined || locker2 == undefined) {
      console.error('Unable to create lockers')
      return;
    }
    const parcel:Parcel = {
      id: this.lockerService.popNewParcelId(),
      origin: locker1,
      destination: locker2,
    }
    locker1?.parcels.push(parcel)


    this.lockerService.addLocker(locker1);
    this.lockerService.addLocker(locker2);

  }
}
