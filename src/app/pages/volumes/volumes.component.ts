import { Component } from '@angular/core';
import { CommandService } from '../../shared/services/command.service';

@Component({
  selector: 'app-volumes',
  templateUrl: './volumes.component.html',
  styleUrl: './volumes.component.css'
})
export class VolumesComponent {

  localDrives: any[] = [];
  
  constructor(
    private command: CommandService,
  ){} 

  async ngOnInit() {
    const foundDrives: string[] = []; 
    this.localDrives = (await this.command.user.lsblk()).filter((drive: any) => {

      if (drive.vendor.includes('SCST')) {
        foundDrives.push(drive.name);
        return true;
      }

      if (foundDrives.some(e => drive.name.includes(e))) {
        return true;
      }

      return false;

    });
  }

}
