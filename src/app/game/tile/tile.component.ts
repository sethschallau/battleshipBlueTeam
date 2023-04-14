import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './tile.component.html'
})
export class Tile {
  shot: boolean;
  ship: boolean;
  status: string;
  row: number;
  col: number;
  value: string;


  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
 
}

