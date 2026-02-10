import {Component, computed, DestroyRef, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SharedBarComponent} from '../shared-bar/shared-bar.component';
import {SliderComponent} from '../slider/slider.component';
import {CommunicationService} from '../../../services/shared/communication.service';
import {UsersSignalStore} from '../../../stores/users.signal.store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AvatarService} from '../../../services/shared/avatar.service';

@Component({
  selector: 'app-users',
  imports: [
    NgIf,
    TranslateModule,
    NgForOf,
    SharedBarComponent,
    SliderComponent,


  ],
  templateUrl: './users.html',
  styleUrl: '../../../../styles/styles.css',
  standalone: true
})
export class Users implements OnInit {
  @Output() createFromEmpty = new EventEmitter<void>();
  loadingText = ''
  searcher: string = '';
  noResults: string = '';
  userNotFound: string = '';
  zeroUsers: string = '';
  name: string = '';
  surnames: string = '';
  usernameText: string = '';
  phoneNumber: string = '';
  userEmail: string = '';
  userList = ''

  email = localStorage.getItem('email');
  private store = inject(UsersSignalStore);
  users = computed(() => this.store.state().data);
  loading = computed(() => this.store.state().loading);
  error = computed(() => this.store.error());
  total = computed(() => this.store.state().total);
  hasUsers = computed(() =>
    this.store.state().allData.length > 0
  );
  hasResults = computed(() =>
    this.store.state().data.length > 0
  );
  page = this.store.page;
  pageSize = this.store.pageSize;
  private destroyRef = inject(DestroyRef);
  private comm = inject(CommunicationService);
  private translate = inject(TranslateService);
  private avatarService = inject(AvatarService)

  ngOnInit(): void {
    if (this.email) {
      this.store.load(this.page());
    }

    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n?.payload?.refreshTasks) {
          this.store.load(this.page());
        }
      });

    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  onSearch(term: string) {
    this.store.search(term);
  }

  trackById(_: number, task: any) {
    return task.id;
  }

  getImage(userId?: number | null): string {
    const defaultImg = 'assets/img/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector-removebg-preview.png';
    if (!userId) return defaultImg;
    const key = `avatar_${userId}`;
    const cached = localStorage.getItem(key);
    if (cached) return cached;
    this.avatarService.loadAvatar(userId);
    return defaultImg;
  }

  private setTranslations() {
    this.loadingText = this.translate.instant('COMPONENTS.SHARED.USERS.LOADINGTEXT');
    this.searcher = this.translate.instant('COMPONENTS.SHARED.USERS.SEARCHER');
    this.noResults = this.translate.instant('COMPONENTS.SHARED.USERS.NORESULTS');
    this.userNotFound = this.translate.instant('COMPONENTS.SHARED.USERS.TASKNOTFOUND');
    this.zeroUsers = this.translate.instant('COMPONENTS.SHARED.USERS.ZEROUSERS');
    this.name = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.NAME');
    this.surnames = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.SURNAMES');
    this.usernameText = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.USERNAMETEXT');
    this.phoneNumber = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.PHONENUMBER');
    this.userEmail = this.translate.instant('PAGES.SETTINGS.USERSETTINGS.USEREMAIL');
    this.userList = this.translate.instant('COMPONENTS.LAYOUT.FOOTER.USERLIST')
  }
}
