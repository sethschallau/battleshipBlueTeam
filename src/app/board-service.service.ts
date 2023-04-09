    import { Injectable } from '@angular/core';
    import { Board } from './game/board/board.component';
    import { Player } from './player/player.component';
    import { Tile } from './game/tile/tile.component';

    @Injectable()
    export class BoardService {

      playerId: number = 1;
      boardSize: number = 10;
      boards: Board[] = [];

      constructor() { }

      createBoard() : BoardService {
        // create tiles for board
        let tiles: any[] = [];
        for(let i=0; i < this.boardSize; i++) {
          
          tiles[i] = [];
          for(let j=0; j< this.boardSize; j++) {
            var x: Tile = { used: false, value: 0, status: '', row: i, col: j };
            tiles[i][j] = x;
          }
        }
        // create board
        let board = new Board({
          player: new Player({ id: this.playerId++ }),
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
    }
