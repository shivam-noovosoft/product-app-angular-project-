import {Component,OnInit} from '@angular/core';
import {User, UserResponse} from '../../models/users.models';
import {NgOptionComponent, NgSelectComponent} from '@ng-select/ng-select';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule,} from '@angular/forms';
import {Router} from '@angular/router';
import {LoggedUserService} from '../../services/loggedUser.service';
import {ResponseError} from '../../models/users.models'
import {UserAuthService} from '../../services/auth.service';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    NgSelectComponent, NgForOf, NgOptionComponent, FormsModule, NgIf, NavbarComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  users!: User[];
  responseError!: ResponseError
  selected!: string
  isLoggedIn:boolean=false;

  constructor(
    private loggedUserService: LoggedUserService,
    private userAuthService: UserAuthService,
    private router:Router
  ) {
  }

  ngOnInit() {
    this._fetchUsers();
  }

  private _fetchUsers(){
    this.userAuthService.getUsers().subscribe(
      (value: UserResponse) => this.userAuthService.allUsers.next(value.users),
    )
    this.userAuthService.allUsers.subscribe((users: User[]) => {
      this.users = users;
    })

  }

  protected showWarning(error: ResponseError) {
    this.responseError = error
  }

  protected login(user: User, password: string) {
    if (user.firstName === 'admin') {
      if (password !== 'admin') {
        this.showWarning({error: {message: 'invalid credentials'}})
        return;
      }
      this.userAuthService.userAuth = true;
      localStorage.setItem('loggedUserData', JSON.stringify(user))
      this.loggedUserService.set(user)
      void this.router.navigate(['/products'])
      return;
    }
    this.userAuthService.loginUser(user.username, password).subscribe({
      next: () => {
        this.userAuthService.userAuth = true;
        this.loggedUserService.set(user)
        localStorage.setItem('loggedUserData', JSON.stringify(user))
        void this.router.navigate(['/products'])
      },
      error: error => this.showWarning(error)
    })
  }

}

























