import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTask } from './remove-task';

describe('RemoveTask', () => {
  let component: RemoveTask;
  let fixture: ComponentFixture<RemoveTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
