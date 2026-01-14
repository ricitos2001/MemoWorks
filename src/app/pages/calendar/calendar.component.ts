import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
  effect, OnDestroy
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
import {TasksSignalStore} from '../../stores/tasks.signal.store';

@Component({
  selector: 'app-calendar',
  imports: [
    OptionButtonComponent,
    FullCalendarModule,
    TaskFormModalComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['../../../styles/styles.css'],
  standalone: true
})
export class CalendarComponent implements OnInit, OnDestroy{
  @ViewChild('buttons', { static: false }) buttons!: ElementRef;
  @ViewChild(TaskFormModalComponent)
  private taskFormModal!: TaskFormModalComponent;
  // Almacena funciones de eliminación de listeners para limpiar al desmontar elementos dinámicos
  private dynamicListeners: (() => void)[] = [];

  status = false;
  private destroyRef = inject(DestroyRef);
  private renderer = inject(Renderer2);
  private comm = inject(CommunicationService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private tasksSignalStore = inject(TasksSignalStore);

  email = localStorage.getItem('email');

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    firstDay: 1,
    dayHeaderFormat: { weekday: 'long' },
    events: [],
    eventClick: (info) => this.viewDetails(Number(info.event.id)),
    eventColor: '#4E2754',
    eventTextColor: '#FEFBEC',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    dayMaxEvents: true
  };

  constructor() {
    effect(() => {
      const tasks = this.tasksSignalStore.state().data;
      this.calendarOptions.events = tasks.map(t => ({
        id: t.id.toString(),
        title: t.title,
        date: `${t.date}T${t.time}`,
        extendedProps: {
          description: t.description,
          labels: t.labels,
          status: t.status
        }
      }));
    });
  }

  ngOnInit() {
    this.tasksSignalStore.loadAll();
    this.comm.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (!n) return;
        if (n.source === 'taskForm') {
          this.toastService.show({
            type: n.type,
            message: n.message,
            duration: 5000
          });
          this.tasksSignalStore.loadAll();
        }
      });
  }

  ngOnDestroy() {
    this.dynamicListeners.forEach(unreg => { try { unreg(); } catch(e) { /* ignore */ } });
    this.dynamicListeners = [];
  }

  createButtons(event: MouseEvent) {
    event.stopPropagation();
    if (!this.status) {
      this.createAddButton();
      this.createEditButton();
      this.createRemoveButton();
      this.status = true;
    } else {
      this.dynamicListeners.forEach(unreg => { try { unreg(); } catch(e) { /* ignore */ } });
      this.dynamicListeners = [];
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
    this.renderer.setAttribute(addButton, 'alt', 'Agregar tarea');
    this.renderer.setAttribute(addButton, 'title', 'Agregar tarea');
    this.renderer.setAttribute(addButton, 'aria-label', 'Agregar tarea');
    this.renderer.setAttribute(addButton, 'role', 'button');
    this.renderer.setAttribute(addButton, 'tabindex', '0');
    this.renderer.listen(addButton, 'click', () => {
      this.taskFormModal.open('addTask');
    });
    const un1 = this.renderer.listen(addButton, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.taskFormModal.open('addTask');
      }
    });
    this.dynamicListeners.push(un1);
    this.renderer.appendChild(this.buttons.nativeElement, addButton);
  }

  private createEditButton() {
    const editButton = this.renderer.createElement('img');
    this.renderer.setProperty(editButton, 'src', 'assets/img/Edit%203.svg');
    this.renderer.addClass(editButton, 'editButton');
    this.renderer.setAttribute(editButton, 'alt', 'Editar tarea');
    this.renderer.setAttribute(editButton, 'title', 'Editar tarea');
    this.renderer.setAttribute(editButton, 'aria-label', 'Editar tarea');
    this.renderer.setAttribute(editButton, 'role', 'button');
    this.renderer.setAttribute(editButton, 'tabindex', '0');
    this.renderer.listen(editButton, 'click', () => {
      this.router.navigate(['selectTask'], { state: { from: 'dashboard' } });
    });
    const un2 = this.renderer.listen(editButton, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.router.navigate(['selectTask'], { state: { from: 'dashboard' } });
      }
    });
    this.dynamicListeners.push(un2);
    this.renderer.appendChild(this.buttons.nativeElement, editButton);
  }

  private createRemoveButton() {
    const removeButton = this.renderer.createElement('img');
    this.renderer.setProperty(removeButton, 'src', 'assets/img/File%20minus.svg');
    this.renderer.addClass(removeButton, 'removeButton');
    this.renderer.setAttribute(removeButton, 'alt', 'Eliminar tarea');
    this.renderer.setAttribute(removeButton, 'title', 'Eliminar tarea');
    this.renderer.setAttribute(removeButton, 'aria-label', 'Eliminar tarea');
    this.renderer.setAttribute(removeButton, 'role', 'button');
    this.renderer.setAttribute(removeButton, 'tabindex', '0');
    this.renderer.listen(removeButton, 'click', () => {
      this.router.navigate(['removeTask'], { state: { from: 'dashboard' } });
    });
    const un3 = this.renderer.listen(removeButton, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.router.navigate(['removeTask'], { state: { from: 'dashboard' } });
      }
    });
    this.dynamicListeners.push(un3);
    this.renderer.appendChild(this.buttons.nativeElement, removeButton);
  }

  viewDetails(taskId: number) {
    this.router.navigate(['/task', taskId], { state: { fromCalendar: true } });
  }
}
