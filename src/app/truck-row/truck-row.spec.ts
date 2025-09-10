import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckRow } from './truck-row';

describe('TruckRow', () => {
  let component: TruckRow;
  let fixture: ComponentFixture<TruckRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
