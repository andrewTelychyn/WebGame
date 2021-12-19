import { Vector } from "ts-matrix";
import { Animal } from "./animal.model";

const CASUAL_SEPARATE = 3;
const FRIEND_COHENSION = 80;
const HOSTILE_SEPARATE = 150;
const DEER_SPEED = 2;

export class Deer extends Animal {
    public type: string = "Deer";
    public color: string = "green";
    public maxSpeed: number = DEER_SPEED;

    constructor(x: number, y: number, maxHeight: number, maxWidth: number) {
        super(x, y, maxHeight, maxWidth);
    }

    public override applyBehaviours(allAnimals: Animal[],  friendAnimals: Animal[], hostileAnimals: Animal[]): void {
        let separate = this.separate(allAnimals, CASUAL_SEPARATE);
        let friend = this.cohension(friendAnimals, FRIEND_COHENSION);
        let hostile = this.separate(hostileAnimals, HOSTILE_SEPARATE);
        let wander = this.wander();
        let edge = this.avoidEdges();

        separate =  separate ? separate.scale(0.6): new Vector([0, 0]);
        friend = friend ? friend.scale(1.5): new Vector([0, 0]);
        hostile = hostile ? hostile.scale(3): new Vector([0, 0]);
        wander = wander.scale(0.2);
        edge =  edge ? edge.scale(10): new Vector([0, 0]);

        this.applyForce(edge);
        this.applyForce(separate);
        this.applyForce(friend);
        this.applyForce(hostile);
        this.applyForce(wander);
    }
}