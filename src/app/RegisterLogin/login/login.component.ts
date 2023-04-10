import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_security/account.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    returnUrl: string;
    user: User;

    constructor(private route: ActivatedRoute, private router: Router, private accountService: AccountService) {
        if (this.accountService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.initializeUser();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    initializeUser() {
        this.user = new User;
    }

    submitForm() {
        this.accountService.login(this.user).subscribe(
                _ => {
                    this.router.navigate([this.returnUrl]);
                });
    }
}