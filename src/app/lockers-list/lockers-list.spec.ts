import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockersList } from './lockers-list';

describe('LockersList', () => {
  let component: LockersList;
  let fixture: ComponentFixture<LockersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
