import {Component, computed, inject, OnInit} from '@angular/core';
import {ButtonComponent} from '../button/button.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {TasksSignalStore} from '../../../stores/tasks.signal.store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-slider',
  imports: [
    ButtonComponent,
    TranslateModule,
  ],
  templateUrl: './slider.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class SliderComponent implements OnInit {
  constructor(private translate: TranslateService) {}
  private tasksSignalStore = inject(TasksSignalStore);
  total = computed(() => this.tasksSignalStore.state().total);
  page = this.tasksSignalStore.page;
  pageSize = this.tasksSignalStore.pageSize;
  nextButton: string = '';
  backButton: string = '';


  ngOnInit(): void {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  nextPage() {
    if (this.page() < this.total()) {
      this.tasksSignalStore.load(this.page() + 1);
    }
  }

  prevPage() {
    if (this.page() > 0) {
      this.tasksSignalStore.load(this.page() - 1);
    }
  }

  private setTranslations() {
    this.nextButton = this.translate.instant('COMPONENTS.SHARED.TASKS.NEXTBUTTON');
    this.backButton = this.translate.instant('COMPONENTS.SHARED.TASKS.BACKBUTTON');
  }
}
