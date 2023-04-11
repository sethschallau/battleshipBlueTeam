import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from './_models/user';
import { AccountService } from './_security/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'battleship';
  currentUser: User | null;
  loginPage: boolean

  constructor(
      private router: Router,
      private accountService: AccountService
  ) {
      this.accountService.currentUser.subscribe(x => this.currentUser = x);
      this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
              if (event.url.includes('/login')) {
                  this.loginPage = true;
              } else {
                  this.loginPage = false;
              }
          }
      });
  }

  logout() {
      this.accountService.logout();
      this.router.navigate(['/login']);
  }
 
}