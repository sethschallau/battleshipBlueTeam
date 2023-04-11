import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Game } from '../_models/game';
import { User } from '../_models/user';
import { AccountService } from '../_security/account.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html'
})
export class JoinGameComponent {

  activeGames: Game[];
  user: User;
  apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient, private accountService: AccountService) {
    let checkUser = this.accountService.currentUserValue;
    if (checkUser) {
      this.user = checkUser;
   }
  }
  ngOnInit(): void {
      this.getActiveGames();
  }

  ngOnDestroy() {
}
  
  submitForm() {
    // join game
    // post to /join
    // go to game screen
  }

  getActiveGames() {
    var httpRequest = this.http.get<Game[]>(`${this.apiUrl}/games/active`)
    httpRequest.subscribe(
      returnedGames => {
        console.log(returnedGames);
          this.activeGames = returnedGames;
      })
  }

}
