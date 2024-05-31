import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { SectionComponent } from './section/section.component';
import { TitleComponent } from './section/title/title.component';
import { TextInputComponent } from './text-input/text-input.component';
import { ListComponent } from './list/list.component';
import { ItemComponent } from './list/item/item.component';
import { HeaderComponent } from './list/header/header.component';



@NgModule({
  declarations: [
    ButtonComponent,
    SectionComponent,
    TitleComponent,
    TextInputComponent,
    ListComponent,
    ItemComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    SectionComponent,
    TitleComponent,
    TextInputComponent,
    ListComponent,
    ItemComponent,
    HeaderComponent
  ]
})
export class ComponentsModule { }
