import { Component } from '@angular/core';
import { CommandService } from '../../shared/services/command.service';

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrl: './install.component.css'
})
export class InstallComponent {

  packages: string[] =[] ;

  constructor(
    private command: CommandService
  ) { }

  async ngOnInit(){
    this.packages = this.command.requiredPackages;
  }

}
