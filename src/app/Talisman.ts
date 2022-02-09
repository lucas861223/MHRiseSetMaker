import { SKILL_LIST } from "./SkillList";
import { DECO_SLOT_COMBINATION_LIST } from "./DecoSlotCombinationList";
export class Talisman {
    skill1ID: number = 0;
    skill1Level: number = 0;
    skill2ID: number = 0;
    skill2Level: number = 0;
    DecoSlotID: number;
    label: string = "";

    constructor(DecoSlotID: number, skill1ID?: number, skill1Level?: number, skill2ID?: number, skill2Level?: number) {
        if (typeof skill1ID !== 'undefined') {
            this.skill1ID = skill1ID;
        }
        if (typeof skill1Level !== 'undefined') {
            this.skill1Level = skill1Level;
        }
        if (typeof skill2Level !== 'undefined') {
            if (this.skill1ID <= 0) {
                this.skill1Level = skill2Level;
            } else {
                this.skill2Level = skill2Level;
            }
        }
        if (typeof skill2ID !== 'undefined') {
            if (this.skill1ID <= 0) {
                this.skill1ID = skill2ID;
            } else {
                this.skill2ID = skill2ID;
            }
        }
        this.DecoSlotID = DecoSlotID;
        this.makeNewName();
    }

    setSkill1(skill1ID: number, skill1Level: number) {
        this.skill1ID = skill1ID;
        this.skill1Level = skill1Level;
        this.makeNewName();
    }

    makeNewName() {
        this.label = "";
        if (this.skill1ID > 0) {
            this.label += SKILL_LIST[this.skill1ID - 1].name + " " + this.skill1Level + "/";
        }
        if (this.skill2ID > 0) {
            this.label += SKILL_LIST[this.skill2ID - 1].name + " " + this.skill2Level + "/";
        }
        this.label += DECO_SLOT_COMBINATION_LIST[this.DecoSlotID - 1].label;
    }

    setSkill2(skill2ID: number, skill2Level: number) {
        if (this.skill1ID <= 0) {
            this.skill1ID = skill2ID;
            this.skill1Level = skill2Level;
        } else {
            this.skill2ID = skill2ID;
            this.skill2Level = skill2Level;
        }
        this.makeNewName();
    }
}