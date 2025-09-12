import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LockerService, Position} from './locker-service';

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
      position: new Position(0.5, 0.5),
      slot: 3, parcels: [],
      trucks: [
        {
          id: "0",
          position: new Position(0.5, 0.5),
          parcels: [],
          slot: 3
        }
      ]
    });
    const parcel = {
      id: "0",
      destinationLockerId: "2",
    }
    this.lockerService.addLocker({
      id: "1", location: 'Akikawa',
      parcels: [parcel],
      position: new Position(0.05, 0.2),
      slot: 1,
      trucks: []
    });
    this.lockerService.addLocker({
      id: "2", location: 'Minamishi', parcels: [],
      position: new Position(0.12, 0.07),
      slot: 1,
      trucks: []
    });

  }
}
