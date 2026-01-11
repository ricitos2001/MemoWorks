import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-shared-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './shared-bar.component.html',
  styleUrl: '../../../../styles/styles.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedBarComponent {

  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');
  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.search.emit(String(value ?? ''));
      });

  }
}
