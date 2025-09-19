import {Component} from '@angular/core';
import {Locker, LockerService, Truck} from '../locker-service';
import {inject} from '@angular/core';
import {effect} from '@angular/core';
import {LockerRow} from '../locker-row/locker-row';
import {StatusBar} from '../status-bar/status-bar';
import {Map} from '../map/map';
import {UiService} from '../service/ui-service';
import {UpgradeTree} from '../upgrade-tree/upgrade-tree';
import {TruckRow} from '../truck-row/truck-row';
import {TrucksList} from '../trucks-list/trucks-list';
import {LockersList} from '../lockers-list/lockers-list';

@Component({
  selector: 'app-home',
  imports: [
    LockerRow,
    StatusBar,
    Map,
    UpgradeTree,
    TruckRow,
    TrucksList,
    LockersList
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private lockerService: LockerService;
  uiService=inject(UiService)
  lockersList: Locker[] = [];
  allTrucks: Truck[] = [];
  onRoadTrucks: Truck[] = [];
  private updateLoopId: number = 0;

  constructor() {
    this.lockerService = inject(LockerService);
    effect(() => {
      this.lockersList = this.lockerService.getLockersList()();
      this.onRoadTrucks = this.lockerService.getOnRoadTrucks()();
      this.allTrucks = this.lockerService.getAllTrucks();
    });
  }

  ngOnInit() {
    this.updateLoopId = setInterval(() => {
      this.update()
    }, 100)
  }

  ngOnDestroy() {
    if (this.updateLoopId) {
      clearInterval(this.updateLoopId);
    }
  }

  update() {
    this.lockerService.update();
  }

}
