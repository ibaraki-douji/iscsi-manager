import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-list-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

 @ViewChild('header') header!: ElementRef<HTMLDivElement>;

  get columns(){
    return this.header.nativeElement.children;
  }

  constructor() { }

}
