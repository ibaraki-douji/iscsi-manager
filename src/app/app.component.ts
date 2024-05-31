import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electronyzer';
import { CommandService } from './shared/services/command.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ISCSI-Manager';

  constructor(
    private command: CommandService,
    private router: Router
  ){} 

  async ngOnInit(){

    let installed = true;

    for (const pkg of this.command.requiredPackages){
      const std = await this.command.user.dpkg.list(pkg);
      if (!std.includes(pkg)){
        installed = false;
        break;
      }
    }

    if (!installed && window.location.pathname !== '/install'){
      this.router.navigate(['/install']);
    }

  } 

}
