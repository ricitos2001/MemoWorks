import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-shared-bar',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './shared-bar.component.html',
  styleUrl: '../../../../styles/styles.css'
})

export class SharedBarComponent {
  searchControl = new FormControl('');
  search$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  )
}
