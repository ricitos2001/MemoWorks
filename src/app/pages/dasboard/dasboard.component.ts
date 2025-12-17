import {
  Component, DestroyRef,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {OptionButtonComponent} from '../../components/shared/option-button/option-button.component';
import {TasksComponent} from '../../components/shared/tasks/tasks.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {CommunicationService} from '../../services/shared/communication.service';
import {ToastService} from '../../services/shared/toast.service';
import {TaskFormModalComponent} from '../../components/shared/task-form-modal/task-form-modal.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dasboard',
  imports: [
    OptionButtonComponent,
    TasksComponent,
    TaskFormModalComponent,
  ],
  templateUrl: './dasboard.component.html',
  styleUrl: '../../../styles/styles.css',
})

export class DasboardComponent implements OnInit {
  @ViewChild('buttons', { static: false }) buttons!: ElementRef;
  @ViewChild(TaskFormModalComponent)
  private taskFormModal!: TaskFormModalComponent;
  status = false;

  private destroyRef = inject(DestroyRef);
  constructor(
    private renderer: Renderer2,
    private communicationService: CommunicationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
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
        }
      });
  }

  onCreateFromEmpty() {
    if (this.taskFormModal) {
      this.taskFormModal.open('addTask');
    }
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
    this.renderer.setAttribute(addButton, 'alt', 'Agregar tarea');
    this.renderer.setAttribute(addButton, 'title', 'Agregar tarea');
    this.renderer.setAttribute(addButton, 'aria-label', 'Agregar tarea');
    this.renderer.setAttribute(addButton, 'role', 'button');
    this.renderer.setAttribute(addButton, 'tabindex', '0');
    this.renderer.listen(addButton, 'click', () => {
        this.taskFormModal.open('addTask');
    });
    this.renderer.listen(addButton, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.taskFormModal.open('addTask');
      }
    });
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
    this.renderer.listen(editButton, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.router.navigate(['selectTask'], { state: { from: 'dashboard' } });
      }
    });

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
    this.renderer.listen(removeButton, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.router.navigate(['removeTask'], { state: { from: 'dashboard' } });
      }
    });
    this.renderer.appendChild(this.buttons.nativeElement, removeButton);
  }
}
