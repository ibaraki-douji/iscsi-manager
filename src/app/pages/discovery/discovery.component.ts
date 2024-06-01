import { Component, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electronyzer';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { CommandService } from '../../shared/services/command.service';

@Component({
  selector: 'app-targets',
  templateUrl: './discovery.component.html',
  styleUrl: './discovery.component.css'
})
export class DiscoveryComponent {

 @ViewChild(TextInputComponent) textInput!: TextInputComponent;

 targets: string[] = [];
 progress: string = '';

  constructor(
    private shell: CommandService,
    private storage: LocalStorageService
  ){}

  ngOnInit() {}

  addTarget() {
    this.progress = 'Discovering targets...';

    this.shell.sudo.iscsiadm.discovery(this.textInput.value).then((res: string) => {
      this.progress = "\nTargets discovered successfully.";
      this.targets = res.split('\n').filter((line) => line.includes('iqn') && line.includes(this.textInput.value));
      this.storage.setTargets(this.targets);
    }).catch((err) => {
      for (const line of (err+'').split('\n')) {
        if (line.startsWith('iscsiadm')) {
          this.progress += "\n" + line;
        }
      } 
    });
  }

}
