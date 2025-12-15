import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { Login } from '../../../pages/login/login';
import { Register } from '../../../pages/register/register';
import { Tabs } from '../../other/tabs/tabs';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, Tabs, Login, Register],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {
  @Output() authSuccess = new EventEmitter<void>();

  isOpen = false;
  activeTab: 'login' | 'register' = 'register';

  open(tab: 'login'|'register' = 'register') {
    this.activeTab = tab;
    this.isOpen = true;
  }

  close() { this.isOpen = false; }

  onChildAuthSuccess() {
    this.close();
    this.authSuccess.emit();
  }

  getTitle() {
    return this.activeTab === 'register' ? 'Registrarse' : 'Iniciar sesión';
  }
}

