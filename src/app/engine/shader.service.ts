import * as THREE from 'three';
import { Injectable } from '@angular/core';

export interface IThrusterShader{

}

export interface IShader{
    fragment?: string,
    vertex?: string,
}

export interface IShaderList{
    thruster?: IThrusterShader,
}

@Injectable({ providedIn: 'root' })
export class ShaderService{
    public shaderList : IShaderList = {};
    constructor(){

    }
}