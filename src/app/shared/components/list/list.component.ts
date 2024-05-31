import { Component, ContentChild, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

 @ContentChild(HeaderComponent) header!: HeaderComponent;
 @ViewChild('list') list!: ElementRef<HTMLDivElement>; 
 @ViewChild('items') items!: ElementRef<HTMLDivElement>; 

  constructor() { }

  ngAfterViewInit(){
    if (!this.header) return;

    this.list.nativeElement.attributeStyleMap.set('--columns', this.header.columns.length);
    this.items.nativeElement.attributeStyleMap.set('--columns', this.header.columns.length);
  }

}
