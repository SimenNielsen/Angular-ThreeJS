import { Injectable } from '@angular/core';
import { ThrusterConfiguration } from './thruster-configuration';

@Injectable({
  providedIn: 'root'
})
export class ThrusterService {
  public configuration : ThrusterConfiguration
  constructor() {
    this.configuration = {
      speedConfig: {
        maxSpeed:1,
        minSpeed: 0,
        stepSpeed: 0.1,
        value: 0
      }
    };
  }
}
