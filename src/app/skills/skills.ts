export class Skills {
    name: string;
    maxLevel: number;
    decoLevel: number;
    description?: string;
    levelDescriptions?: string[];
    desiredLevel = "0";

    constructor(name: string, maxLevel: number, decoLevel: number, desiredLevel?: string, description?: string, levelDescriptions?: string[]) {
        if (typeof description !== 'undefined') {
            this.description = description;
        }
        if (typeof levelDescriptions !== 'undefined') {
            this.levelDescriptions = levelDescriptions;
        }
        if (typeof desiredLevel !== 'undefined') {
            this.desiredLevel = desiredLevel;
        }
        this.name = name;
        this.maxLevel = maxLevel;
        this.decoLevel = decoLevel;
    }
}