import {Injectable, signal} from '@angular/core';
import {Locker, Truck} from '../locker-service';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  allTrucksPanelVisible = signal<boolean>(false);
  allLockersPanelVisible = signal<boolean>(false);
  treePanelVisible = signal<boolean>(false);
  trucksListExpanding = signal<boolean>(false);
  selectedLocker = signal<Locker | undefined>(undefined);
  selectedTruck = signal<Truck | undefined>(undefined);

  toggleUpgradeTreePanel() {
    this.treePanelVisible.set(!this.treePanelVisible());

    this.selectedLocker.set(undefined)
    this.selectedTruck.set(undefined)
    this.allTrucksPanelVisible.set(false)
    this.allLockersPanelVisible.set(false);
  }

  toggleAllTrucksPanel() {
    this.allTrucksPanelVisible.set(!this.allTrucksPanelVisible());

    this.treePanelVisible.set(false);
    this.selectedLocker.set(undefined)
    this.selectedTruck.set(undefined)
    this.allLockersPanelVisible.set(false);
  }

  toggleAllLockersPanel() {
    this.allLockersPanelVisible.set(!this.allLockersPanelVisible());

    this.treePanelVisible.set(false);
    this.selectedLocker.set(undefined)
    this.selectedTruck.set(undefined)
    this.allTrucksPanelVisible.set(false)
  }

  selectLocker(l: Locker) {
    this.selectedLocker.set(l)

    this.treePanelVisible.set(false);
    this.selectedTruck.set(undefined)
    this.allTrucksPanelVisible.set(false)
    this.allLockersPanelVisible.set(false);
  }

  selectTruck(t: Truck) {
    this.selectedTruck.set(t)

    this.treePanelVisible.set(false);
    this.selectedLocker.set(undefined)
    this.allTrucksPanelVisible.set(false)
    this.allLockersPanelVisible.set(false);
  }

  isSelected(t: Truck) {
    return this.selectedTruck() == t;
  }

  isTrucksListExpanded() {
    return this.trucksListExpanding()
  }

  toggleTrucksListExpanding() {
    this.trucksListExpanding.set(!this.trucksListExpanding());
  }
}
