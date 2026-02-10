import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  imports: [
    RouterOutlet,
    TranslateModule
  ],
  templateUrl: './user-list.html',
  styleUrl: '../../../styles/styles.css',
})
export class UserList implements OnInit {
  userList = ''

  constructor(private translate: TranslateService,) {
  }

  ngOnInit() {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  private setTranslations() {
    this.userList = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.USERLIST')
  }
}
