import {Component, inject} from '@angular/core';
import {Locker, LockerService, Truck} from '../locker-service';
import {UiService} from '../service/ui-service';

@Component({
  selector: 'app-lockers-list',
  imports: [],
  templateUrl: './lockers-list.html',
  styleUrl: './lockers-list.css'
})
export class LockersList {

  lockerService = inject(LockerService);
  uiService = inject(UiService)

  getAllLockers() {
    return this.lockerService.getLockersList()()
  }
selectLocker(locker: Locker): void {
    this.uiService.selectLocker(locker)
  }
}
