export class Skill {
    id: number;
    name: string;
    maxLevel: number;
    decoLevel: number;
    description?: string;
    levelDescriptions?: string[];
    desiredLevel = 0;
    oldLevel = 0;

    constructor(id: number, name: string, maxLevel: number, decoLevel: number, desiredLevel?: number, description?: string, levelDescriptions?: string[]) {
        if (typeof description !== 'undefined') {
            this.description = description;
        }
        if (typeof levelDescriptions !== 'undefined') {
            this.levelDescriptions = levelDescriptions;
        }
        if (typeof desiredLevel !== 'undefined') {
            this.desiredLevel = desiredLevel;
        }
        this.id = id;
        this.name = name;
        this.maxLevel = maxLevel;
        this.decoLevel = decoLevel;
    }
}