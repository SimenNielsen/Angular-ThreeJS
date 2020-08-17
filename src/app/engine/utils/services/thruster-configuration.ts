export interface SpeedConfig{
    value: number;
    minSpeed: number;
    maxSpeed: number;
    stepSpeed: number;

}
export interface ThrusterConfiguration{
    speedConfig : SpeedConfig;
}