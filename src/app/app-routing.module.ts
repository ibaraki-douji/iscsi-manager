import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscoveryComponent } from './pages/discovery/discovery.component';
import { TargetsComponent } from './pages/targets/targets.component';
import { VolumesComponent } from './pages/volumes/volumes.component';
import { InstallComponent } from './pages/install/install.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/discovery',
    pathMatch: 'full'
  },
  {
    path: 'discovery',
    component: DiscoveryComponent
   },
  {
    path: 'targets',
    component: TargetsComponent
  },
  {
    path: 'volumes',
    component: VolumesComponent
  },
  {
    path: 'install',
    component: InstallComponent
  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
