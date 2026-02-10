import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  imports: [
    RouterOutlet,
    TranslateModule
  ],
  templateUrl: './user-list.html',
  styleUrl: '../../../styles/styles.css',
})
export class UserList {

}
