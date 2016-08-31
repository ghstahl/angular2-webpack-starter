import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  _apiURI: string;
  _apiIdentityURI: string;

  constructor() {
    this._apiURI = 'http://localhost:8153/api/';
    this._apiIdentityURI = 'http://localhost:31949/api/';
  }

  getApiURI() {
    return this._apiURI;
  }

  getApiHost() {
    return this._apiURI.replace('api/', '');
  }

  getApiIdentityURI() {
    return this._apiIdentityURI;
  }

  getApiIdentityHost() {
    return this._apiIdentityURI.replace('api/', '');
  }
}
