import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LockerService} from './locker-service';

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
    const parcel = {
      id: "0",
      destinationLockerId: 1,
    }

    this.lockerService.addLocker({
      id: 0, location: 'New York',
      slot: 1, parcels: [
        parcel
      ],
      trucks: [
        {
          id: "0",
          parcels: [],
          slot:3
        }
      ]
    });
    this.lockerService.addLocker({
      id: 1, location: 'Los Angeles', parcels: [],
      slot: 1,
      trucks: []
    });

  }
}
