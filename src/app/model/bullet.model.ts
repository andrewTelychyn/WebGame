import { Vector } from "ts-matrix";
import { Animal } from "./animal.model";

const SPEED = 8;
const DISTANCE = 32;
const RADIUS = 3;

export class Bullet {
    public id: number;
    public location: Vector;
    private destination : Vector;

    constructor(
        coord: [number, number],
        direct: [number, number],
        private removeCallback: (id: number) => void
    ) {
        this.id = Date.now() + Math.round(Math.random() * 100);
        this.location = new Vector(coord);
        const direction = new Vector(direct).scale(DISTANCE);
        this.destination = this.location.substract(direction);

        // console.log(coord, this.destination.values);
    }

    public update(animals: Animal[]): void {
        const [lx, ly] = this.location.values;
        const [dx, dy] = this.destination.values
        
        if (Math.round(lx) === Math.round(dx) && Math.round(ly) === Math.round(dy)) 
            return this.removeCallback(this.id);
        
        const distance = this.destination.substract(this.location).scale(SPEED / DISTANCE);
        const [fx, fy] = this.location.add(distance).values;

        // console.log(
        //     this.location.values,
        //     this.destination.values,
        //     this.destination.substract(this.location).values,
        //     futureLocation.values,
        // )

        for (let animal of animals) {
            const [ax, ay] = animal.location.values;
            if (
                (lx + RADIUS > ax && lx - RADIUS < ax && ((ly < ay && fy > ay) || (ly > ay && fy < ay))) ||
                (ly + RADIUS > ay && ly - RADIUS < ay && ((lx < ax && fx > ax) || (lx > ax && fx < ax)))
            ) {
                console.log('HIT')
                animal.die();
                this.removeCallback(this.id);
                return;
            }
        }
        this.location = this.location.add(distance);
        
        // console.log('updated bullet')
    }
}