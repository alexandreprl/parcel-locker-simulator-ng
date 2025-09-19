import {Injectable, signal} from '@angular/core';
import {Locker, Truck} from '../locker-service';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  allTrucksPanelVisible = signal<boolean>(false);
  treePanelVisible = signal<boolean>(false);
  selectedLocker = signal<Locker | undefined>(undefined);
  selectedTruck = signal<Truck | undefined>(undefined);

  toggleUpgradeTreePanel() {
    this.treePanelVisible.set(!this.treePanelVisible());
    this.selectedTruck.set(undefined)
    this.allTrucksPanelVisible.set(false)
  }

  toggleAllTrucksPanel() {
    this.treePanelVisible.set(false);
    this.selectedTruck.set(undefined)
    this.allTrucksPanelVisible.set(!this.allTrucksPanelVisible());
  }

  selectLocker(l: Locker) {
    this.selectedLocker.set(l)
    this.selectedTruck.set(undefined)
    this.allTrucksPanelVisible.set(false)
    this.treePanelVisible.set(false)
  }

  selectTruck(t: Truck) {
    this.selectedTruck.set(t)
    this.selectedLocker.set(undefined)
    this.treePanelVisible.set(false)
    this.allTrucksPanelVisible.set(false)
  }

  isSelected(t: Truck) {
    return this.selectedTruck() == t;
  }
}
