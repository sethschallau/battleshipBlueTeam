import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Ship } from 'src/app/_models/ship';
import { BoardService } from 'src/app/game/board-service.service';
import { Board } from 'src/app/game/board/board.component';
import { Tile } from '../tile/tile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/_models/game';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_security/account.service';
import { User } from 'src/app/_models/user';

// TODO: number of tiles containing ships 
const BOARD_SIZE = 10;

@Component({
  selector: 'app-set-ships',
  templateUrl: './set-ships.component.html',
  providers: [BoardService]
})

export class SetShipsComponent {
  idParamSubscription: Subscription;
  apiUrl: string = environment.apiUrl
  canPlay: boolean = false;
  setShips: boolean = true;
  player: number = 0;
  players: number = 0;
  gameId: string;
  dropdown: boolean = false;
  remainingShips: Ship[];
  finished: boolean;
  game: Game;
  user: User;

  constructor(
    private toastr: ToastrService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private accountService: AccountService
  ) {
    let checkUser = this.accountService.currentUserValue;
    if (checkUser) {
      this.user = checkUser;
   }
    this.createBoard();
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

  placeShip(e:any) {
    let id = e.target.id,
      row: number = parseInt(id.substring(1,2)), col: number = parseInt(id.substring(2,3)),
      shipSize: number = parseInt(id.substring(3,4)),
      direction: string = id.substring(4,5),
      shipName: string = id.substring(5),
      tile: Tile = this.board.tiles[row][col];
      if (!this.checkValidShipPlacement(tile, shipSize, direction)) {
        return;
      }
      switch (direction) {
        case('r'):
          for (let i = col; i <= (shipSize + col); i++) {
            this.board.tiles[row][i].ship = true;
          }
        break;
        case('l'):
          for (let i = col; i > (col - shipSize); i--) {
            this.board.tiles[row][i].ship = true;
          }
        break;
        case('d'):
          for (let i = row; i <= (shipSize + row); i++) {
            this.board.tiles[i][col].ship = true;
          }
        break;
        case('u'):
          for (let i = row; i > (row - shipSize); i--) {
            this.board.tiles[i][col].ship = true;
          }
        break;
      }
      // send information to backend
      for (let i = 0; i < this.remainingShips.length; i++) {
        if (this.remainingShips[i].type.includes(shipName)) {
          this.remainingShips.splice(i, 1);
          break;
        }
      }
      
      if (this.remainingShips.length == 0) {
        this.finished = true;
      }
  }

  checkValidShipPlacement(tile: Tile, shipSize: number, direction: string) : boolean {
    let col = tile.col;
    let row = tile.row;

    if(tile.ship) {
      this.toastr.error("You've already placed a ship here!");
      return false;
    }
    switch(direction) {

    case('r'):
      for (let i = col; i <= (shipSize + col); i++) {
        if (tile.col + shipSize > BOARD_SIZE) {
          this.toastr.error("Too close to the edge!");
        }
        if (this.board.tiles[row][i].ship = true) {
          this.toastr.error("Can't overlap other ships!")
        }
      }
      break;
    case('l'):
      for (let i = col; i > (col - shipSize); i--) {
        if (tile.col - shipSize < 0) {
          this.toastr.error("Too close to the edge!");
        }
        if (this.board.tiles[row][i].ship = true) {
          this.toastr.error("Can't overlap other ships!");
        }
      }
      break;
    case('d'):
      for (let i = row; i <= (shipSize + row); i++) {
        if (tile.row + shipSize > BOARD_SIZE) {
          this.toastr.error("Too close to the edge!");
          }
        if (this.board.tiles[i][col].ship = true) {
          this.toastr.error("Can't overlap other ships!");
        }      
      }
      break;
    case('u'):
      for (let i = row; i > (row - shipSize); i--) {
        if (tile.row - shipSize < 0) {
          this.toastr.error("Too close to the edge!");
          }
        if (this.board.tiles[i][col].ship = true) {
          this.toastr.error("Can't overlap other ships!");
        }
      }
      break;
    }

    return true;
  }

  openDropdown() {
    this.dropdown = true;
  }

  createBoard() : SetShipsComponent {
      this.boardService.createBoard(this.user.username);
    return this;
  }

  // get all boards and assign to boards property
  get board () : Board {
    return this.boardService.getBoards()[0];
  }

  setRemainingShips() {
    this.remainingShips = this.boardService.ships;
  }

  getGame(id: number) {
    var httpRequest = this.http.get<Game>(`${this.apiUrl}/games/${id}`)
    httpRequest.subscribe(
        returnedGame => {
          if (this.boardService.playerSetShips(returnedGame.ships, this.user.username)) {
            // user has already set their ships)
            this.router.navigateByUrl(`/game/${id}`);
          }
            this.game = returnedGame;
            this.setRemainingShips();
        })
  }

}
