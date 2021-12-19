import { Vector } from 'ts-matrix';

const RADIUS = 3;
const MAX_SPEED = 4;
const MAX_FORCE = 1;
const RANGE_VALUE = 25;

export class Animal {
    public type: string = "Animal";
    public color: string = "black";

    public id: number;
    public location : Vector;
    private velocity : Vector;
    public acceleration : Vector;

    public maxSpeed: number;
    private maxForce: number;
    private radius: number;

    private maxWidth: number;
    private maxHeight: number;

    constructor(x: number, y: number, maxHeight: number, maxWidth: number) {
        this.id = Date.now() + Math.round(Math.random() * 100);
        this.location = new Vector([x, y]);
        this.velocity = new Vector([0, 0]);
        this.acceleration = new Vector([0, 0]);

        this.radius = RADIUS;
        this.maxSpeed = MAX_SPEED;
        this.maxForce = MAX_FORCE;

        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;
    }

    public update(): void {
        this.velocity = this.acceleration.values[0] ? this.velocity.add(this.acceleration): this.acceleration;
        this.velocity = this.limitVector(this.velocity, this.maxSpeed);
        this.location = this.location.add(this.velocity);
        this.acceleration = new Vector([0, 0]);
    }

    protected applyForce(force: Vector): void {
        this.acceleration = this.acceleration.add(force);
    }

    private limitVector(vector: Vector, max: number) : Vector {
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

    public applyBehaviours(allAnimals: Animal[], similarAnimals: Animal[], hostileAnimals: Animal[]): void {
        // COMMON METHOD
    }

    public hide(target: Vector | null): Vector | undefined {
        const vector = this.seek(target);
        return vector?.negate();
    }

    public avoidEdges(): Vector | undefined {
        let [x, y] = this.location.values;
        let [desx, desy] = [0, 0];

        if (x < RANGE_VALUE) desx = this.maxSpeed;
        else if (y > (this.maxWidth - RANGE_VALUE)) desx = -this.maxSpeed;

        if (y < RANGE_VALUE) y = this.maxSpeed;
        else if (y > (this.maxHeight - RANGE_VALUE)) desy = - this.maxSpeed;

        if (!desx && !desy) return;

        let steer = new Vector([desx, desy]).substract(this.velocity);
        steer = this.limitVector(steer, this.maxForce);

        return steer;
    }

    public seek(target: Vector | null): Vector | undefined {
        if (!target) return;

        let [x, y] = this.location.values;
        let desired: Vector;
        desired = target.substract(this.location);

        const value = desired.length() < 100 ? desired.length() / 100 : this.maxForce;
        desired = desired.scale(value);

        let steer = desired.substract(this.velocity);
        steer = this.limitVector(steer, this.maxForce);
        return steer;
    }

    public separate(animals: Animal[], separateRadius: number): Vector | undefined {
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
        return;
    }

    public cohension(animals: Animal[], cohensionRadius: number): Vector {
        const neighbordist = cohensionRadius;
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
            return this.seek(sum) || new Vector([0, 0]);
        } else 
            return new Vector([0, 0]);
    }

    public wander(): Vector {
        let desired: Vector = new Vector([Math.round(Math.random()* 2 - 1), Math.round(Math.random() * 2 - 1)]);
        desired = desired.scale(this.maxForce);
        let steer = desired.substract(this.velocity);
        steer = this.limitVector(steer, this.maxForce);
        return steer;
    }
}