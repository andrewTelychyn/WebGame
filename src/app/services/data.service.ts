import { Injectable } from "@angular/core";
import { Animal } from "../model/animal.model";
import { Bunny } from "../model/bunny.model";
import { Deer } from "../model/deer.model";
import { Hunter } from "../model/hunter.model";
import { Wolf } from "../model/wolf.model";

const MIN_DEERS = 3;
const MAX_DEERS = 10;
const MIN_BUNNIES = 2;
const MAX_BUNNIES = 5;
const MIN_WOLVES = 0;
const MAX_WOLVES = 2;

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public animals: Animal[] = []
    public deers: Deer[] = [];
    public wolves: Wolf[] = [];

    public greenAnimals: Animal[] = []; 
    public hostileAnimals: Animal[] = []; 

    public hunter!: Hunter | null;

    private maxWidth!: number;
    private maxHeight!: number;

    public initRanges(maxWidth: number, maxHeight: number) {
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;

        this.hunter = new Hunter(this.maxHeight, this.maxWidth);
        this.animals.push(this.hunter);
        this.hostileAnimals.push(this.hunter);
    }

    public emptyData(): void {
        this.animals = [];
        this.wolves = [];
        this.deers = [];
        this.greenAnimals = [];
    }

    public initData(): void {
        if (!this.maxHeight || !this.maxWidth) return;

        this.initDeer();
        this.initBunny();
        this.initWolf();
    }

    public addAnimal(): void {
        if (!this.maxHeight || !this.maxWidth) return;

        const animal = new Animal(
            this.maxHeight,
            this.maxWidth,
            this.killAnimal.bind(this)
          );

        this.animals.push(animal);
    }

    private initDeer(): void {
        const deerAmount = Math.round(
            Math.random() * (MAX_DEERS - MIN_DEERS) + MIN_DEERS
        );

        for(let i = 0; i < deerAmount; i++) {
          this.addDeer();
        }
    }

    private initBunny(): void {
        const bunnyAmount = Math.round(
            Math.random() * (MAX_BUNNIES - MIN_BUNNIES) + MIN_BUNNIES
        );

        for(let i = 0; i < bunnyAmount; i++) {
          this.addBunny();
        }
    }

    private initWolf(): void {
        const wolvesAmount = Math.round(
            Math.random() * (MAX_WOLVES - MIN_WOLVES) + MIN_WOLVES
        );

        for(let i = 0; i < wolvesAmount; i++) {
          this.addWolf();
        }
    }

    public addDeer(): void {
        const deer = new Deer(
            this.maxHeight,
            this.maxWidth,
            this.killAnimal.bind(this)
        )
        this.animals.push(deer);
        this.deers.push(deer);
        this.greenAnimals.push(deer);
    }

    public addWolf(): void {
        const wolf = new Wolf(
            this.maxHeight,
            this.maxWidth,
            this.killAnimal.bind(this)
        );

        this.animals.push(wolf);
        this.wolves.push(wolf);
        this.hostileAnimals.push(wolf);
    } 

    public addBunny(): void {
        const bunny = new Bunny(
            this.maxHeight,
            this.maxWidth,
            this.killAnimal.bind(this)
          );
          this.animals.push(bunny);
          this.greenAnimals.push(bunny);
    }

    public killAnimal(id: number): void {
        this.animals = this.animals.filter((an) => an.id !== id);
        this.greenAnimals = this.greenAnimals.filter((an) => an.id !== id);
        this.deers = this.deers.filter((an) => an.id !== id);
        this.wolves = this.wolves.filter((an) => an.id !== id);

        if (this.hunter && id === this.hunter.id) this.hunter = null;
    }

    public keyPressHandler(key: string) {
        if (!this.hunter) return;

        if (key === 'w') this.hunter.move([0, -1]);
        if (key === 'a') this.hunter.move([-1, 0]);
        if (key === 's') this.hunter.move([0, 1]);
        if (key === 'd') this.hunter.move([1, 0]);

        if (key === 'ArrowRight') this.hunter.shoot([-1, 0]);
        if (key === 'ArrowLeft') this.hunter.shoot([1, 0]);
        if (key === 'ArrowUp') this.hunter.shoot([0, 1]);
        if (key === 'ArrowDown') this.hunter.shoot([0, -1]);
    }
}