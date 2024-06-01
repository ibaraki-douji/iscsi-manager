import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommandService } from '../../shared/services/command.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrl: './targets.component.css'
})
export class TargetsComponent {

  targets: string[] = [];
  focusedTarget: string = '';

  localDrives: any[] = [];

  @ViewChild('username') chapUser!: TextInputComponent;
  @ViewChild('password') chapPass!: TextInputComponent;
  @ViewChild('useChap') useChap!: ElementRef<HTMLInputElement>;

  constructor(
    private shell: CommandService,
    private storage: LocalStorageService
  ){}

  async ngOnInit(){
    this.targets = this.storage.getTargets();

    let mapped: string;

    try {
      mapped = await this.shell.user.ls.l('/dev/disk/by-path/ip-*');
    } catch (e: any) {
      if ((e+'').includes('No such file or directory')){
        mapped = '';
      } else {
        throw e;
      }
    }
    
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
    if (!this.targets.includes(this.focusedTarget)){
      return;
    }

    await this.shell.sudo.iscsiadm.node.login(this.focusedTarget, this.useChap.nativeElement.checked ? this.chapUser.value : '', this.useChap.nativeElement.checked ? this.chapPass.value : '');
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
