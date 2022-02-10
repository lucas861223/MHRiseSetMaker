export class Armor {
    id: number;
    name: string;
    decoSlots: number;
    skills: number[] = [];
    skillLevels: number[] = [];
    defense: number;
    resistence: number[];

    constructor(id: number, name: string, defense: number, decoSlots: number, resistence: number[], skills?: number[], skillLevels?: number[]) {
        this.id = id;
        this.name = name;
        this.decoSlots = decoSlots;
        this.defense = defense;
        this.resistence = resistence;
        if (skills != undefined) {
            this.skills = skills;
        }
        if (skillLevels != undefined) {
            this.skillLevels = skillLevels;
        }
    }
}