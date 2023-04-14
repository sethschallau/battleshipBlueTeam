import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Game } from '../_models/game';
import { AccountService } from '../_security/account.service';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html'
})
export class NewGameComponent {
  user: User;
  apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient, private router: Router, private accountService: AccountService) {
    let checkUser = this.accountService.currentUserValue;
    if (checkUser) {
      this.user = checkUser;
   }
  }

  submitForm() {
    this.postGame();
  }

  postGame() {
    var httpRequest = this.http.post<Game>(`${this.apiUrl}/games/create`, this.user)
    httpRequest.subscribe(
      returnedGame => {
        console.log(returnedGame);
        this.router.navigateByUrl(`/game/${returnedGame._id}/setships`);

      })
}
}

