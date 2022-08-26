import { SKILL_LIST } from "./SkillList";
import { Subject } from 'rxjs';
import { DECO_SLOT_COMBINATION_LIST } from "./DecoSlotCombinationList";

export class Talisman {
    skill1ID: number = 0;
    skill1Level: number = 0;
    skill2ID: number = 0;
    skill2Level: number = 0;
    DecoSlotID: number;
    label: string = "";
    identifier: number;

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
        this.identifier = 0;
        this.makeNewName();
    }

    setSkill1(skill1ID: number, skill1Level: number) {
        this.skill1ID = skill1ID;
        this.skill1Level = skill1Level;
        this.makeNewName();
    }

    makeNewName() {
        this.identifier = 0;
        this.label = "";
        if (this.skill1ID > 0) {
            this.label += SKILL_LIST[this.skill1ID - 1].name + " " + this.skill1Level + "/";
            this.identifier += this.skill1ID * 10 + this.skill1Level;
        }
        if (this.skill2ID > 0) {
            this.label += SKILL_LIST[this.skill2ID - 1].name + " " + this.skill2Level + "/";
            if (this.skill2ID > this.skill1ID) {
                this.identifier = this.identifier * 10 + this.skill2ID * 10 + this.skill2Level;
            } else {
                this.identifier += (this.skill2ID * 10 + this.skill2Level) * 10;
            }
        }
        this.label += DECO_SLOT_COMBINATION_LIST[this.DecoSlotID].label;
        this.identifier = this.identifier * 10 + this.DecoSlotID;
    }

    setSkill2(skill2ID: number, skill2Level: number) {
        if (this.skill1ID == 0) {
            this.skill1ID = skill2ID;
            this.skill1Level = skill2Level;
        } else {
            this.skill2ID = skill2ID;
            this.skill2Level = skill2Level;
        }
        this.makeNewName();
    }
}