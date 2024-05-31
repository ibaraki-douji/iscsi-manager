import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent {
 
  @Input() placeholder!: string;

 @Output() change: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  get value(): string {
    return this.input.nativeElement.value;
  }

  set value(value: string) {
    this.input.nativeElement.value = value;
  }


  constructor(

  ) { }


  onChange(event: Event): void {
    this.change.emit((event.target as HTMLInputElement).value);
  }

}
