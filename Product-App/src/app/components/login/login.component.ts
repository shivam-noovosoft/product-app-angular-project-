import {Component, inject, Inject, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User, UserResponse} from '../../models/users.models';
import {NgOptionComponent, NgSelectComponent} from '@ng-select/ng-select';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule,} from '@angular/forms';
import {Router} from '@angular/router';
import {LoggedUserService} from '../../services/loggedUser.service';
import {ResponseError} from '../../models/users.models'
import {AuthService} from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    NgSelectComponent, NgForOf, NgOptionComponent, FormsModule, NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  users!: User[];
  error!: ResponseError
  router = inject(Router)
  selected!: string

  constructor(
    @Inject(UsersService) private usersService: UsersService,
    private loggedUserService: LoggedUserService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this._fetchUsers()
    this.updateUsers()
  }

  private _fetchUsers() {
    this.usersService.getUsers('users', '').subscribe(
      (value: UserResponse) => this.usersService.allUsers.next(value.users),
    )
  }

  private updateUsers() {
    this.usersService.allUsers.subscribe((users: User[]) => {
      this.users = users;
    })
  }

  showWarning(error: ResponseError) {
    this.error = error
    setTimeout(() => {
      this.error = {error: {message: ''}}
    }, 1000)
  }


  protected login(user: User, password: string) {
    if (user.firstName === 'admin') {
      if (password !== 'admin') {
        this.showWarning({error: {message: 'invalid credentials'}})
        return;
      }
      this.authService.auth = true;
      localStorage.setItem('loggedUserData', JSON.stringify(user))
      this.loggedUserService.set(user)
      void this.router.navigate(['/home'])
      return;
    }
    this.usersService.loginUser(user.username, password).subscribe({
      next: () => {
        this.authService.auth = true;
        this.loggedUserService.set(user)
        localStorage.setItem('loggedUserData', JSON.stringify(user))
        void this.router.navigate(['/home'])
      },
      error: error => this.showWarning(error)
    })
  }

}

























