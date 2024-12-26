import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NgIf} from '@angular/common';
import {GuardService} from './services/guard.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(protected guardService: GuardService) {
  }

}

