import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface ScoreContestant {
    id: number,
    score: number,
    isHunter: boolean,
}

interface ScoreStorage {
    [id: number]: ScoreContestant,
}

@Injectable({
    providedIn: 'root'
})
export class ScoreService {
    public scoreStorage: BehaviorSubject<ScoreStorage> = new BehaviorSubject({});

    public addContestant(id: number, isHunter = false, update = true): void | [ScoreStorage, number] {
        const contestant: ScoreContestant = {
            id, score: 0, isHunter,
        }
        const value = this.scoreStorage.value;
        const index = Object.values(value).length + 1;
        value[index] = contestant;

       if (update) this.scoreStorage.next(value);
       else return [value, index];
    }

    public addScores(id: number, score: number): void {
        let storage = this.scoreStorage.value;
        let index = Object.values(storage).findIndex((con) => con.id === id) + 1;

        if(index < 1) [storage, index] = this.addContestant(id, false, false) || [{}, 0];

        const contestant = storage[index];
        storage[index] = { ...contestant, score: contestant.score + score }
        
        const array = Object.values(storage).sort((a, b) => b.score - a.score);
        storage = array.reduce((obj, item, index) => {
            obj[index + 1] = item;
            return obj;
        }, {})
        
        this.scoreStorage.next(storage);
    }

    public clearScores(): void {
        this.scoreStorage.next({});
    }
}