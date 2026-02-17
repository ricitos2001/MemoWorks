import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ThemeService} from '../../services/shared/theme.service';
import {AuthModalComponent} from '../../components/shared/auth-modal/auth-modal.component';
import {ButtonComponent} from '../../components/shared/button/button.component';
import {AuthModalService} from '../../services/shared/auth-modal.service';
import {distinctUntilChanged} from 'rxjs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing',
  imports: [
    AuthModalComponent,
    ButtonComponent,
    TranslateModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: '../../../styles/styles.css',
  standalone: true,
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('authModal') authModal!: AuthModalComponent;

  darkMode = false;
  title = '';
  getStarted = '';
  whatOffers = '';
  subtitle1 = '';
  text1 = '';
  subtitle2 = '';
  text2 = '';
  subtitle3 = '';
  text3 = '';
  // Animations
  @ViewChild('animatedElement') animatedElement!: ElementRef<HTMLElement>;

  constructor(private router: Router, private themeService: ThemeService, private authModalService: AuthModalService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$
      .pipe(distinctUntilChanged())
      .subscribe(theme => {
        const newDark = theme === 'dark';
        if (this.darkMode !== newDark) {
          this.darkMode = newDark;
          setTimeout(() => this.refreshPicturesBySelector(), 0);
        }
      });

    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  openAuthModal(tab: 'login' | 'register' | 'recover' = 'register') {
    if (tab === 'recover') {
      this.router.navigate(['/recuperarContraseña']);
      return;
    }
    this.authModalService.open(tab);
  }

  onAuthSuccess() {
    this.router.navigate(['/dashboard']);
  }

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);
    const group = this.animatedElement.nativeElement;
    const articles = group.querySelectorAll('.landing__article');
    const sections = group.querySelectorAll('.landing__section');
    gsap.set(sections, {opacity: 0, y: 60, scale: 0.98});
    sections.forEach(section => {
      gsap.to(section, {opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out', scrollTrigger: {trigger: section, start: 'top 80%', toggleActions: 'play none none reverse'}});
    })
    gsap.set(articles, {opacity: 0, y: 60, scale: 0.98});
    articles.forEach((article) => {
      gsap.to(article, {opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out', scrollTrigger: {trigger: article, start: 'top 80%', toggleActions: 'play none none reverse'}});
    });
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  private refreshPicturesBySelector() {
    const imgs = document.querySelectorAll<HTMLImageElement>('.landing__img');
    imgs.forEach(img => {
      const current = img.getAttribute('src') || img.src;
      img.removeAttribute('src');
      setTimeout(() => img.setAttribute('src', current), 0);
    });
  }

  private setTranslations() {
    this.title = this.translate.instant('PAGES.LANDING.TITLE');
    this.getStarted = this.translate.instant('PAGES.LANDING.GETSTARTED');
    this.whatOffers = this.translate.instant('PAGES.LANDING.WHATOFFERS');
    this.subtitle1 = this.translate.instant('PAGES.LANDING.SUBTITLE1');
    this.text1 = this.translate.instant('PAGES.LANDING.TEXT1');
    this.subtitle2 = this.translate.instant('PAGES.LANDING.SUBTITLE2');
    this.text2 = this.translate.instant('PAGES.LANDING.TEXT2');
    this.subtitle3 = this.translate.instant('PAGES.LANDING.SUBTITLE3');
    this.text3 = this.translate.instant('PAGES.LANDING.TEXT3');

  }
}
