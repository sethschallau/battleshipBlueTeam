import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './tile.component.html'
})
export class Tile {
  used: boolean;
  value: number;
  status: string;
  row: number;
  col: number;


  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
 
}

