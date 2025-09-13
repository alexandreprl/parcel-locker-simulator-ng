import {Component, computed, effect, inject, signal} from '@angular/core';
import {Locker, LockerService, Truck} from '../locker-service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map {
  private lockerService: LockerService = inject(LockerService);
  lockersList: Locker[] = [];
  allTrucks: Truck[] = [];
  selectedLocker: Locker | undefined;
  minX = () => Math.min(...this.allTrucks.map(t => t.position.x), ...this.lockersList.map(l => l.position.x))
  maxX = () => Math.max(...this.allTrucks.map(t => t.position.x), ...this.lockersList.map(l => l.position.x))
  minY = () => Math.min(...this.allTrucks.map(t => t.position.y), ...this.lockersList.map(l => l.position.y))
  maxY = () => Math.max(...this.allTrucks.map(t => t.position.y), ...this.lockersList.map(l => l.position.y))

  constructor() {
    effect(() => {
      this.lockersList = this.lockerService.getLockersList()();
      this.allTrucks = this.lockerService.getAllTrucks();
      this.selectedLocker = this.lockerService.getSelectedLocker()
    });
  }

  selectLocker(l: Locker) {

    this.lockerService.setSelectedLocker(l)
  }

  protected readonly Math = Math;
}
