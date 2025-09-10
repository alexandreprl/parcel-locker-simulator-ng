import { ComponentFixture, TestBed } from '@angular/core/testing';

import {Locker, LockerRow} from './locker-row';

describe('Locker', () => {
  let component: LockerRow;
  let fixture: ComponentFixture<Locker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Locker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Locker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
