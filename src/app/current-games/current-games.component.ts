import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Game } from '../_models/game';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { BoardService } from '../game/board-service.service';
import { AccountService } from '../_security/account.service';

@Component({
  selector: 'app-current-games',
  templateUrl: './current-games.component.html',
  providers: [BoardService]
})
export class CurrentGamesComponent {
  myGames: Game[];
  user: User;
  username: string;
  apiUrl: string = environment.apiUrl

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private boardService: BoardService, 
    accountService: AccountService) {
    let checkUser = accountService.currentUserValue;
    if (checkUser) {
      this.username = checkUser.username;
   }
  }
  ngOnInit(): void {
      this.getMyGames();
  }

  ngOnDestroy() {
}
  
  openGame(gameId: string) {
    for (let g of this.myGames) {
      if (g._id.includes(gameId)) {
        if (this.boardService.playerSetShips(g.ships, this.user.username)) {
          this.router.navigateByUrl(`/game/${gameId}`);
        } else {
          this.router.navigateByUrl(`/game/${gameId}/setships`);
        }
      }
    }
  }

  getMyGames() {
    this.myGames = [];
    const params = new HttpParams().append("username", this.username);
    this.http.get<User>(`${environment.apiUrl}/users/user`, {params})
    .subscribe(
      returnedUser => {
          this.user = returnedUser;
          let gameIds = returnedUser.games;
          if (gameIds.length != 0)
          {
            for (let gameId of gameIds) {
              this.gameIdToObject(gameId)
              .subscribe({
                next: (returnedGame) => {
                  if (!returnedGame.status.includes("completed")) {
                    this.myGames.push(returnedGame);
                  }
                },
                error: (err) => {throw Error(err);}
            });
          }
        }
      })
  }

  gameIdToObject(gameId: string) {
      return this.http.get<Game>(`${this.apiUrl}/games/${gameId}`);
  }

  otherPlayer(players: User[]) {
    for (let player of players) {
      if (player.username != this.username) {
        return player.username;
      }
    }
    return "Waiting for another player to join..."
  }

}
