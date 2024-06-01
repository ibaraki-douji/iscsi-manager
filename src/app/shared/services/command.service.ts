import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electronyzer';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  get requiredPackages() {
    return [
      'open-iscsi',
      'util-linux'
    ]
  } 

  private runners = {
    normal: new Runner(this.electron),
    sudo: new Runner(this.electron, true)
  }; 

  get sudo() {
    return this.runners.sudo;
  }

  get user() {
    return this.runners.normal;
  }

  constructor(
    private electron: ElectronService
  ) { }
}


class Runner{

  private invokeName = 'run';

  constructor(
    private electron: ElectronService,
    asSudo: boolean = false
  ) {
    this.invokeName += asSudo ? '-sudo' : '-shell';
  }

  private run(command: string): Promise<string> {
    return this.electron.ipcRenderer.invoke(this.invokeName, command);
  }

  get iscsiadm(){
    return {
      discovery: (host: string) => {
        return this.run('iscsiadm -m discovery -t st -p ' + host);
      },
      node: {
        login: (target: string, user?: string, pass?: string) => {
          let ip = "";

          if (target.includes(" ")){
            const parts = target.split(" ");
            ip = parts[0];
            target = parts[1];

            let chapCommands = "";

            if (user && pass){
              chapCommands = 'iscsiadm -m node -T ' + target + ' -p ' + ip + ' --op=update -n node.session.auth.authmethod -v CHAP && ' +
              'iscsiadm -m node -T ' + target + ' -p ' + ip + ' --op=update -n node.session.auth.username -v ' + user + ' && ' +
              'iscsiadm -m node -T ' + target + ' -p ' + ip + ' --op=update -n node.session.auth.password -v ' + pass + ' && ';
            }

            return this.run(chapCommands + 'iscsiadm -m node -T ' + target + ' -p ' + ip + ' -l');
          } else {
            return this.run('iscsiadm -m node -T ' + target + ' -l');
          }  
        },
        logout: (target: string) => {
          let ip = "";
          if (target.includes(" ")){
            const parts = target.split(" ");
            ip = parts[0];
            target = parts[1];
            return this.run('iscsiadm -m node -T ' + target + ' -p ' + ip + ' -u');
          } else {
            return this.run('iscsiadm -m node -T ' + target + ' -u');
          }  
        },
        update: {
          authMethod: (target: string, method: string) => {
            const ip = target.split(" ")[0];
            const iqn = target.split(" ")[1];

            return this.run('iscsiadm -m node -T ' + iqn + ' -p ' + ip + ' -o update -n node.session.auth.authmethod -v ' + method);
          },
          username: (target: string, username: string) => {
            const ip = target.split(" ")[0];
            const iqn = target.split(" ")[1];

            return this.run('iscsiadm -m node -T ' + iqn + ' -p ' + ip + ' -o update -n node.session.auth.username -v ' + username);
          },
          password: (target: string, password: string) => {
            const ip = target.split(" ")[0];
            const iqn = target.split(" ")[1];

            return this.run('iscsiadm -m node -T ' + iqn + ' -p ' + ip + ' -o update -n node.session.auth.password -v ' + password);
          }
        }
      } 
    } 
  }

  lsblk(){
    return this.run('lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT,MODEL,PATH,VENDOR,LABEL').then(data => {
      const fLine = data.split('\n')[0];

      const endOf = {
        name: fLine.indexOf('NAME'),
        size: fLine.indexOf('SIZE'),
        fstype: fLine.indexOf('FSTYPE'),
        mountpoint: fLine.indexOf('MOUNTPOINT'),
        model: fLine.indexOf('MODEL'),
        path: fLine.indexOf('PATH'),
        vendor: fLine.indexOf('VENDOR'),
        label: fLine.indexOf('LABEL')
      };

      return data.split('\n').map(line => {
        return {
          name: line.substring(endOf.name, endOf.size).trim(),
          size: line.substring(endOf.size, endOf.fstype).trim(),
          fstype: line.substring(endOf.fstype, endOf.mountpoint).trim(),
          mountpoint: line.substring(endOf.mountpoint, endOf.model).trim(),
          model: line.substring(endOf.model, endOf.path).trim(),
          path: line.substring(endOf.path, endOf.vendor).trim(),
          vendor: line.substring(endOf.vendor).trim(),
          label: line.substring(endOf.label).trim()
        } 
      }).filter(drive => drive.name !== 'NAME' && drive.name !== '');
    }); 
  }

  get dpkg() {
    return {
      list: (grep?: string) => {
        return this.run('dpkg -l' + (grep ? ' | grep ' + grep : ''));
      }
    } 
  } 

  get ls() {
    return {
      l: (path: string) => {
        return this.run('ls -l ' + path);
      },
      la: (path: string) => {
        return this.run('ls -la ' + path);
      }
    }
  }  

} 