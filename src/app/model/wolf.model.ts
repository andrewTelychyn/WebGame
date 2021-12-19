import { Vector } from "ts-matrix";
import { Animal } from "./animal.model";

const WOLF_RADIUS = 100;
const WOLF_SPEED = 3;

export class Wolf extends Animal {
    public type: string = "Wolf";
    public color: string = "red"
    public maxSpeed: number = WOLF_SPEED;

    constructor(x: number, y: number, maxHeight: number, maxWidth: number) {
        super(x, y, maxHeight, maxWidth);
    }

    public override applyBehaviours(foodAnimal: Animal[]): void {
        let food = this.findAnimal(foodAnimal);
        let wander = this.wander();
        let edge = this.avoidEdges();

        food = food ? food.scale(2): new Vector([0, 0]);
        edge =  edge ? edge.scale(10): new Vector([0, 0]);
        wander = wander.scale(0.2);

        this.applyForce(edge);
        this.applyForce(food);
        this.applyForce(wander);
    }

    private findAnimal(animals: Animal[]): Vector | undefined {
        let radius = WOLF_RADIUS;
        let target: Vector = new Vector([0, 0]);
        let min: number | undefined;

        for (let animal of animals) {
            const d = this.getDistance(animal.location);

            if (d > 0 && d < radius && (!min || min > d)) {
                target = this.location.substract(this.location);
            }
        }

        return this.seek(target);
    }
}