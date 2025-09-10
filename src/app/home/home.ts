import {Component} from '@angular/core';
import {Locker, LockerService, Truck} from '../locker-service';
import {inject} from '@angular/core';
import {effect} from '@angular/core';
import {LockerRow} from '../locker-row/locker-row';
import {TruckRow} from '../truck-row/truck-row';
import {StatusBar} from '../status-bar/status-bar';
import {MoneyService} from '../service/money-service';

import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    LockerRow,
    TruckRow,
    StatusBar
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private lockerService: LockerService;
  lockersList: Locker[] = [];
  onRoadTrucks: Truck[] = [];
  private updateLoopId: number = 0;

  constructor() {
    this.lockerService = inject(LockerService);
    effect(() => {
      this.lockersList = this.lockerService.getLockersList()();
      this.onRoadTrucks = this.lockerService.getOnRoadTrucks()();
    });
  }

  ngOnInit() {
    this.updateLoopId = setInterval(() => {
      this.update()
    }, 1000)
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
