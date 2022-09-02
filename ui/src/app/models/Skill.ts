export class Skill {
    id: number = 0;
    name: string = "";
    maxLevel: number = 0;
    decoLevel: number = 0;
    description?: string;
    levelDescriptions?: string[];
    desiredLevel = 0;
    oldLevel = 0;

    constructor(init: Partial<Skill>) {
        Object.assign(this, init);
    }
}