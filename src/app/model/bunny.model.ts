import { Config } from "../interfaces/config.interface";
import { Animal } from "./animal.model";

export class Bunny extends Animal {
    public type: string = "Bunny";
    public color: string = "blue";

    public maxSpeed: number;
    public bunnyRadius: number;

    constructor(
        config: Config,
        dieCallback: (id: number, killerId?: number) => void
    ) {
        super(config, dieCallback);

        this.maxSpeed = config.bunnySpeed;
        this.bunnyRadius = config.bunnyRadius;
    }

    public override applyBehaviours(allAnimals: Animal[], wolves: Animal[]): void {
        let separateAll = this.separate(allAnimals, this.bunnyRadius);
        let separateWolves = this.separate(wolves, this.bunnyRadius);
        let wander = this.wander();
        let edge = this.avoidEdges();

        this.applyForce(edge.scale(1.5));
        this.applyForce(wander.scale(0.5));
        this.applyForce(separateAll.scale(0.65));
        this.applyForce(separateWolves.scale(1.25));
    }
}