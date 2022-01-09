import { Injectable } from "@angular/core";
import { Animal } from "../model/animal.model";
import { Bunny } from "../model/bunny.model";
import { Deer } from "../model/deer.model";
import { Hunter } from "../model/hunter.model";
import { Wolf } from "../model/wolf.model";
import { ConfigSerivce } from "./config.service";
import { ScoreService } from "./score.service";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public bulletsViewArray: boolean[] = [];
    public isStopGame: boolean = true;

    public animals: Animal[] = []
    public deers: Deer[] = [];
    public wolves: Wolf[] = [];
    public bunnies: Bunny[] = [];

    public greenAnimals: Animal[] = []; 
    public hostileAnimals: Animal[] = []; 
    public hunter!: Hunter | null;

    private maxWidth!: number;
    private maxHeight!: number;

    constructor(private configService: ConfigSerivce, private scoreService: ScoreService) {}

    public initRanges(maxWidth: number, maxHeight: number) {
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;

        this.configService.update({
            maxHeight,
            maxWidth,
        });
    }

    public emptyData(): void {
        this.animals = [];
        this.wolves = [];
        this.deers = [];
        this.greenAnimals = [];
        this.hunter = null;

        this.scoreService.clearScores();
    }

    public initData(): void {
        if (!this.maxHeight || !this.maxWidth) return;

        this.isStopGame = false;

        this.initDeer();
        this.initBunny();
        this.initWolf();
        this.addHunter();
    }

    public addHunter(): void {
        if (this.hunter) return; 

        this.hunter = new Hunter(
            this.configService.configSubject.value,
            this.updateBulletsView.bind(this),
            this.killAnimal.bind(this)
        );
        this.animals.push(this.hunter);
        this.hostileAnimals.push(this.hunter);

        this.updateBulletsView();
        this.scoreService.addContestant(this.hunter.id, true);
    }

    public addAnimal(): void {
        if (!this.maxHeight || !this.maxWidth) return;

        const animal = new Animal(
            this.configService.configSubject.value,
            this.killAnimal.bind(this)
          );

        this.animals.push(animal);
    }

    public addDeer(): void {
        const deer = new Deer(
            this.configService.configSubject.value,
            this.killAnimal.bind(this)
        )
        this.animals.push(deer);
        this.deers.push(deer);
        this.greenAnimals.push(deer);
    }

    public addWolf(): void {
        const wolf = new Wolf(
            this.configService.configSubject.value,
            this.killAnimal.bind(this)
        );

        this.animals.push(wolf);
        this.wolves.push(wolf);
        this.hostileAnimals.push(wolf);

        this.scoreService.addContestant(wolf.id);
    } 

    public addBunny(): void {
        const bunny = new Bunny(
            this.configService.configSubject.value,
            this.killAnimal.bind(this)
          );
          this.animals.push(bunny);
          this.greenAnimals.push(bunny);
          this.bunnies.push(bunny)
    }

    public killAnimal(id: number, killerId?: number): void {
        this.greenAnimals = this.greenAnimals.filter((an) => an.id !== id);
        this.animals = this.animals.filter((an) => an.id !== id);

        const deerIndex = this.deers.findIndex((an) => an.id == id);
        const wolfIndex = this.wolves.findIndex((an) => an.id == id);
        const bunnyIndex = this.bunnies.findIndex((an) => an.id == id);

        let animalScoreIndex;

        if (deerIndex >= 0) {
            this.deers.splice(deerIndex, 1);
            animalScoreIndex = 0;
        }
        if (bunnyIndex >= 0) {
            this.bunnies.splice(bunnyIndex, 1);
            animalScoreIndex = 1;    
        }
        if (wolfIndex >= 0) {
            this.wolves.splice(wolfIndex, 1);
            animalScoreIndex = 2;
        }
        if (this.hunter && id === this.hunter.id) {
            this.hunter = null;
            animalScoreIndex = 3;
            this.isStopGame = true;
        }

        if (killerId && animalScoreIndex !== undefined) {
            const config = this.configService.configSubject.value;
            this.scoreService.addScores(killerId, config.scores[animalScoreIndex]);
        }
    }

    public updateIteration(drawCallback: (entity: any, size?: number) => void): void {
        this.animals.map((an: Animal) => {
            switch(an.type) {
                case ("Wolf"): 
                    (an as Wolf).applyBehaviours(
                        this.animals,
                        this.greenAnimals.concat(this.hunter || []),
                    );
                    (an as Wolf).addHunger();
                    break;
                case ("Bunny"):
                    (an as Bunny).applyBehaviours(
                        this.greenAnimals.filter(a => a.id !== an.id),
                        this.hostileAnimals
                    );
                    break;
                case ("Deer"): 
                    (an as Deer).applyBehaviours(
                        this.animals,
                        this.deers,
                        this.hostileAnimals,
                    );
                    break;
            }
            
            an.update();
            drawCallback(an);
        });

        this.hunter?.bulletsArray.map((bul) => {
            drawCallback(bul, 1);
            bul.update(this.animals);
        })
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

    private updateBulletsView(): void {
        const limit = this.configService.configSubject.value.bulletAmount;
        this.bulletsViewArray = [];

        for(let i = 0; i < limit; i++) {
            this.bulletsViewArray.push(
                !(!this.hunter || this.hunter.bulletRemain <= i)
            );
        }

        if (this.hunter && !this.hunter.bulletRemain) this.isStopGame = true;
    }

    private initDeer(): void {
        const config = this.configService.configSubject.value;

        const deerAmount = Math.round(
            Math.random() * (config.maxDeers - config.minDeers) + config.minDeers
        );

        for(let i = 0; i < deerAmount; i++) {
          this.addDeer();
        }
    }

    private initBunny(): void {
        const config = this.configService.configSubject.value;

        const bunnyAmount = Math.round(
            Math.random() * (config.maxBunnies - config.minBunnies) + config.minBunnies
        );

        for(let i = 0; i < bunnyAmount; i++) {
          this.addBunny();
        }
    }

    private initWolf(): void {
        const config = this.configService.configSubject.value;

        const wolvesAmount = Math.round(
            Math.random() * (config.maxWolves - config.minWolves) + config.minWolves
        );

        for(let i = 0; i < wolvesAmount; i++) {
          this.addWolf();
        }
    }
}