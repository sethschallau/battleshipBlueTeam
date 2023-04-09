import { Component } from '@angular/core';
import { Player } from 'src/app/player/player.component';
import { Tile } from '../tile/tile.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html'
})
export class Board {
  player: Player;
  tiles: Tile[][];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
 
}

