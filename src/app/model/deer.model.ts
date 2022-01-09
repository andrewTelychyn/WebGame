import { Config } from "../interfaces/config.interface";
import { Animal } from "./animal.model";

export class Deer extends Animal {
    public type: string = "Deer";
    public color: string = "green";

    public maxSpeed: number;

    public deerCohension: number;
    public deerCasualSeparate: number;
    public deerHostileSeparate: number;

    constructor(
        config: Config,
        dieCallback: (id: number, killerId?: number) => void
    ) {
        super(config, dieCallback);

        this.maxSpeed = config.deerSpeed;
        this.deerCohension = config.deerCohension;
        this.deerCasualSeparate = config.deerCasualSeparate;
        this.deerHostileSeparate = config.deerHostileSeparate;
    }

    public override applyBehaviours(allAnimals: Animal[],  friendAnimals: Animal[], hostileAnimals: Animal[]): void {
        let separate = this.separate(allAnimals, this.deerCasualSeparate);
        let friendCohension = this.cohension(friendAnimals, this.deerCohension);
        let hostileSeparate = this.separate(hostileAnimals, this.deerHostileSeparate);
        let wander = this.wander();
        let edge = this.avoidEdges();

        this.applyForce(edge.scale(1.5));
        this.applyForce(separate);
        this.applyForce(friendCohension);
        this.applyForce(hostileSeparate.scale(1.5));
        this.applyForce(wander.scale(0.5));
    }
}