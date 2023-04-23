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
import { User } from '../_models/user';
import { io } from 'socket.io-client';

const NUM_PLAYERS: number = 2;
// TODO: number of tiles containing ships 

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
  user: User;
  username: string;
  result: string;
  winningUser: string;
  socket: any;
  constructor(
    private toastr: ToastrService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private accountService: AccountService
  ) {
    let checkUser = this.accountService.currentUserValue;
    if (checkUser) {
      this.user = checkUser;
      this.username = this.user.username;
   }
   this.socket = io(environment.apiUrl);

  }

ngOnInit(): void {
  this.idParamSubscription = this.route.params.subscribe(
    params => {
      this.getGame(params['id'])
    }
  );

  // Add the following block inside ngOnInit()
  this.socket.on('gameData', (gameData: Game) => {
    if (gameData) {
      this.game = gameData;
      this.gameId = this.game._id;
      this.players = this.game.players.length;
      this.updateCurrentPlayer();
      this.createBoards();
    }
  });
  this.socket.on('gameData', (gameData: Game) => {
    if (gameData) {
      this.game = gameData;
      this.gameId = this.game._id;
      this.players = this.game.players.length;
      this.updateCurrentPlayer();
      for (const player of this.game.players) {
        this.boardService.createBoard(player, this.game, this.username);
      }
    }
  });
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
    this.postMissle(row, col)

    if (tile.ship) {
      this.toastr.success("Hit!");
      this.boards[boardId].tiles[row][col].status = 'win';
      this.boards[this.player].player.hits++;
    } else {
      this.toastr.info("Miss!");
      this.boards[boardId].tiles[row][col].status = 'fail'
      this.boards[this.player].player.misses++;
    }
    this.canPlay = false;
    this.boards[boardId].tiles[row][col].shot = true;

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

  createBoards(): GameComponent {
    this.boardService.createBoard(this.user, this.game, this.username);
    for (let p of this.game.players) {
      if (!p.username.includes(this.username)) {
        this.boardService.createBoard(p, this.game, this.username);
      }
    }
  
    return this;
  }

  get winner () : Board | undefined{
    return this.boards.find(board => board.player.username.includes(this.winningUser));
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
                this.gameId = this.game._id;
                this.players = this.game.players.length;
                this.updateCurrentPlayer();
                this.createBoards();
            })
  }

  postMissle(row: number, col: number) {
    const body = { gameId: this.gameId, username: this.username, coordinate: { x: row, y: col }};
    var httpRequest = this.http.post<any>(`${this.apiUrl}/games/sendMissile`, body);
    httpRequest.subscribe(
      returned => {
        this.result = returned.result;
        if (this.result.includes("win")) {
          this.winningUser = this.username;
        }
      },
      error => {
        // handle error
      },
      () => {
        this.socket.emit('missileSent', this.gameId);
      }
    );
  }

  updateCurrentPlayer(): void {
    if (this.game.currentPlayer.includes(this.username)) {
      this.canPlay = true;
    } else {
      this.canPlay = false;
    }
  }

}