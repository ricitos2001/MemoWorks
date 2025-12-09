import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {OptionButton} from '../../components/other/option-button/option-button';
import {AddButton} from '../../components/other/add-button/add-button';
import {EditButton} from '../../components/other/edit-button/edit-button';
import {RemoveButton} from '../../components/other/remove-button/remove-button';

@Component({
  selector: 'app-calendar',
  imports: [
    OptionButton
  ],
  templateUrl: './calendar.html',
  styleUrl: '../../../styles/styles.css',
})
export class Calendar {
  @ViewChild('buttons', { read: ViewContainerRef })
  buttons!: ViewContainerRef;

  private visibles = false;

  showOrRemoveOptions() {
    if (!this.visibles) {
      this.buttons.createComponent(AddButton);
      this.buttons.createComponent(EditButton);
      this.buttons.createComponent(RemoveButton);
      this.visibles = true;
    } else {
      this.buttons.clear()
      this.visibles = false;
    }
  }
}
