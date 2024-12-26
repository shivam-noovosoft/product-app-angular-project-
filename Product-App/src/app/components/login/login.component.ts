import {Component, OnInit} from '@angular/core';
import {ResponseError, User, UserResponse} from '../../models/users.models';
import {NgOptionComponent, NgSelectComponent} from '@ng-select/ng-select';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule,} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {GuardService} from '../../services/guard.service';
import {UserService} from '../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    NgSelectComponent, NgForOf, NgOptionComponent, FormsModule, NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  users!: User[];
  responseError!: ResponseError
  selected!: string

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private guardService: GuardService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this._fetchUsers();
  }

  private _fetchUsers() {
    this.userService.getUsers().subscribe(
      (value: UserResponse) => this.userService.allUsers.next(value.users),
    )
    this.userService.allUsers.subscribe((users: User[]) => {
      this.users = users;
    })

  }

  protected showWarning(error: ResponseError) {
    this.responseError = error
  }

  protected login(user: User, password: string) {

    this.authService.loginUser(user.username, password).subscribe({
      next: () => {
        this.guardService.isGuardActive = true;
        // this.authService.isUserLoggedIn=true
        this.userService.set(user)
        localStorage.setItem('loggedUserData', JSON.stringify(user))
        void this.router.navigate(['products'])
      },
      error: error => this.showWarning(error)
    })

  }

}

























