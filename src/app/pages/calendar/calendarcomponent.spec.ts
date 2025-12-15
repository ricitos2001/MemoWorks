import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calendarcomponent } from './calendarcomponent';

describe('Calendarcomponent', () => {
  let component: Calendarcomponent;
  let fixture: ComponentFixture<Calendarcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calendarcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calendarcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
