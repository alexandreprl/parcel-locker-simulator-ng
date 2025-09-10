import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelRow } from './parcel-row';

describe('ParcelRow', () => {
  let component: ParcelRow;
  let fixture: ComponentFixture<ParcelRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
