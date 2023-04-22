import { Component } from '@angular/core';
import {  ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  isOpen = false; // set it to false initially

toggleMenu(){
 this.isOpen = !this.isOpen; // toggle it as you want
}

}
