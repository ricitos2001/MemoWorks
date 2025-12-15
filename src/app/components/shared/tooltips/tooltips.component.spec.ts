import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipsComponent } from './tooltips.component';

describe('TooltipsComponent', () => {
  let component: TooltipsComponent;
  let fixture: ComponentFixture<TooltipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TooltipsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
