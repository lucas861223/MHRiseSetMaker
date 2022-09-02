import { DECO_SLOT_COMBINATION_LIST } from "../common/DataList";

export class Armor {
    id: number;
    name: string;
    decoSlots: number;
    skills: number[] = [];
    skillLevels: number[] = [];
    defense: number;
    resistence: number[];
    //grade: number[];

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
        //this.grade = DECO_SLOT_COMBINATION_LIST[decoSlots].slots.slice();
    }
}