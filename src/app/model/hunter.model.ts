import { Vector } from "ts-matrix";
import { Animal } from "./animal.model";
import { Bullet } from "./bullet.model";
import { Config } from "../interfaces/config.interface";

export class Hunter extends Animal {
    public type: string = 'Hunter';
    public color: string = 'black'; 

    public bulletsArray: Bullet[] = [];
    public bulletRemain: number;

    constructor(
        private config: Config,
        private shootCallback: () => void,
        dieCallback: (id: number, killerId?: number) => void
    ) {
        super(config, dieCallback);
        this.maxSpeed = config.hunterSpeed;
        this.bulletRemain = config.bulletAmount;

    }

    public move(coord: [number, number]): void {
        const [x, y] = this.location.values;

        if (x < 0 || y < 0 || x > this.maxWidth || y > this.maxHeight) {
            return this.die();
        }

        let desired = new Vector(coord).scale(1);
        this.applyForce(desired);
    }

    public shoot(direct: [number, number]): void {
        if (this.bulletRemain - 1 < 0) return;
        this.bulletRemain--;
        this.shootCallback();

        const [x, y] = this.location.values;
        const bullet = new Bullet(
            [x, y],
            direct,
            this.config,
            this.id,
            this.removeBullet.bind(this)
        ); 
        this.bulletsArray.push(bullet);
    }

    public removeBullet(id: number): void {
        this.bulletsArray = this.bulletsArray.filter(bul => bul.id !== id);
    }
}