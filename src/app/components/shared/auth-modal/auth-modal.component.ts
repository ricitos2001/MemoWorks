import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { LoginComponent } from '../../../pages/login/login.component';
import { RegisterComponent } from '../../../pages/register/register.component';
import { TabsComponent } from '../tabs/tabs.component';
import {AuthModalService} from '../../../services/shared/auth-modal.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, TabsComponent, LoginComponent, RegisterComponent],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['../../../../styles/styles.css']
})
export class AuthModalComponent implements OnInit{
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

  constructor(private authModalService: AuthModalService) {}

  ngOnInit() {
    this.authModalService.openModal$.subscribe(tab => {
      this.open(tab);
    });
  }

}

