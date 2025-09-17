import {Injectable} from '@angular/core';
import {automaticModeUpgrade} from './upgrades';


@Injectable({
  providedIn: 'root'
})
export class UpgradeService {
  isAutomaticModeAllowed() {
    return automaticModeUpgrade.enabled;
  }
}
