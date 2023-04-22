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
import { Location } from 'src/app/_models/location';

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
  shipCol: number;
  shipRow: number;
  shipSize: number;
  shipDirection: string;
  shipName: string;
  directions: string[] = ['l', 'r', 'u', 'd'];
  placedShips: Ship[];
  shipArray: any[];
  shipCoords: Location[];

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

  placeShip() {
      let tile: Tile = this.board.tiles[this.shipRow][this.shipCol];
      this.shipCoords = [];
      if (!this.checkValidShipPlacement(tile, this.shipSize, this.shipDirection)) {
        return;
      }
      switch (this.shipDirection) {
        case('r'):
          for (let i = this.shipCol; i < (this.shipSize + this.shipCol); i++) {
            this.board.tiles[this.shipRow][i].ship = true;
            this.shipCoords.push({ x: this.shipRow, y: i });
  
          }
        break;
        case('l'):
          for (let i = this.shipCol; i > (this.shipCol - this.shipSize); i--) {
            this.board.tiles[this.shipRow][i].ship = true;
            this.shipCoords.push({ x: this.shipRow, y: i });
          }
        break;
        case('d'):
          for (let i = this.shipRow; i < (this.shipSize + this.shipRow); i++) {
            this.board.tiles[i][this.shipCol].ship = true;
            this.shipCoords.push({ x: i, y: this.shipCol });
          }
        break;
        case('u'):
          for (let i = this.shipRow; i > (this.shipRow - this.shipSize); i--) {
            this.board.tiles[i][this.shipCol].ship = true;
            this.shipCoords.push({ x: i, y: this.shipCol });
          }
        break;
      }
      

      for (let i = 0; i < this.remainingShips.length; i++) {
        if (this.remainingShips[i].type.includes(this.shipName)) {
          let s: Ship[] = this.remainingShips.splice(i, 1);
          for (let ship of s) {
            ship.coords = this.shipCoords;
            ship.direction = this.shipDirection;
            this.placedShips.push(ship);
          }
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
        if (i >= BOARD_SIZE) {
          this.toastr.error("Too close to the edge!");
          return false;
        }
        if (this.board.tiles[row][i].ship) {
          this.toastr.error("Can't overlap other ships!")
          return false;
        }
      }
      return true;
    case('l'):
      for (let i = col; i > (col - shipSize); i--) {
        if (i < 0) {
          this.toastr.error("Too close to the edge!");
          return false;
        }
        if (this.board.tiles[row][i].ship) {
          this.toastr.error("Can't overlap other ships!");
          return false;
        }
      }
      return true;
    case('d'):
      for (let i = row; i <= (shipSize + row); i++) {
        if (i >= BOARD_SIZE) {
          this.toastr.error("Too close to the edge!");
          return false;
          }
        if (this.board.tiles[i][col].ship) {
          this.toastr.error("Can't overlap other ships!");
          return false;
        }      
      }
      return true;
    case('u'):
      for (let i = row; i > (row - shipSize); i--) {
        if (i < 0) {
          this.toastr.error("Too close to the edge!");
          return false;
          }
        if (this.board.tiles[i][col].ship) {
          this.toastr.error("Can't overlap other ships!");
          return false;
        }
      }
      return true;
    }

    return true;
  }

  openDropdown(): void {
    this.dropdown = true;
  }

  createBoard() : SetShipsComponent {
      this.boardService.createBoard(this.user, this.game);
    return this;
  }

  // get all boards and assign to boards property
  get board () : Board {
    return this.boardService.getBoards()[0];
  }

  setRemainingShips(): void {
     this.remainingShips = [];
     this.placedShips = [];
     for (let ship of this.boardService.ships) {
      let updatedShip = ship;
      updatedShip.username = this.user.username;
      this.remainingShips.push(updatedShip);
     }

  }

  getGame(id: string): void {
    this.gameId = id;
    var httpRequest = this.http.get<Game>(`${this.apiUrl}/games/${id}`)
    httpRequest.subscribe(
        returnedGame => { 
          if (this.boardService.playerSetShips(returnedGame.ships, this.user.username)) {
            // user has already set their ships)
            this.router.navigateByUrl(`/game/${id}`);
          }
            this.game = returnedGame;
            this.setRemainingShips();
            this.createBoard();
        })
  }

  setCoords(row: number, col: number): void {
    this.shipRow = row;
    this.shipCol = col;
  }

  setActive(activeShip: Ship): void {
    for(let ship of this.remainingShips) {
      ship.isClicked = false;
    }

    activeShip.isClicked = true;
    this.shipSize = activeShip.size;
    this.shipName = activeShip.type;
  }

  fullName(direction: string): string | undefined {
    switch (direction) {
      case('l'): 
        return "Left"
      case ('r'):
        return "Right"
      case ('u'):
        return "Up"
      case ('d'): 
        return "Down"
    }
    return undefined;
   }

   resetShips(): void {
    for (let i = 0; i < BOARD_SIZE; i++ ) {
      for (let j = 0; j < BOARD_SIZE; j++ ) {
        this.board.tiles[i][j].ship = false;
      }
    }
    this.setRemainingShips();
   }

     // {
  //   "gameId": "your_game_id",
  //   "username": "player_username",
  //   "ships": [
  //     {
  //       "coords": [
  //         { "x": 0, "y": 0 },
  //         { "x": 1, "y": 0 }
  //       ],
  //       "shipType": "Battleship",
  //       "direction": "r"
  //     },
  //     {
  //       "coords": [
  //         { "x": 2, "y": 2 },
  //         { "x": 2, "y": 3 }
  //       ],
  //       "shipType": "Destroyer",
  //       "direction": "u"
  //     }
  //   ]
  // }

   allShipsSet(): boolean {
    if (this.remainingShips != undefined) {
      return (this.remainingShips.length == 0);
    }
    return false;
   }

    createShipArray() {
      this.shipArray = [];
      for (let ship of this.placedShips) {
        this.shipArray.push( {coords: ship.coords, shipType: ship.type, direction: ship.direction} );
      }

    }

   submitShips() {
    this.createShipArray();
    const body = { gameId: this.gameId, username: this.user.username, ships: this.shipArray };
    var httpRequest = this.http.post<any>(`${this.apiUrl}/games/set-pieces`, body);
    httpRequest.subscribe(
      returnedGame => {
        this.router.navigateByUrl(`/game/${this.gameId}`);
      })
   }
}