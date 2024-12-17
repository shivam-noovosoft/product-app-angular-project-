import { Component } from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-home',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
