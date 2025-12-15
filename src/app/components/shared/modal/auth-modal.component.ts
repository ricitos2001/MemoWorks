import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { LoginComponent } from '../../../pages/login/login.component';
import { RegisterComponent } from '../../../pages/register/register.component';
import { TabsComponent } from '../../other/tabs/tabs.component';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, TabsComponent, LoginComponent, RegisterComponent],
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

