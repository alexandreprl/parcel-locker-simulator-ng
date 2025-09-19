import {Component, inject} from '@angular/core';
import {UpgradeTreeItem} from "../upgrade-tree-item/upgrade-tree-item";
import {LockerService, Truck} from '../locker-service';
import {UiService} from '../service/ui-service';

@Component({
  selector: 'app-trucks-list',
  imports: [
   ],
  templateUrl: './trucks-list.html',
  styleUrl: './trucks-list.css'
})
export class TrucksList {
  lockerService = inject(LockerService);
  uiService = inject(UiService)

  getAllTrucks() {
    return this.lockerService.getAllTrucks()
  }

  selectTruck(truck: Truck) {
    this.uiService.selectTruck(truck);
  }
}
