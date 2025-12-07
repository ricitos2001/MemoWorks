import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliarGroupSettings } from './familiar-group-settings';

describe('FamiliarGroupSettings', () => {
  let component: FamiliarGroupSettings;
  let fixture: ComponentFixture<FamiliarGroupSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamiliarGroupSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamiliarGroupSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
