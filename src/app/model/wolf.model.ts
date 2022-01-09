import { Vector } from "ts-matrix";
import { Config } from "../interfaces/config.interface";
import { Animal } from "./animal.model";

export class Wolf extends Animal {
    public type: string = "Wolf";
    public color: string = "red"

    private hungerLimit: number;
    private killRadius: number;

    private wolfHuntRadius: number;
    private wolfHungerLimit: number;
    private wolfKillingIncrement: number;
    private wolfCannibalismCoef: number;
    private wolfNoHarmCoef: number;
    private wolfNoHuntCoef: number;

    constructor(
        config: Config,
        dieCallback: (id: number, killerId?: number) => void,
    ) {
        super(config, dieCallback);

        this.hungerLimit = config.wolfHungerLimit;
        this.wolfHuntRadius = config.wolfHuntRadius;
        this.wolfHungerLimit = config.wolfHungerLimit;
        this.wolfKillingIncrement = config.wolfKillingIncrement;
        this.wolfCannibalismCoef = config.wolfCannibalismCoef;
        this.wolfNoHarmCoef = config.wolfNoHarmCoef;
        this.wolfNoHuntCoef = config.wolfNoHuntCoef;
        this.killRadius = config.wolfKillRadius;
    }

    public addHunger(): void {
        if (this.hungerLimit - 1 > 0) this.hungerLimit--;
        else this.die();
    }

    public override applyBehaviours(allAnimals: Animal[], greenAnimals: Animal[]): void {
        let food = this.hunt(greenAnimals, this.wolfHuntRadius, allAnimals);
        let wander = this.wander();
        let edge = this.avoidEdges();

        this.applyForce(edge.scale(1.5));
        this.applyForce(food);
        this.applyForce(wander.scale(0.5));
    }

   private hunt(animals: Animal[], huntRadius: number, allAnimals: Animal[]): Vector {
        if (this.hungerLimit > this.wolfHungerLimit * this.wolfNoHuntCoef) 
            return new Vector([0, 0]);

        const huntdist = huntRadius * 2;
        let sum = new Vector([0, 0]);
        let count = 0;

        let min: number | null = null;
        let closestAnimal: Animal | null = null;

        // if a wolf is very hungry it might start hunting other wolves for survival
        let huntingAnimals = animals;
        if (this.hungerLimit < this.wolfHungerLimit * this.wolfCannibalismCoef) 
            huntingAnimals = allAnimals.filter(w => this.id !== w.id);

        for (let animal of huntingAnimals) {
            const d = this.getDistance(animal.location);

            if (d > 0 && d < huntdist) {
                sum = sum.add(animal.location);
                count++;

                if (!min || min > d) {
                    min = d;
                    closestAnimal = animal;
                }
            }
        }

        // also checking if wolf is full 
        if (min && min < this.killRadius && this.hungerLimit < this.wolfHungerLimit * this.wolfNoHarmCoef) {
            closestAnimal?.die(this.id);
            this.killRadius += this.wolfKillingIncrement;
            this.hungerLimit = this.wolfHungerLimit;

            count = 0;
        }

        // hunting closest animal
        if (closestAnimal) return this.seek(closestAnimal.location, false);

        if (count) {
            sum = sum.scale(1 / count);
            return this.seek(sum);
        } else 
            return new Vector([0, 0]);
   }
}