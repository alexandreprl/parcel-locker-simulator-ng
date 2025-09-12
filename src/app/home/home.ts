import {Component} from '@angular/core';
import {Locker, LockerService, Truck} from '../locker-service';
import {inject} from '@angular/core';
import {effect} from '@angular/core';
import {LockerRow} from '../locker-row/locker-row';
import {TruckRow} from '../truck-row/truck-row';
import {StatusBar} from '../status-bar/status-bar';
import {MoneyService} from '../service/money-service';

import {CurrencyPipe} from '@angular/common';
import {Map} from '../map/map';

@Component({
  selector: 'app-home',
  imports: [
    LockerRow,
    StatusBar,
    Map
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private lockerService: LockerService;
  lockersList: Locker[] = [];
  allTrucks: Truck[] = [];
  onRoadTrucks: Truck[] = [];
  private updateLoopId: number = 0;
  selectedLocker: Locker | undefined;

  constructor() {
    this.lockerService = inject(LockerService);
    effect(() => {
      this.lockersList = this.lockerService.getLockersList()();
      this.onRoadTrucks = this.lockerService.getOnRoadTrucks()();
      this.allTrucks = this.lockerService.getAllTrucks();
      this.selectedLocker = this.lockerService.getSelectedLocker()
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
