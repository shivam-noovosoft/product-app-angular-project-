import {Component, inject, Inject, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User, Users} from '../../models/users.models';
import {NgOptionComponent, NgSelectComponent} from '@ng-select/ng-select';
import {NgForOf} from '@angular/common';
import {FormControl, FormsModule, NgModel} from '@angular/forms';
import {Router} from '@angular/router';

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
  router=inject(Router)
  constructor(@Inject(UsersService) private usersService: UsersService) {
  }

  ngOnInit() {
    this.fetchUsers()
    this.updateUsers()
  }

  private fetchUsers() {
    this.usersService.getUsers('users', '').subscribe(
      (value: User) => this.usersService.allUsers.next(value),
    )
  }

  private updateUsers(){
    this.usersService.allUsers.subscribe(users=>{
      this.users= users['users'];
    })
  }

  protected login(user:any){
    this.router.navigate([`/products/${user}`]).then()
  }

}

























