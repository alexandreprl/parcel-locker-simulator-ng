import {Component, effect, inject} from '@angular/core';
import {Locker, LockerService, Truck} from '../locker-service';
import {UiService} from '../service/ui-service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map {
  private lockerService: LockerService = inject(LockerService);
  uiService = inject(UiService)
  lockersList: Locker[] = [];
  allTrucks: Truck[] = [];
  minX = () => Math.min(...this.allTrucks.map(t => t.position.x), ...this.lockersList.map(l => l.position.x))
  maxX = () => Math.max(...this.allTrucks.map(t => t.position.x), ...this.lockersList.map(l => l.position.x))
  minY = () => Math.min(...this.allTrucks.map(t => t.position.y), ...this.lockersList.map(l => l.position.y))
  maxY = () => Math.max(...this.allTrucks.map(t => t.position.y), ...this.lockersList.map(l => l.position.y))

  constructor() {
    effect(() => {
      this.lockersList = this.lockerService.getLockersList()();
      this.allTrucks = this.lockerService.getAllTrucks();
    });
  }

  selectLocker(l: Locker) {

    this.uiService.selectLocker(l);
  }

  selectTruck(t: Truck) {

    this.uiService.selectTruck(t);
  }

  protected readonly Math = Math;
}
