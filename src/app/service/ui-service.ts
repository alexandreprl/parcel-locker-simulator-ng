import {Injectable, signal} from '@angular/core';
import {Locker} from '../locker-service';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  treePanelVisible = signal<boolean>(false);
  selectedLocker = signal<Locker | undefined>(undefined);

  toggleUpgradeTreePanel() {
    this.treePanelVisible.set(!this.treePanelVisible());
  }

  selectLocker(l: Locker) {
    this.selectedLocker.set(l)
    this.treePanelVisible.set(false)
  }
}
