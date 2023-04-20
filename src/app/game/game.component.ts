import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/app/game/board-service.service';
import { Board } from 'src/app/game/board/board.component';
import { Tile } from './tile/tile.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../_models/game';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccountService } from '../_security/account.service';

const NUM_PLAYERS: number = 2;
// TODO: number of tiles containing ships 
const WIN: number = 10;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  providers: [BoardService]
})
export class GameComponent {
  idParamSubscription: Subscription;
  apiUrl: string = environment.apiUrl
  canPlay: boolean = false;
  player: number = 0;
  players: number = 0;
  gameId: string;
  game: Game;
  username: string;

  constructor(
    private toastr: ToastrService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private accountService: AccountService
  ) {
    let checkUser = this.accountService.currentUserValue;
    if (checkUser) {
      this.username = checkUser.username;
   }
    this.createBoards();
  }

  ngOnInit(): void {
    this.idParamSubscription = this.route.params.subscribe(
        params => {
          this.getGame(params['id'])
        }
    )
}

ngOnDestroy() {
    this.idParamSubscription.unsubscribe();
}
  // event handler for click event on
  // each tile - fires torpedo at selected tile
  fireTorpedo(e:any) {
    let id = e.target.id,
      boardId: number = parseInt(id.substring(1,2)),
      row: number = parseInt(id.substring(2,3)), col: number = parseInt(id.substring(3,4)),
      tile: Tile = this.boards[boardId].tiles[row][col];
    if (!this.checkValidHit(boardId, tile)) {
      return;
    }

    if (tile.ship) {
      this.toastr.success("You sank a ship!");
      this.boards[boardId].tiles[row][col].status = 'win';
      this.boards[this.player].player.hits++;
    } else {
      this.toastr.info("Miss!");
      this.boards[boardId].tiles[row][col].status = 'fail'
      this.boards[this.player].player.misses++;
    }
    this.canPlay = false;
    this.boards[boardId].tiles[row][col].shot = true;
    if (!this.postMissle(row, col)) {
      throw Error("Couldn't send missle");
    }
    return this;
  }

  checkValidHit(boardId: number, tile: Tile) : boolean {
    if (boardId == this.player) {
      this.toastr.error("You can't hit your own board.")
      return false;
    }
    if (this.winner) {
      this.toastr.error("Game is over");
      return false;
    }
    if (!this.canPlay) {
      this.toastr.error("It's not your turn to play.");
      return false;
    }
    if(tile.shot) {
      this.toastr.error("You already shot here.");
      return false;
    }
    return true;
  }

  createBoards() : GameComponent {
    for (let i = 0; i < NUM_PLAYERS; i++)
      this.boardService.createBoard(this.game.players[i].username);
    return this;
  }

  // winner property to determine if a user has won the game.
  // once a user gets a score higher than the size of the game
  // board, he has won.
  get winner () : Board | undefined{
    return this.boards.find(board => board.player.hits >= WIN);
  }

  // get all boards and assign to boards property
  get boards () : Board[] {
    return this.boardService.getBoards()
  }

  get validPlayer(): boolean {
    return (this.players >= NUM_PLAYERS) && (this.player < NUM_PLAYERS);
  }

  getGame(id: number) {
    var httpRequest = this.http.get<Game>(`${this.apiUrl}/games/${id}`)

        httpRequest.subscribe(
            returnedGame => {
                this.game = returnedGame;
            })
  }

  postMissle( row: number, col: number ): boolean {
    const body = { gameId: this.gameId, username: this.username, coordinate: { x: row, y: col }};
    var httpRequest = this.http.post<any>(`${this.apiUrl}/games/sendMissle`, body);
    httpRequest.subscribe(
      _ => {
        return true;
      }
    )
    return false;
  }

  }
