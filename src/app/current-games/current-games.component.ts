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
  noGames: boolean;
  user: User;
  apiUrl: string = environment.apiUrl

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private boardService: BoardService, 
    accountService: AccountService) {
    let checkUser = accountService.currentUserValue;
    if (checkUser) {
      this.user = checkUser;
   }
  }
  ngOnInit(): void {
      this.getMyGames();
  }

  ngOnDestroy() {
}
  
  openGame(gameId: number) {
    var httpRequest = this.http.get<Game>(`${this.apiUrl}/games/gameId`);
    httpRequest.subscribe(
      returnedGame => {
        if (this.boardService.playerSetShips(returnedGame.ships, this.user.username)) {
          this.router.navigateByUrl(`/game/${gameId}`);
        } else {
          this.router.navigateByUrl(`/game/${gameId}/setships`);
        }
      })
  }

  getMyGames() {
    const params = new HttpParams().append("username", this.user.username);
    var httpRequest = this.http.get<User>(`${environment.apiUrl}/users/user`, {params})
    httpRequest.subscribe(
      returnedUser => {
        this.user = returnedUser;
        this.myGames = returnedUser.games;
        if (this.myGames.length == 0) {
          this.noGames = true;
        } else {
          this.noGames = false;
        }
      })
  }

}
