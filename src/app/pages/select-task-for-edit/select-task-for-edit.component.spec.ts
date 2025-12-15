import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTaskForEditComponent } from './select-task-for-edit.component';

describe('SelectTaskForEditComponent', () => {
  let component: SelectTaskForEditComponent;
  let fixture: ComponentFixture<SelectTaskForEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTaskForEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTaskForEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
