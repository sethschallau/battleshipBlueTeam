import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Game } from '../_models/game';
import { User } from '../_models/user';
import { AccountService } from '../_security/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html'
})
export class JoinGameComponent {

  activeGames: Game[];
  filteredGames: Game[];
  noGames: boolean;
  user: User;
  apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient, private router: Router, private accountService: AccountService) {
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
  
  joinGame(gameId: number) {
    var httpRequest = this.http.post<Game>(`${this.apiUrl}/games/join`, { gameId: gameId, username: this.user.username })
    httpRequest.subscribe(
      returnedGame => {
        this.router.navigateByUrl(`/game/${gameId}/setships`);
      })
  }

  getActiveGames() {
    var httpRequest = this.http.get<Game[]>(`${this.apiUrl}/games/active`)
    httpRequest.subscribe(
      returnedGames => {
        this.filterGames(returnedGames);
      })
  }

  filterGames(games: Game[]) {
    let filteredGames = [];
    for (let game of games) {
      if (game.players.length < 2 && game.players[0].username != this.user.username) {
        filteredGames.push(game);
      }
    }
    if (filteredGames.length == 0) {
      this.noGames = true;
    } else {
      this.noGames = false;
    }

    this.activeGames = filteredGames;
  }

}
