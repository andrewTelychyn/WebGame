import { Vector } from 'ts-matrix';
import { Config } from '../interfaces/config.interface';

export class Animal {
    public type: string = "Animal";
    public color: string = "black";

    public id: number;
    public location : Vector;
    protected velocity : Vector;
    public acceleration : Vector;

    public maxSpeed: number;
    protected maxForce: number;
    private rangeValue: number;

    protected maxHeight: number;
    protected maxWidth: number;

    constructor(
        { maxHeight, maxWidth, animalSpeed, animalForce, animalAvoidRange }: Config,
        private dieCallback: (id: number, killerId?: number) => void
    ) {
        this.maxHeight = maxHeight || 0;
        this.maxWidth = maxWidth || 0;

        this.id = Date.now() + Math.round(Math.random() * 100);
        const [x, y] = [Math.random() * this.maxWidth, Math.random() * this.maxHeight];
        this.location = new Vector([x, y]);
        this.velocity = new Vector([0, 0]);
        this.acceleration = new Vector([0, 0]);

        this.maxSpeed = animalSpeed;
        this.maxForce = animalForce;
        this.rangeValue = animalAvoidRange;
    }

    public update(): void {
        this.velocity = this.acceleration.values[0] ? this.velocity.add(this.acceleration): this.acceleration;
        this.velocity = this.limitVector(this.velocity, this.maxSpeed);
        this.location = this.location.add(this.velocity);
        this.acceleration = new Vector([0, 0]);
    }

    public die(killerId?: number): void {
        console.log('animal died!');
        this.dieCallback(this.id, killerId);
    }

    protected applyForce(force: Vector): void {
        this.acceleration = this.acceleration.add(force);
    }

    protected limitVector(vector: Vector, max: number) : Vector {
        const [x, y] = vector.values;
        const n = Math.sqrt(x**2 + y**2);
        const f = n !== 0 ? (Math.min(n, max) / n) : 0;

        return new Vector([f * x, f * y]); 
    }

    protected getDistance(vector: Vector): number {
        let [x, y] = vector.values;
        let [myx, myy] = this.location.values;
        return Math.sqrt((x - myx)**2 + (y - myy)**2)
    }

    public applyBehaviours(allAnimals: Animal[], friendAnimals: Animal[], hostileAnimals: Animal[]): void {
        // COMMON METHOD
    }

    protected hide(target: Vector | null, radius: number = 0): Vector {
        const vector = this.seek(target);
        return vector?.negate();
    }

    protected avoidEdges(): Vector {
        let [x, y] = this.location.values;
        let [desx, desy] = [0, 0];

        // checking if already beyond range
        if (x < 0 || y < 0 || x > this.maxWidth || y > this.maxHeight) {
            this.die();
            return new Vector([0, 0]);
        }

        if (x < this.rangeValue) desx = this.maxSpeed;
        else if (x > (this.maxWidth - this.rangeValue)) desx = -this.maxSpeed;

        if (y < this.rangeValue) desy = this.maxSpeed;
        else if (y > (this.maxHeight - this.rangeValue)) desy = -this.maxSpeed;

        if (!desx && !desy) return new Vector([0, 0]);

        let steer = new Vector([desx, desy]).substract(this.velocity);
        steer = this.limitVector(steer, this.maxForce);

        return steer;
    }

    protected seek(target: Vector | null, slowingNear: boolean = true): Vector  {
        if (!target) return new Vector([0, 0]);

        let desired = target.substract(this.location);

        const value = slowingNear && desired.length() < 100 ? desired.length() / 100 : this.maxForce;
        desired = desired.scale(value);

        let steer = desired.substract(this.velocity);
        steer = this.limitVector(steer, this.maxForce);
        return steer;
    }

    protected separate(animals: Animal[], separateRadius: number): Vector {
        const desiredSeparation = separateRadius * 2
        let sum = new Vector([0, 0]);
        let count = 0;

        for (let animal of animals) {
            const d = this.getDistance(animal.location);
            
            if (d > 0 && d < desiredSeparation) {
                let diff = this.location.substract(animal.location);
                diff = diff.scale(d);

                sum = sum.add(diff);
                count++;
            }
        }
        if (count) {
            sum = sum.scale(this.maxSpeed / count);
            let steer = sum.substract(this.velocity);

            steer = this.limitVector(steer, this.maxForce);
            return steer;
        }  
        return new Vector([0, 0]);
    }

    protected cohension(animals: Animal[], cohensionRadius: number): Vector {
        const neighbordist = cohensionRadius * 2;
        let sum = new Vector([0, 0]);
        let count = 0;

        for (let animal of animals) {
            const d = this.getDistance(animal.location);
            if (d > 0 && d < neighbordist) {
                sum = sum.add(animal.location);
                count++;
            }
        }

        if (count) {
            sum = sum.scale(1 / count);
            return this.seek(sum);
        } else 
            return new Vector([0, 0]);
    }

    protected wander(): Vector {
        let desired: Vector = new Vector([
            Math.round(Math.random()* 2 - 1),
            Math.round(Math.random() * 2 - 1)
        ]);
        desired = desired.scale(this.maxForce);

        let steer = desired.substract(this.velocity);
        steer = this.limitVector(steer, this.maxForce);
        return steer;
    }
}