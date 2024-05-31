import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private local = window.localStorage;

  constructor() { }

  getTargets(): string[] {
    return JSON.parse(this.local.getItem('targets') || '[]');
  }

  setTargets(targets: string[]) {
    this.local.setItem('targets', JSON.stringify(targets));
  }
}
