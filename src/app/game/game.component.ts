import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from 'src/app/board-service.service';
import { Board } from 'src/app/game/board/board.component';
import { Tile } from './tile/tile.component';

const NUM_PLAYERS: number = 2;
const BOARD_SIZE: number = 10;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  providers: [BoardService]
})
export class GameComponent {
      canPlay: boolean = true;
      player: number = 0;
      players: number = 0;
      gameId: string;
      gameUrl: string = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port: '');

      constructor(
        private toastr: ToastrService,
        private boardService: BoardService
      ) {
        this.createBoards();
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

        if (tile.value == 1) {
          this.toastr.success("You sank a ship!");
          this.boards[boardId].tiles[row][col].status = 'win';
          this.boards[this.player].player.score++;
        } else {
          this.toastr.info("Miss!");
          this.boards[boardId].tiles[row][col].status = 'fail'
        }
        this.canPlay = false;
        this.boards[boardId].tiles[row][col].used = true;
        this.boards[boardId].tiles[row][col].value = 1;
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
        if(tile.value == 1) {
          this.toastr.error("You already shot here.");
          return false;
        }
        return true;
      }

      createBoards() : GameComponent {
        for (let i = 0; i < NUM_PLAYERS; i++)
          this.boardService.createBoard();
        return this;
      }

      // winner property to determine if a user has won the game.
      // once a user gets a score higher than the size of the game
      // board, he has won.
      get winner () : Board | undefined{
        return this.boards.find(board => board.player.score >= BOARD_SIZE);
      }

      // get all boards and assign to boards property
      get boards () : Board[] {
        return this.boardService.getBoards()
      }

  }
