import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/_security/account.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    returnUrl: string;
    username: string;

    constructor(private route: ActivatedRoute, private router: Router, private accountService: AccountService) {
        if (this.accountService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    submitForm() {
        this.accountService.login(this.username).subscribe(
                _ => {
                    this.router.navigate([this.returnUrl]);
                });
    }
}