import {Component, OnInit} from '@angular/core';
import {Button} from '../../components/shared/button/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-familiar-group-user-settings',
  imports: [
    NgIf,
    Button
  ],
  templateUrl: './familiar-group-settings.html',
  styleUrl: '../../../styles/styles.css',
})
export class FamiliarGroupSettings{

  inGroup: boolean = false;

  createGroup() {
      this.inGroup = true;
  }

  leaveGroup() {
      this.inGroup = false;
  }
}
