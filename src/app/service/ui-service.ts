import {Injectable, signal} from '@angular/core';
import {Locker, Truck} from '../locker-service';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  treePanelVisible = signal<boolean>(false);
  selectedLocker = signal<Locker | undefined>(undefined);
  selectedTruck = signal<Truck | undefined>(undefined);

  toggleUpgradeTreePanel() {
    this.treePanelVisible.set(!this.treePanelVisible());
  }

  selectLocker(l: Locker) {
    this.selectedLocker.set(l)
    this.selectedTruck.set(undefined)
    this.treePanelVisible.set(false)
  }

  selectTruck(t: Truck) {
    this.selectedLocker.set(undefined)
    this.selectedTruck.set(t)
    this.treePanelVisible.set(false)
  }
}
