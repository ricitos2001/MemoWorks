import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionButton } from './option-button';

describe('OptionButton', () => {
  let component: OptionButton;
  let fixture: ComponentFixture<OptionButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
