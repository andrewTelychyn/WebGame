import { Vector } from "ts-matrix";
import { Animal } from "./animal.model";
import { Bullet } from "./bullet.model";

const MAX_SPEED = 4; 
const BULLETS = 10;

export class Hunter extends Animal {
    public type: string = 'Hunter';
    public color: string = 'black'; 

    private bullets: number = BULLETS;
    public bulletsArray: Bullet[] = [];

    constructor(
        maxHeight: number,
        maxWidth: number
    ) {
        super(maxHeight, maxWidth, () => {});
        this.maxSpeed = MAX_SPEED;
    }

    public move(coord: [number, number]): void {
        const [x, y] = this.location.values;

        if (x < 0 || y < 0 || x > this.maxWidth || y > this.maxHeight) {
            return this.die();
        }
        // console.log(coord);
        // this.acceleration = this.acceleration.add(new Vector(coord));

        let desired = new Vector(coord).scale(1)//.substract(this.velocity);
        // let steer = this.limitVector(desired, this.maxForce);
        this.applyForce(desired);
    }

    public shoot(direct: [number, number]): void {
        if (this.bullets - 1 < 0) return;
        this.bullets--;

        const [x, y] = this.location.values;
        const bullet = new Bullet([x, y], direct, this.removeBullet.bind(this)); 
        this.bulletsArray.push(bullet);
    }

    public removeBullet(id: number): void {
        this.bulletsArray = this.bulletsArray.filter(bul => bul.id !== id);
    }
}