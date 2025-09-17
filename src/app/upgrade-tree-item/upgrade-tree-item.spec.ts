import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeTreeItem } from './upgrade-tree-item';

describe('UpgradeTreeItem', () => {
  let component: UpgradeTreeItem;
  let fixture: ComponentFixture<UpgradeTreeItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeTreeItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeTreeItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
