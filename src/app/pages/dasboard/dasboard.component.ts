import {
  ChangeDetectorRef,
  Component, DestroyRef,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {OptionButtonComponent} from '../../components/other/option-button/option-button.component';
import {TasksComponent} from '../../components/other/tasks/tasks.component';
import {TaskFormComponent} from '../../components/shared/task-form/task-form.component';
import {NgIf} from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {CommunicationService} from '../../services/shared/communication.service';
import {ToastService} from '../../services/shared/toast.service';
import {ToastComponent} from '../../components/other/toast/toast.component';

@Component({
  selector: 'app-dasboard',
  imports: [
    OptionButtonComponent,
    TasksComponent,
    TaskFormComponent,
    ToastComponent,
    NgIf,
  ],
  templateUrl: './dasboard.component.html',
  styleUrl: '../../../styles/styles.css',
})

export class DasboardComponent implements OnInit {

  @ViewChild('buttons', { static: false }) buttons!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private communicationService: CommunicationService,
    private toastService: ToastService
  ) {}

  status = false
  formStatus = false

  createButtons(event: MouseEvent) {
    console.log('Botón clickeado');
    event.stopPropagation();
    console.log('Click manejado sin burbuja');
    if (!this.status) {
      this.createAddButton()
      this.status = true;
    } else {
      const firstChild = this.buttons.nativeElement.firstChild;
      if (firstChild) {
        this.renderer.removeChild(this.buttons.nativeElement, firstChild);
        this.status = false;
        this.formStatus = false;
      }
    }
  }

  createAddButton() {
    const addButton = this.renderer.createElement('button');
    this.renderer.setProperty(addButton, 'innerText', 'agregar tarea');
    this.renderer.setStyle(addButton, 'backgroundColor', '#341A38');
    this.renderer.setStyle(addButton, 'border-radius', '0.25rem');
    this.renderer.setStyle(addButton, 'position', 'fixed');
    this.renderer.setStyle(addButton, 'right', '6rem');
    this.renderer.setStyle(addButton, 'bottom', '27rem');
    this.renderer.listen(addButton, 'click', (event) => {
      this.formStatus = !this.formStatus;
      this.cd.detectChanges()
    })
    this.renderer.appendChild(this.buttons.nativeElement, addButton);
  }

  createEditButton() {
    const editButton = this.renderer.createElement('button');
    this.renderer.setProperty(editButton, 'innerText', 'editar tarea');
    this.renderer.setStyle(editButton, 'backgroundColor', '#341A38');
    this.renderer.setStyle(editButton, 'border-radius', '0.25rem');
    this.renderer.setStyle(editButton, 'position', 'fixed');
    this.renderer.setStyle(editButton, 'right', '6rem');
    this.renderer.setStyle(editButton, 'bottom', '21rem');
    this.renderer.setStyle(editButton, 'border-radius', '0.25rem');
    this.renderer.appendChild(this.buttons.nativeElement, editButton);
  }

  createRemoveButton() {
    const removeButton = this.renderer.createElement('button');
    this.renderer.setProperty(removeButton, 'innerText', 'eliminar tarea');
    this.renderer.setStyle(removeButton, 'backgroundColor', '#341A38');
    this.renderer.setStyle(removeButton, 'border-radius', '0.25rem');
    this.renderer.setStyle(removeButton, 'position', 'fixed');
    this.renderer.setStyle(removeButton, 'right', '6rem');
    this.renderer.setStyle(removeButton, 'bottom', '15rem');
    this.renderer.appendChild(this.buttons.nativeElement, removeButton);
  }

  private destroyRef = inject(DestroyRef);

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
}
