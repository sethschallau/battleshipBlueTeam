import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_security/account.service';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {

    user: User;
    
    constructor(private router: Router, private accountService: AccountService) { 

    }

    ngOnInit() {
        this.initializeUser();
    }
    initializeUser() {
        this.user = new User;
    }

    onSubmit() {
        this.accountService.register(this.user.username)
            .pipe(first())
            .subscribe(
                _ => {
                    this.router.navigate(['/login']);
                });
    }
}
