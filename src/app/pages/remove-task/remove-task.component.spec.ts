import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTaskComponent } from './remove-task.component';

describe('RemoveTaskComponent', () => {
  let component: RemoveTaskComponent;
  let fixture: ComponentFixture<RemoveTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveTaskComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
