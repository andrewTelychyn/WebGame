import { Animal } from "./animal.model";

const BUNNY_RADIUS = 30;
const BUNNY_SPEED = 4;

export class Bunny extends Animal {
    public type: string = "Bunny";
    public color: string = "blue";
    public maxSpeed: number = BUNNY_SPEED;

    constructor(
        maxHeight: number,
        maxWidth: number,
        dieCallback: (id: number) => void
    ) {
        super(maxHeight, maxWidth, dieCallback);
    }

    public override applyBehaviours(allAnimals: Animal[], wolves: Animal[]): void {
        let separateAll = this.separate(allAnimals, BUNNY_RADIUS);
        let separateWolves = this.separate(wolves, BUNNY_RADIUS);
        let wander = this.wander();
        let edge = this.avoidEdges();

        this.applyForce(edge.scale(1.5));
        this.applyForce(wander.scale(0.5));
        this.applyForce(separateAll.scale(0.65));
        this.applyForce(separateWolves.scale(1.25));
    }
}