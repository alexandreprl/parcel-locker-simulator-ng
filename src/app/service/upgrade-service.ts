import {inject, Injectable, signal} from '@angular/core';
import {MoneyService} from './money-service';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {
  private automaticMode = signal<boolean>(false);
  private moneyService = inject(MoneyService)

  isAutomaticModeAllowed() {
    return this.automaticMode();
  }

  unlockAutomaticMode() {
    const price = this.getAutomaticModePrice();
    if (this.moneyService.getOwned() < price)
      return
    this.moneyService.remove(price)
    this.automaticMode.set(true)
  }

  getAutomaticModePrice() {
    return 10;
  }
}
