import {Component, DestroyRef, inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {OptionButtonComponent} from '../../components/other/option-button/option-button.component';
import {AddButtonComponent} from '../../components/other/add-button/add-button.component';
import {EditButtonComponent} from '../../components/other/edit-button/edit-button.component';
import {RemoveButtonComponent} from '../../components/other/remove-button/remove-button.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommunicationService} from '../../services/shared/communication.service';

@Component({
  selector: 'app-calendar',
  imports: [
    OptionButtonComponent
  ],
  templateUrl: './calendarcomponent.html',
  styleUrl: '../../../styles/styles.css',
})
export class Calendarcomponent implements OnInit {
  constructor(private communicationService: CommunicationService) {
  }

  @ViewChild('buttons', { read: ViewContainerRef })
  buttons!: ViewContainerRef;

  private visibles = false;

  showOrRemoveOptions() {
    if (!this.visibles) {
      this.buttons.createComponent(AddButtonComponent);
      this.buttons.createComponent(EditButtonComponent);
      this.buttons.createComponent(RemoveButtonComponent);
      this.visibles = true;
    } else {
      this.buttons.clear()
      this.visibles = false;
    }
  }

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.communicationService.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        if (n) {
          console.log('Recibido:', n);
        }
      });
  }
}
