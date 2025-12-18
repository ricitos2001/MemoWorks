import { Component } from '@angular/core';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {FormInputComponent} from '../../components/shared/form-input/form-input.component';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';
import {AddTaskComponent} from '../add-task/add-task.component';
import {RemoveTaskComponent} from '../remove-task/remove-task.component';
import {EditTaskComponent} from '../edit-task/edit-task.component';
import {RecoverPasswordComponent} from '../recover-password/recover-password.component';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrl: '../../../styles/styles.css',
  imports: [
    ButtonComponent,
    FormInputComponent,
    LoginComponent,
    RegisterComponent,
    AddTaskComponent,
    EditTaskComponent,
    RecoverPasswordComponent
  ]
})
export class StyleGuideComponent {

}

