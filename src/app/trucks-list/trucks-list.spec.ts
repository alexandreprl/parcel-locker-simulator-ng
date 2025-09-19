import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucksList } from './trucks-list';

describe('TrucksList', () => {
  let component: TrucksList;
  let fixture: ComponentFixture<TrucksList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrucksList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrucksList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
