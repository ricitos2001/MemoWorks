import {
  ChangeDetectorRef,
  Component, DestroyRef,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {OptionButtonComponent} from '../../components/shared/option-button/option-button.component';
import {TasksComponent} from '../../components/shared/tasks/tasks.component';
import {TaskFormComponent} from '../../components/shared/task-form/task-form.component';
import {NgIf} from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {CommunicationService} from '../../services/shared/communication.service';
import {ToastService} from '../../services/shared/toast.service';
import {ToastComponent} from '../../components/shared/toast/toast.component';

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

  status = false;
  formStatus = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private communicationService: CommunicationService,
    private toastService: ToastService,
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
      this.formStatus = false;
    }
  }

  private createAddButton() {
    const addButton = this.renderer.createElement('img');
    this.renderer.setProperty(addButton, 'src', 'assets/img/File%20plus.svg');
    this.renderer.addClass(addButton, 'addButton');
    this.renderer.listen(addButton, 'click', () => {
      this.formStatus = !this.formStatus;
      this.cd.detectChanges();
    });
    this.renderer.appendChild(this.buttons.nativeElement, addButton);
  }

  private createEditButton() {
    const editButton = this.renderer.createElement('img');
    this.renderer.setProperty(editButton, 'src', 'assets/img/Edit%203.svg');
    this.renderer.addClass(editButton, 'editButton');
    this.renderer.appendChild(this.buttons.nativeElement, editButton);
  }

  private createRemoveButton() {
    const removeButton = this.renderer.createElement('img');
    this.renderer.setProperty(removeButton, 'src', 'assets/img/File%20minus.svg');
    this.renderer.addClass(removeButton, 'removeButton');
    this.renderer.appendChild(this.buttons.nativeElement, removeButton);
  }
}
