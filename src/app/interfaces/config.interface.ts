export interface Config {
    maxHeight?: number,
    maxWidth?: number,

    // HUNTER
    hunterSpeed: number,

    // COMMON ANIMAL
    animalSpeed: number,
    animalForce: number,
    animalAvoidRange: number,

    // BULLET
    bulletAmount: number,
    bulletSpeed: number,
    bulletDistance: number,
    bulletRadius: number,

    // BUNNY 
    bunnySpeed: number,
    bunnyRadius: number,

    // DEER
    deerCohension: number,
    deerCasualSeparate: number,
    deerHostileSeparate: number,
    deerSpeed: number,

    // WOLF
    wolfSpeed: number,
    wolfHuntRadius: number,
    wolfKillRadius: number,
    wolfHungerLimit: number,
    wolfKillingIncrement: number,
    wolfCannibalismCoef: number,
    wolfNoHarmCoef: number,
    wolfNoHuntCoef: number,

    // AMOUNT
    minDeers: number,
    maxDeers: number,
    minBunnies: number,
    maxBunnies: number,
    minWolves: number,
    maxWolves: number,

    // SCORES
    scores: [number, number, number, number],
}