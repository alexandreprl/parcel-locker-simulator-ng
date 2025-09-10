import {Injectable, Signal, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoneyService {
  private owned: WritableSignal<number> = signal<number>(0);

  add(amount: number) {
    this.owned.update(value => value + amount);
  }

  getOwned(): number {
    return this.owned();
  }

  remove(price: number) {
    this.owned.update(value => value - price);
  }
}
