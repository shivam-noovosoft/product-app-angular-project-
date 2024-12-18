import {Component, inject, Inject, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User, UserResponse} from '../../models/users.models';
import {NgOptionComponent, NgSelectComponent} from '@ng-select/ng-select';
import {NgForOf} from '@angular/common';
import {FormControl, FormsModule, NgModel} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {LoggedUserService} from '../../services/loggedUser.service';

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
  selectedUsers!:any;
  adminData={id:0,firstName:'admin'}
  router=inject(Router)
  constructor(@Inject(UsersService) private usersService: UsersService,
              private authService:AuthService,
              private loggedUserService:LoggedUserService,
  ) {}

  ngOnInit() {
    this.fetchUsers()
    this.updateUsers()
  }

  private fetchUsers() {
    this.usersService.getUsers('users', '').subscribe(
      (value: UserResponse) => this.usersService.allUsers.next(value.users),
    )
  }

  private updateUsers(){
    this.usersService.allUsers.subscribe((users:User[])=>{
      this.users= users;
    })
  }

  protected login(user:any){
    this.authService.auth=true;
    this.loggedUserService.loggedUser.next(user)
    localStorage.setItem('loggedUserData',JSON.stringify(user))
    this.router.navigate(['/home']).then()
  }


}

























