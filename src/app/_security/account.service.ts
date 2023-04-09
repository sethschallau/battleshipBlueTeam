import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment'
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    username: string;

    constructor(private http: HttpClient) {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user));
        } else {
            this.currentUserSubject = new BehaviorSubject<User>(null as any);
        }
        this.currentUser = this.currentUserSubject.asObservable();

    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/create`, user);
    }

    login(username: string) {
        return this.http.get<User>(`${environment.apiUrl}/users`)
            .pipe(map(user => {
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    this.username = username;
                }
                return user;
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');

        // update the user object
        this.currentUserSubject.next(null as any);
    }
}
