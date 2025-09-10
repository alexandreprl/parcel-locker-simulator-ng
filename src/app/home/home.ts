import {Component} from '@angular/core';
import {Locker, LockerService, Truck} from '../locker-service';
import {inject} from '@angular/core';
import {effect} from '@angular/core';
import {LockerRow} from '../locker-row/locker-row';
import {TruckRow} from '../truck-row/truck-row';
import {StatusBar} from '../status-bar/status-bar';
import {MoneyService} from '../service/money-service';
import * as uuid from 'uuid';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    LockerRow,
    TruckRow,
    StatusBar,
    CurrencyPipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private lockerService: LockerService;
  private moneyService = inject(MoneyService);
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

  newLockerPrice() {
    const basePrice = 10
    return Math.round(basePrice * Math.pow(1.4, this.lockerService.getLockersList()().length-2));
  }
  newTruckPrice() {
    const basePrice = 5
    return Math.round(basePrice * Math.pow(1.4, this.lockerService.getAllTrucks().length-1));
  }
  addLocker() {
    const price = this.newLockerPrice()
    if (this.moneyService.getOwned() < price)
      return;
    this.moneyService.remove(price);
    const newId = this.lockersList.length > 0 ? Math.max(...this.lockersList.map(l => l.id)) + 1 : 1;
    this.lockerService.addLocker({
      id: newId, location: "test",
      parcels: [],
      trucks: [],
      slot: 1
    });
  }

  addTruck() {
    const price = this.newTruckPrice()
    if (this.moneyService.getOwned() < price)
      return;
    this.moneyService.remove(price);
    this.lockerService.addTruck({
      id: uuid.v4(),
      parcels: [],
      slot: 3
    });
  }
}
