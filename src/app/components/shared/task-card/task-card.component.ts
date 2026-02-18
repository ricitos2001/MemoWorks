import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Task} from '../../../services/task.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe, NgIf, NgForOf, TranslateModule, RouterLink],
  templateUrl: './task-card.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class TaskCardComponent implements OnInit {

  backButton = ''
  task = signal<Task | null>(null);
  private route = inject(ActivatedRoute);

  constructor(private translate: TranslateService) {
    this.route.data.subscribe(({ task }) => {
      this.task.set(task);
    });
  }

  formatTime(timeStr: string): Date | null {
    if (!timeStr) return null;

    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, 0, 0);
    return date;
  }

  ngOnInit() {
    this.setTranslations();
    this.translate.onLangChange.subscribe(() => this.setTranslations());
  }

  private setTranslations() {
    this.backButton = this.translate.instant('COMPONENTS.SHARED.BACKBUTTON');
  }
}
