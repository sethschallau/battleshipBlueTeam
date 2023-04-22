import { Injectable } from '@angular/core';
import { Board } from './board/board.component';
import { Tile } from './tile/tile.component';
import { Ship } from '../_models/ship';
import { ShipList } from '../_models/shipList';
import { User } from '../_models/user';
import { Game } from '../_models/game';
import { Location } from '../_models/location';

    @Injectable()
    export class BoardService {

      playerId: number = 1;
      boardSize: number = 10;
      boards: Board[] = [];
      carrier: Ship = {coords: null, type: 'Carrier', size: 5, direction: '', username: '', imgsrc: '../assets/ships/carrier.png'};
      battleship: Ship = {coords: null, type: 'Battleship', size: 4, direction: '', username: '', imgsrc: '../assets/ships/battleship.png'};
      destroyer: Ship = {coords: null, type: 'Destroyer', size: 3, direction: '', username: '', imgsrc: '../assets/ships/destroyer.png'};
      submarine: Ship = {coords: null, type: 'Submarine', size: 3, direction: '', username: '', imgsrc: '../assets/ships/submarine.png'};
      patrol: Ship = {coords: null, type: 'Patrol', size: 2, direction: '', username: '', imgsrc: '../assets/ships/patrol.png'};
      ships: Ship[] = [ this.carrier, this.battleship, this.destroyer, this.submarine, this.patrol ];

      constructor() { }

      createBoard(user: User, game: Game) : BoardService {
        // create tiles for board
        let tiles: any[] = [];
        let ships: Location[] | null = [];
        let hits: Location[] = [];
        let misses: Location[] = []; 
        let shotCount = 0;
        if (game.hits) {
          for (let shotList of game.hits) {
            if (!shotList.playerUserName.includes(user.username)) {
              for (let coord of shotList.coordinates) {
                hits.push(coord);
              }
            } else {
              shotCount = shotList.coordinates.length;
            }
          }
        }
        user.hits = shotCount;
        shotCount = 0;
        if (game.misses) {
          for (let shotList of game.misses) {
            if (!shotList.playerUserName.includes(user.username)) {
              for (let coord of shotList.coordinates) {
                misses.push(coord);
            }
          
          } else {
            shotCount = shotList.coordinates.length;
          }
          }
        }
        user.misses = shotCount;
         if (game.ships) {
          for (let arr of game.ships) {
            if (arr.playerUserName.includes(user.username)) {
              for (let ship of arr.positions) {
                if (ship.coords) {
                  for (let coord of ship.coords) {
                    ships.push(coord);
                  }
                }
              }
            } else {
              user.remainingShips = this.ships;
            }
          }
         } else {
          user.remainingShips = this.ships;
         }
        

        for(let i=0; i < this.boardSize; i++) {
          
          tiles[i] = [];
          for(let j=0; j< this.boardSize; j++) {
            var x: Tile = { shot: false, ship: false, value: '', status: '', row: i, col: j };

          if (ships) {
            for (let coord of hits) {
              if (coord.x == i && coord.y == j) {
                x.shot = true;
                x.value = "X";
              }
            }
            for (let coord of misses) {
              if (coord.x == i && coord.y == j) {
                x.shot = true;
                x.value = "X";
              }
            }
            for (let coord of ships) {
              if (coord.x == i && coord.y == j) {
                x.ship = true;
              }
          }
          }

            tiles[i][j] = x;
          }
        }
        let board = new Board({
          player: user,
          gameId: game._id,
          tiles: tiles
        });
        this.playerId++;
        // append created board to `boards` property
        this.boards.push(board);
        return this;
      }
      
      // returns all created boards
      getBoards() : Board[] {
        return this.boards;
      }

    playerSetShips(ships: ShipList[], username: string): boolean {
      let idx = 0;

      for (let arr of ships) {
        if (arr.playerUserName.includes(username)) {
          for (let ship of arr.positions) {
            if (ship.coords) {
               idx++;
            }
          }
        }
      }
      if (idx == 5) {
        return true;
      }
      return false;
    }
  }
