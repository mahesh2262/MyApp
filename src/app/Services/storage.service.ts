import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private _storage:Storage) { 
    this.init();
  }

  async init() {
    this._storage = await this._storage.create();
  }

  async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  async get(key: string) {
    return await this._storage?.get(key);
  }

  async remove(key: string) {
    await this._storage?.remove(key);
  }

  async clear() {
    await this._storage?.clear();
  }
}
