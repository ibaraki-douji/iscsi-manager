import { Component } from '@angular/core';
import { CommandService } from '../../shared/services/command.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrl: './targets.component.css'
})
export class TargetsComponent {

  targets: string[] = [];
  focusedTarget: string = '';

  localDrives: any[] = [];

  constructor(
    private shell: CommandService,
    private storage: LocalStorageService
  ){}

  async ngOnInit(){
    this.targets = this.storage.getTargets();

    const mapped = await this.shell.user.ls.l('/dev/disk/by-path/ip-*');
    this.localDrives = mapped.split('\n').filter(e => e.includes('../sd')).map(e => {
      return {
        target: e.substring(e.indexOf('/dev'), e.indexOf(' -> ')).split('/').reverse()[0],
        path: e.substring(e.indexOf(' -> ') + 4).replace('../../', '/dev/')
      } 
    });
  }

  driveConnected(target: string){
    return this.localDrives.some((drive: any) => drive.target === 'ip-' + target.replace(',1 ', '-iscsi-') + '-lun-0');
  }

  async connect(){
    await this.shell.sudo.iscsiadm.node.login(this.focusedTarget);
    await this.ngOnInit();
  }
  
  async disconnect(){
    await this.shell.sudo.iscsiadm.node.logout(this.focusedTarget);
    await this.ngOnInit();
  }

  async remove(){
    try {
      await this.shell.sudo.iscsiadm.node.logout(this.focusedTarget);
    } catch (e) {
      if (!(e+'').includes('No matching sessions found')){
        console.error(e);
      } 
    }
    this.targets = this.targets.filter((target: string) => target !== this.focusedTarget);
    this.storage.setTargets(this.targets);
    await this.ngOnInit();
  }


}
