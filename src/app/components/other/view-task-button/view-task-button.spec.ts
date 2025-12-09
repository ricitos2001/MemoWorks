import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskButton } from './view-task-button';

describe('ViewTaskButton', () => {
  let component: ViewTaskButton;
  let fixture: ComponentFixture<ViewTaskButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTaskButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTaskButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
