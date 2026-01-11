import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ReactiveFormsModule} from '@angular/forms';
import { AsyncValidatorsService } from '../../services/async-validators.service';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: '../../../styles/styles.css',
  imports: [
    ReactiveFormsModule
  ]
})
export class CreateGroupComponent{

}
