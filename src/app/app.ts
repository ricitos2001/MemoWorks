import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/layout/header/header';
import {Footer} from './components/layout/footer/footer';
import {Main} from './components/layout/main/main';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Main],
  templateUrl: './app.html',
  styleUrl: '../styles/styles.css'
})
export class App {
  protected readonly title = signal('untitled');
}
