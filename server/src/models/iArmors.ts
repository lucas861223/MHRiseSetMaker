export interface IArmor {
    id: number;
    name: string;
    decoSlots: number;
    skills: number[];
    skillLevels: number[];
    defense: number;
    resistence: number[];
    grade: number[];
}

export class Armor implements IArmor {
    id: number = -1;
    name: string = "";
    decoSlots: number = 0;
    skills: number[] = [];
    skillLevels: number[] = [];
    defense: number = 0;
    resistence: number[] = [];
    grade: number[] = [];
    constructor(decoSlots: number, id?: number, name?: string, skills?: number[], skillLevels?: number[], defense?: number, resistence?: number[], grade?: number[]) {
        if (id != undefined) {
            this.id = id;
        }
        if (name != undefined) {
            this.name = name;
        }
        this.decoSlots = decoSlots;
        if (skills != undefined) {
            this.skills = skills;
        }
        if (skillLevels != undefined) {
            this.skillLevels = skillLevels;
        }
        if (defense != undefined) {
            this.defense = defense;
        }
        if (resistence != undefined) {
            this.resistence = resistence;
        }
        if (grade != undefined) {
            this.grade = grade;
        }
    }
}
