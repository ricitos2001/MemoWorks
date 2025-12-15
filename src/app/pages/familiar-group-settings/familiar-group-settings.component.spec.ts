import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliarGroupSettingsComponent } from './familiar-group-settings.component';

describe('FamiliarGroupSettingsComponent', () => {
  let component: FamiliarGroupSettingsComponent;
  let fixture: ComponentFixture<FamiliarGroupSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamiliarGroupSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamiliarGroupSettingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
