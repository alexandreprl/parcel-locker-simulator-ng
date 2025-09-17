import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeTree } from './upgrade-tree';

describe('UpgradeTree', () => {
  let component: UpgradeTree;
  let fixture: ComponentFixture<UpgradeTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
