import {Component, EventEmitter, Output} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {AddTaskComponent} from '../../../pages/add-task/add-task.component';
import {ButtonComponent} from '../button/button.component';

@Component({
  selector: 'app-form-modal',
  imports: [
    ModalComponent,
    AddTaskComponent,
    ButtonComponent,
  ],
  templateUrl: './task-form-modal.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class TaskFormModalComponent {
  @Output() authSuccess = new EventEmitter<void>();

  isOpen = false;
  activeTab: 'addTask' | 'editTask' = 'editTask';

  open(tab: 'addTask'|'editTask' = 'editTask') {
    this.activeTab = tab;
    this.isOpen = true;
  }

  close() { this.isOpen = false; }

  getTitle() {
    return this.activeTab === 'editTask' ? 'editar tarea' : 'agregar tarea';
  }
}
