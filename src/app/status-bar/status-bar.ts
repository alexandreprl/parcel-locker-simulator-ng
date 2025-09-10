import {Component, effect, inject} from '@angular/core';
import {MoneyService} from '../service/money-service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-status-bar',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './status-bar.html',
  styleUrl: './status-bar.css'
})
export class StatusBar {
  private moneyService = inject(MoneyService)
  ownedMoney = 0;

  constructor() {
    effect(() => {
      this.ownedMoney = this.moneyService.getOwned();
    });
  }
}
