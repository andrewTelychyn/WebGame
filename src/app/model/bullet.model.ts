import { Vector } from "ts-matrix";
import { Animal } from "./animal.model";
import { Config } from "../interfaces/config.interface";

export class Bullet {
    public id: number;
    public location: Vector;
    public color: string = 'brown';

    private destination : Vector;
    private speed: number;
    private distance: number;
    private radius: number;

    constructor(
        coord: [number, number],
        direct: [number, number],
        { bulletDistance, bulletRadius, bulletSpeed }: Config,
        public hunterId: number,
        private removeCallback: (id: number) => void
    ) {
        this.speed = bulletSpeed;
        this.distance = bulletDistance;
        this.radius = bulletRadius;

        this.id = Date.now() + Math.round(Math.random() * 100);

        this.location = new Vector(coord);
        const direction = new Vector(direct).scale(this.distance);
        this.destination = this.location.substract(direction);
    }

    public update(animals: Animal[]): void {
        const [lx, ly] = this.location.values;
        const [dx, dy] = this.destination.values
        
        if (Math.round(lx) === Math.round(dx) && Math.round(ly) === Math.round(dy)) 
            return this.removeCallback(this.id);
        
        const distance = this.destination.substract(this.location).scale(this.speed / this.distance);
        const [fx, fy] = this.location.add(distance).values;

        for (let animal of animals) {
            const [ax, ay] = animal.location.values;
            if (
                (lx + this.radius > ax && lx - this.radius < ax && ((ly < ay && fy > ay) || (ly > ay && fy < ay))) ||
                (ly + this.radius > ay && ly - this.radius < ay && ((lx < ax && fx > ax) || (lx > ax && fx < ax)))
            ) {
                console.log('HIT')
                animal.die(this.hunterId);
                this.removeCallback(this.id);
                return;
            }
        }
        this.location = this.location.add(distance);
    }
}