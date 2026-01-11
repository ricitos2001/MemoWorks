import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {NgIf} from '@angular/common';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-familiar-group-user-settings',
  standalone: true,
  imports: [
    NgIf,
    ButtonComponent
  ],
  templateUrl: './familiar-group-settings.component.html',
  styleUrl: '../../../styles/styles.css',
})
export class FamiliarGroupSettingsComponent {

  constructor(private router: Router) {
  }

  inGroup: boolean = false;

  createGroup() {
    this.inGroup = true;
  }


  leaveGroup() {
      this.inGroup = false;
  }
}
