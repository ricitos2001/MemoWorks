import { Component } from '@angular/core';
import {ToastService} from '../../../services/shared/toast.service';
import {Toast} from '../../other/toast/toast';
import {Spinner} from '../../other/spinner/spinner';
import {UserList} from '../../other/user-list/user-list';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    Toast,
    Spinner,
    UserList
  ],
  templateUrl: './main.html',
  styleUrl: '../../../../styles/styles.css',
})
export class Main {
  constructor(private toastService: ToastService) {}

  notify() {
    this.toastService.success('Guardado correctamente');
    this.toastService.info('Guardado correctamente');
    this.toastService.warning('Deseas guardado correctamente');
    this.toastService.error('Fallo en la validación', 0);
  }
}
