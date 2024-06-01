import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscoveryComponent } from './discovery/discovery.component';
import { ComponentsModule } from '../shared/components/components.module';
import { TargetsComponent } from './targets/targets.component';
import { VolumesComponent } from './volumes/volumes.component';
import { InstallComponent } from './install/install.component';
import { SettingsComponent } from './settings/settings.component';



@NgModule({
  declarations: [
    DiscoveryComponent,
    TargetsComponent,
    VolumesComponent,
    InstallComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule
  ]
})
export class PagesModule { }
