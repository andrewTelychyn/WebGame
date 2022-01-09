import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Config } from "../interfaces/config.interface";

@Injectable({
    providedIn: 'root'
})
export class ConfigSerivce {
    public configSubject: BehaviorSubject<Config>;

    constructor() {
        this.configSubject = new BehaviorSubject({
            // HUNTER
            hunterSpeed: 4,

            // ANIMAL
            animalSpeed: 4,
            animalAvoidRange: 25,
            animalForce: 1,

            // BULLET
            bulletAmount: 10,
            bulletSpeed: 8,
            bulletDistance: 32,
            bulletRadius: 3,

            // BUNNY
            bunnyRadius: 30,
            bunnySpeed: 4,

            // DEER
            deerCohension: 30,
            deerCasualSeparate: 3,
            deerHostileSeparate: 40,
            deerSpeed: 2,

            // WOLF
            wolfSpeed: 3,
            wolfHuntRadius: 30,
            wolfKillRadius: 5,
            wolfHungerLimit: 200,
            wolfKillingIncrement: 0.25,
            wolfCannibalismCoef: 0.2,
            wolfNoHarmCoef: 0.66,
            wolfNoHuntCoef: 0.75,

            // AMOUNT
            minDeers: 5,
            maxDeers: 10,
            minBunnies: 3,
            maxBunnies: 5,
            minWolves: 0,
            maxWolves: 2,

            // SCORES
            scores: [
                2,  // per DEER 
                5,  // per BUNNY
                10, // per WOLF 
                15, // per HUNTER
            ],
        });
    }

    public update(obj: Partial<Config>): void {
        const value = {...this.configSubject.value, ...obj };
        this.configSubject.next(value);
    }
}