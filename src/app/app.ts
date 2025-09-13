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
    const parcel:Parcel = {
      id: this.lockerService.popNewParcelId(),
      origin: undefined,
      destination: undefined,
    }
    const locker1 = {
      id: "1",
      location: 'Akikawa',
      parcels: [parcel],
      position: new Position(0.05, 0.2),
      slot: 1,
      trucks: []
    }
    const locker2 = {
      id: "2", location: 'Minamishi', parcels: [],
      position: new Position(0.12, 0.07),
      slot: 1,
      trucks: []
    }
    parcel.origin = locker1
    parcel.destination = locker2
    this.lockerService.addLocker(locker1);
    this.lockerService.addLocker(locker2);

  }
}
