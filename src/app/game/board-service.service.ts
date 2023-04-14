import { Injectable } from '@angular/core';
import { Board } from './board/board.component';
import { Player } from './player/player.component';
import { Tile } from './tile/tile.component';
import { Ship } from '../_models/ship';

    @Injectable()
    export class BoardService {

      playerId: number = 1;
      boardSize: number = 10;
      boards: Board[] = [];
      carrier: Ship = {location: null, type: 'Carrier', size: 5, direction: '', username: ''};
      battleship: Ship = {location: null, type: 'Battleship', size: 4, direction: '', username: ''};
      destroyer: Ship = {location: null, type: 'Destroyer', size: 3, direction: '', username: ''};
      submarine: Ship = {location: null, type: 'Submarine', size: 3, direction: '', username: ''};
      patrol: Ship = {location: null, type: 'Patrol', size: 2, direction: '', username: ''};
      ships: Ship[] = [ this.carrier, this.battleship, this.destroyer, this.submarine, this.patrol ];

      constructor() { }

      createBoard(username: string) : BoardService {
        // create tiles for board
        let tiles: any[] = [];
        for(let i=0; i < this.boardSize; i++) {
          
          tiles[i] = [];
          for(let j=0; j< this.boardSize; j++) {
            var x: Tile = { shot: false, ship: false, value: '', status: '', row: i, col: j };
            tiles[i][j] = x;
          }
        }
        let board = new Board({
          player: new Player({ id: this.playerId++, username: username, remainingShips: this.ships }),
          tiles: tiles
        });
        // append created board to `boards` property
        this.boards.push(board);
        return this;
      }
      
      // returns all created boards
      getBoards() : Board[] {
        return this.boards;
      }

    playerSetShips(ships: Ship[], username: string): boolean {
      let idx = 0;
      for (let ship of ships) {
        if (ship.username.includes(username) && ship.location) {
          idx++;
        }
      }
      if (idx == 5) {
        return true;
      }
      return false;
    }
  }
