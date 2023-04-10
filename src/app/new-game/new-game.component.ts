import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Game } from '../_models/game';
import { AccountService } from '../_security/account.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html'
})
export class NewGameComponent {
  newGame: Game;
  user: User;
  apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient, private accountService: AccountService) {
    let checkUser = this.accountService.currentUserValue;
    if (checkUser) {
      this.user = checkUser;
   }
  }

  ngOnInit(): void {
      this.initializeGame();
  }

  initializeGame() {
    this.newGame = new Game;
  }

  ngOnDestroy() {
}

  submitForm() {
    this.postGame();
    // wait for player to join...
  }

  postGame() {
    var httpRequest = this.http.post<Game>(`${this.apiUrl}/games/create`, this.user)
    httpRequest.subscribe(
      returnedGame => {
        this.newGame = returnedGame;
      })
}
}

