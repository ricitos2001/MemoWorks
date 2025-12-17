import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {OptionButtonComponent} from '../../components/shared/option-button/option-button.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommunicationService} from '../../services/shared/communication.service';
import {TaskFormModalComponent} from '../../components/shared/task-form-modal/task-form-modal.component';
import {ToastService} from '../../services/shared/toast.service';
import {Router} from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {FullCalendarModule} from '@fullcalendar/angular';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-calendar',
  imports: [
    OptionButtonComponent,
    FullCalendarModule,
    TaskFormModalComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: '../../../styles/styles.css',
})

export class CalendarComponent implements OnInit {
  @ViewChild('buttons', { static: false }) buttons!: ElementRef;
  @ViewChild(TaskFormModalComponent)
  private taskFormModal!: TaskFormModalComponent;
  status = false;

  private destroyRef = inject(DestroyRef);
  constructor(
    private renderer: Renderer2,
    private communicationService: CommunicationService,
    private toastService: ToastService,
    private router: Router,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {}

  tasks: Task[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    events: [],
    eventClick: (info) => this.viewDetails(Number(info.event.id)),
    eventColor: '#28a745',
    eventTextColor: '#fff',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    dayMaxEvents: true,
  };

  ngOnInit() {
    this.loadTasks();
    this.communicationService.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (!n) return;
        if (n.source === 'taskForm') {
          this.toastService.show({
            type: n.type,
            message: n.message,
            duration: 5000
          });
          this.loadTasks();
        }
      });
  }

  private loadTasks() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    this.taskService.getTasksByUserId(userId).subscribe({
      next: (response: any) => {
        this.tasks = response.content;
        this.cdr.detectChanges();
        this.calendarOptions.events = this.tasks.map(t => ({
          id: t.id.toString(),
          title: t.title,
          date: t.date + 'T' + t.time,
          extendedProps: {
            description: t.description,
            labels: t.labels,
            status: t.status
          },
          color: t.status ? '#28a745' : '#dc3545'
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  createButtons(event: MouseEvent) {
    event.stopPropagation();
    if (!this.status) {
      this.createAddButton();
      this.createEditButton();
      this.createRemoveButton();
      this.status = true;
    } else {
      while (this.buttons.nativeElement.firstChild) {
        this.renderer.removeChild(this.buttons.nativeElement, this.buttons.nativeElement.firstChild);
      }
      this.status = false;
    }
  }

  private createAddButton() {
    const addButton = this.renderer.createElement('img');
    this.renderer.setProperty(addButton, 'src', 'assets/img/File%20plus.svg');
    this.renderer.addClass(addButton, 'addButton');
    this.renderer.listen(addButton, 'click', () => {
      this.taskFormModal.open('addTask');
    });
    this.renderer.appendChild(this.buttons.nativeElement, addButton);

  }

  private createEditButton() {
    const editButton = this.renderer.createElement('img');
    this.renderer.setProperty(editButton, 'src', 'assets/img/Edit%203.svg');
    this.renderer.addClass(editButton, 'editButton');
    this.renderer.listen(editButton, 'click', () => {
      this.router.navigate(['selectTask'], { state: { from: 'calendar' } });
    });
    this.renderer.appendChild(this.buttons.nativeElement, editButton);
  }

  private createRemoveButton() {
    const removeButton = this.renderer.createElement('img');
    this.renderer.setProperty(removeButton, 'src', 'assets/img/File%20minus.svg');
    this.renderer.addClass(removeButton, 'removeButton');
    this.renderer.listen(removeButton, 'click', () => {
      this.router.navigate(['removeTask'], { state: { from: 'calendar' } });
    });
    this.renderer.appendChild(this.buttons.nativeElement, removeButton);
  }

  viewDetails(taskId: number) {
    this.router.navigate(['/task', taskId], { state: { fromCalendar: true } });
  }
}



