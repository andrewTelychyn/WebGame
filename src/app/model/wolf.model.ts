import { Vector } from "ts-matrix";
import { Animal } from "./animal.model";

const WOLF_RADIUS = 30;
const KILL_RADIUS = 5;
const WOLF_SPEED = 3;
const HUNGER_DURATION = 200;

const KILLING_INCREMENT = 0.25;
const CANNIBALISM_COEF = 1/5;
const NOHARM_COEF = 2/3;
const NORUN_COEF = 3/4;

export class Wolf extends Animal {
    public type: string = "Wolf";
    public color: string = "red"
    public maxSpeed: number = WOLF_SPEED;

    private hungerLimit: number = HUNGER_DURATION;
    private killRadius: number = KILL_RADIUS;

    constructor(
        maxHeight: number,
        maxWidth: number,
        dieCallback: (id: number) => void,
    ) {
        super(maxHeight, maxWidth, dieCallback);
    }

    public addHunger(): void {
        if (this.hungerLimit - 1 > 0) this.hungerLimit--;
        else this.die();
    }

    public override applyBehaviours(allAnimals: Animal[], greenAnimals: Animal[]): void {
        let food = this.hunt(greenAnimals, WOLF_RADIUS, allAnimals);
        let wander = this.wander();
        let edge = this.avoidEdges();

        this.applyForce(edge.scale(1.5));
        this.applyForce(food);
        this.applyForce(wander.scale(0.5));
    }

   private hunt(animals: Animal[], huntRadius: number, allAnimals: Animal[]): Vector {
        if (this.hungerLimit > HUNGER_DURATION * NORUN_COEF) 
            return new Vector([0, 0]);

        const huntdist = huntRadius * 2;
        let sum = new Vector([0, 0]);
        let count = 0;

        let min: number | null = null;
        let closestAnimal: Animal | null = null;

        // if a wolf is very hungry it might start hunting other wolves for survival
        let huntingAnimals = animals;
        if (this.hungerLimit < HUNGER_DURATION * CANNIBALISM_COEF) 
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
        if (min && min < this.killRadius && this.hungerLimit < HUNGER_DURATION * NOHARM_COEF) {
            closestAnimal?.die();
            this.killRadius += KILLING_INCREMENT;
            this.hungerLimit = HUNGER_DURATION;

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