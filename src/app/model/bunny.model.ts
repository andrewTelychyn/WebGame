import { Vector } from "ts-matrix";
import { Animal } from "./animal.model";

const BUNNY_RADIUS = 50;
const BUNNY_SPEED = 4;

export class Bunny extends Animal {
    public type: string = "Bunny";
    public color: string = "blue";
    public maxSpeed: number = BUNNY_SPEED;

    constructor(x: number, y: number, maxHeight: number, maxWidth: number) {
        super(x, y, maxHeight, maxWidth);
    }

    public override applyBehaviours(allAnimals: Animal[]): void {
        let separate = this.separate(allAnimals, BUNNY_RADIUS);
        let wander = this.wander();
        let edge = this.avoidEdges();

        separate =  separate ? separate.scale(2): new Vector([0, 0]);
        wander = wander.scale(0.2);

        if (edge) {
            edge = edge.scale(10);
            this.applyForce(edge);
        } else {
            this.applyForce(wander);
            this.applyForce(separate);
            // console.log(wander.values);
        }

        // this.applyForce(edge);

    }
}