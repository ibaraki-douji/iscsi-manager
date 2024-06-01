import { Component } from '@angular/core';
import { CommandService } from '../../shared/services/command.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  autoStart = false;

  constructor(
    private shell: CommandService
  ) { }

  async ngOnInit() {
    const iscsid = (await this.shell.user.cat('/etc/iscsi/iscsid.conf')).split('\n').filter(l => l.trim().length > 0).filter(l => !l.startsWith('#'));

    this.autoStart = iscsid.includes('node.startup = automatic');

  }

  async toggleAutoStart() {
    if (this.autoStart) {
      await this.shell.sudo.sed('/etc/iscsi/iscsid.conf', 'node.startup = automatic', 'node.startup = manual');
    } else {
      await this.shell.sudo.sed('/etc/iscsi/iscsid.conf', 'node.startup = manual', 'node.startup = automatic');
    }

    this.ngOnInit();
  }

  async restartService() {
    await this.shell.sudo.systemctl.restart('iscsid');
  }

  async startService() {
    await this.shell.sudo.systemctl.start('iscsid');
  }

  async stopService() {
    await this.shell.sudo.systemctl.stop('iscsid');
  }

}
