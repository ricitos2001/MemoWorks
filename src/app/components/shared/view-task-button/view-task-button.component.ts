import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-task-button',
  imports: [],
  templateUrl: './view-task-button.component.html',
  styleUrl: '../../../../styles/styles.css',
})
export class ViewTaskButtonComponent {
  @Output() click = new EventEmitter<Event>();

  onClick(event: Event) {
    this.click.emit(event);
  }
}
