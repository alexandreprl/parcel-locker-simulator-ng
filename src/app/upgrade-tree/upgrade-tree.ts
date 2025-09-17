import {Component} from '@angular/core';
import {upgrades} from '../service/upgrades';
import {UpgradeTreeItem} from '../upgrade-tree-item/upgrade-tree-item';

@Component({
  selector: 'app-upgrade-tree',
  imports: [
    UpgradeTreeItem
  ],
  templateUrl: './upgrade-tree.html',
  styleUrl: './upgrade-tree.css'
})
export class UpgradeTree {
  protected readonly firstUpgrade = upgrades[0];


}
