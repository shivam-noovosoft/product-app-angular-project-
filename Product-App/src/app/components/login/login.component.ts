import {Component, inject, Inject, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User, UserResponse} from '../../models/users.models';
import {NgOptionComponent, NgSelectComponent} from '@ng-select/ng-select';
import {NgForOf} from '@angular/common';
import {FormControl, FormsModule, NgModel} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {LoggedUserService} from '../../services/loggedUser.service';
import {response} from 'express';
import {log} from 'node:util';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    NgSelectComponent, NgForOf, NgOptionComponent, FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  users!: User[];
  selectedUsers!: any;
  response!:Response
  adminData = {id: 0, firstName: 'admin'}
  router = inject(Router)

  constructor(
    @Inject(UsersService) private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.fetchUsers()
    this.updateUsers()
  }

  private fetchUsers() {
    this.usersService.getUsers('users', '').subscribe(
      (value: UserResponse) => this.usersService.allUsers.next(value.users),
    )
  }

  private updateUsers() {
    this.usersService.allUsers.subscribe((users: User[]) => {
      this.users = users;
    })
  }

  protected login(user:User, password: string) {
    // this.usersService.loginUser(user.username, password).subscribe(response=>
    //   this.response = response

    console.log(response)
    // this.authService.auth=true;
    // localStorage.setItem('loggedUserData',JSON.stringify(user))
    // this.loggedUserService.set(user)
    // this.router.navigate(['/home']).then()
  }

  checkPass(user: User, password: string) {
    console.log(user, password)
    const userData = this.users.find(user => user.id == user.id)
  }

}

























