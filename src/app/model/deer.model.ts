import { Animal } from "./animal.model";

const CASUAL_SEPARATE = 3;
const FRIEND_COHENSION = 30;
const HOSTILE_SEPARATE = 40;
const DEER_SPEED = 2;

export class Deer extends Animal {
    public type: string = "Deer";
    public color: string = "green";
    public maxSpeed: number = DEER_SPEED;

    constructor(
        maxHeight: number,
        maxWidth: number,
        dieCallback: (id: number) => void
    ) {
        super(maxHeight, maxWidth, dieCallback);
    }

    public override applyBehaviours(allAnimals: Animal[],  friendAnimals: Animal[], hostileAnimals: Animal[]): void {
        let separate = this.separate(allAnimals, CASUAL_SEPARATE);
        let friendCohension = this.cohension(friendAnimals, FRIEND_COHENSION);
        let hostileSeparate = this.separate(hostileAnimals, HOSTILE_SEPARATE);
        let wander = this.wander();
        let edge = this.avoidEdges();

        this.applyForce(edge.scale(1.5));
        this.applyForce(separate);
        this.applyForce(friendCohension);
        this.applyForce(hostileSeparate.scale(1.5));
        this.applyForce(wander.scale(0.5));
    }
}