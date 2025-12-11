import {ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {OptionButton} from '../../components/other/option-button/option-button';
import {AddButton} from '../../components/other/add-button/add-button';
import {EditButton} from '../../components/other/edit-button/edit-button';
import {RemoveButton} from '../../components/other/remove-button/remove-button';
import {Tasks} from '../../components/other/tasks/tasks';
import {TaskForm} from '../../components/shared/task-form/task-form';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-dasboard',
  imports: [
    OptionButton,
    Tasks,
    TaskForm,
    NgIf,
  ],
  templateUrl: './dasboard.html',
  styleUrl: '../../../styles/styles.css',
})
export class Dasboard {

  @ViewChild('buttons', { static: false }) buttons!: ElementRef;

  constructor(private renderer: Renderer2, private cd: ChangeDetectorRef) {}

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
}
