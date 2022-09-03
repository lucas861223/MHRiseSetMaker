import { IArmor, Armor } from '@models/iArmors';
import armorService from '@services/armor-service'
import { IDecoSlot } from '@models/iDecoSlots';
import decoslotService from '@services/decoslot-service'
import { ISkill } from '@models/iSkills'
import { ArmorSet, IArmorSet } from '@models/iSets';
import { ITalisman, Talisman } from '@models/iTalismans'
import skillService from './skill-service';
//import skillService from '@services/armor-service'

// **** Functions **** //

class searchingAlgorithm {
    armor: IArmor[][] = [];
    decoSlots: IDecoSlot[] = [];
    head: Array<Array<IArmor>> = [];
    chest: Array<Array<IArmor>> = [];
    arms: Array<Array<IArmor>> = [];
    waist: Array<Array<IArmor>> = [];
    legs: Array<Array<IArmor>> = [];
    talisman: ITalisman[][] = [];
    talismanList: ITalisman[] = [];
    relevantSkills = new Map<number, number>();
    sortedArmors: Array<Map<number, Array<IArmor>>> = [];
    sortedTalisman = new Map<number, Array<ITalisman>>();
    unmetLevel1 = 0;
    unmetLevel2 = 0;
    unmetLevel3 = 0;
    foundSet: number = 0;
    decos: number[] = [0, 0, 0];
    combinations: IArmorSet[] = [];
    TARGET_SET = 10;
    skills: ISkill[] = [];
    currentCombination = new ArmorSet();

    async findSet(skills: string[], talismans: ITalisman[], target: number): Promise<IArmorSet[]> {
        this.armor = await armorService.getAll();
        this.decoSlots = await decoslotService.getAll();
        this.skills = await skillService.getAll();
        this.talismanList = talismans;
        for (let i = 0; i < skills.length; i += 2) {
            let skill = parseInt(skills[i]);
            let level = parseInt(skills[i + 1]);
            this.relevantSkills.set(skill, level);
            this.relevantSkills.set(-skill, level);
            this.addToUnmetLevels(skill, level);
        }
        this.TARGET_SET = target;
        this.search();
        return this.combinations;
    }

    search() {
        this.gradeArmors(this.head, 0);
        this.gradeArmors(this.chest, 1);
        this.gradeArmors(this.arms, 2);
        this.gradeArmors(this.waist, 3);
        this.gradeArmors(this.legs, 4);
        this.sortedArmors.push(new Map<number, Array<IArmor>>());
        this.talismanList.forEach(talisman => {
            var grade = 0;
            if (this.relevantSkills.has(talisman.skill1ID)) {
                grade += Math.min(this.relevantSkills.get(talisman.skill1ID)!, talisman.skill1Level);
            }
            if (this.relevantSkills.has(talisman.skill2ID)) {
                grade += Math.min(this.relevantSkills.get(talisman.skill2ID)!, talisman.skill2Level);
            }
            if (grade > 0) {
                if (this.talisman.length < grade + 1) {
                    for (let i = this.talisman.length; i <= grade; i++) {
                        this.talisman.push([] as ITalisman[]);
                    }
                }
                this.talisman[grade].push(talisman);
            } else if (talisman.DecoSlotID > 0) {
                if (!this.sortedTalisman.has(talisman.DecoSlotID)) {
                    this.sortedTalisman.set(talisman.DecoSlotID, []);
                }
                this.sortedTalisman.get(talisman.DecoSlotID)!.push(talisman);
            }

        });
        this.recursiveSearch(0);
    }


    recursiveSearch(depth: number): void {
        switch (depth) {
            case 0:
                if (this.canFinish()) {
                    this.calculateFoundSet();
                } else {
                    this.recursivelySearchArmor(this.head, 1);
                }
                break;
            case 1:
                this.recursivelySearchArmor(this.chest, 2);
                break;
            case 2:
                this.recursivelySearchArmor(this.arms, 3);
                break;
            case 3:
                this.recursivelySearchArmor(this.waist, 4);
                break;
            case 4:
                this.recursivelySearchArmor(this.legs, 5);
                break;
            case 5:
                for (let i = this.talisman.length - 1; i >= 1 && this.foundSet < this.TARGET_SET; i--) {
                    for (let talisman of this.talisman[i]) {
                        this.currentCombination.addTalisman(talisman);
                        this.addDecoSlots(talisman.DecoSlotID, true);
                        if (this.relevantSkills.has(-talisman.skill1ID)) {
                            this.addToUnmetLevels(talisman.skill1ID, - Math.min(Math.max(0, this.relevantSkills.get(-talisman.skill1ID)!), talisman.skill1Level));
                        }
                        if (this.relevantSkills.has(-talisman.skill2ID)) {
                            this.addToUnmetLevels(talisman.skill2ID, - Math.min(Math.max(0, this.relevantSkills.get(-talisman.skill2ID)!), talisman.skill2Level));
                        }
                        if (this.canFinish()) {
                            this.calculateFoundSet();
                        }
                        this.addDecoSlots(talisman.DecoSlotID, false);
                        if (this.relevantSkills.has(-talisman.skill1ID)) {
                            this.addToUnmetLevels(talisman.skill1ID, Math.min(Math.max(0, this.relevantSkills.get(-talisman.skill1ID)!), talisman.skill1Level));
                        }
                        if (this.relevantSkills.has(-talisman.skill2ID)) {
                            this.addToUnmetLevels(talisman.skill2ID, Math.min(Math.max(0, this.relevantSkills.get(-talisman.skill2ID)!), talisman.skill2Level));
                        }
                    }
                }
                this.currentCombination.removeTalisman();
                if (this.foundSet < this.TARGET_SET) {
                    for (let key of this.talisman.keys()) {
                        let talisman = new Talisman(key);
                        this.currentCombination.addTalisman(talisman);
                        this.addDecoSlots(key, true);
                        if (this.canFinish()) {
                            //this.printCombo();
                            this.calculateFoundSet();
                        }
                        this.currentCombination.removeTalisman();
                        this.addDecoSlots(key, false);
                    }
                }
                break;
        }
    }

    calculateFoundSet(): void {
        let actualCombinationCount = 1;
        // this.printCombo();
        // let resolvedCombination: string[] = ["", "", "", "", "", ""];
        // for (let i = 0; i < this.currentCombination.length - 1; i++) {
        //     if (this.currentCombination[i] > 0) {
        //         resolvedCombination[i] = this.getArmorFromList(this.currentCombination[i]).name;
        //     } else if (this.currentCombination[i] == this.UNDEFINED_ARMOR) {
        //         resolvedCombination[i] = "any";
        //     } else {
        //         if (this.sortedArmors[i].get(-this.currentCombination[i])!.length == 1) {
        //             resolvedCombination[i] = this.getArmorFromList(this.sortedArmors[i].get(-this.currentCombination[i])![0]).name;
        //         } else {
        //             resolvedCombination[i] = "any piece with " + DECO_SLOT_COMBINATION_LIST[-this.currentCombination[i]].label + " slots";
        //         }
        //     }
        // }
        // if (this.currentCombination[5] > 0) {
        //     resolvedCombination[5] = this.talismanList.get(this.currentCombination[5])!.label;
        // } else if (this.currentCombination[5] == this.UNDEFINED_ARMOR) {
        //     resolvedCombination[5] = "any";
        // } else {
        //     resolvedCombination[5] = "any talisman with " + DECO_SLOT_COMBINATION_LIST[-this.currentCombination[5]].label + " slots";
        // }
        this.combinations.push(this.currentCombination.copy());
        //console.log(this.combinations);
        this.foundSet += actualCombinationCount;
    }

    recursivelySearchArmor(list: Array<Array<IArmor>>, next: number): void {
        for (let i = list.length - 1; i >= 1; i--) {
            for (let armor of list[i]) {
                this.addArmor(armor, next);
                if (this.canFinish()) {
                    //this.printCombo();
                    this.calculateFoundSet();
                    this.removeArmor(armor, next);
                    continue;
                }
                if (this.foundSet < this.TARGET_SET) {
                    this.recursiveSearch(next);
                } else {
                    break;
                }
                this.removeArmor(armor, next);
            }
        }
        if (this.foundSet < this.TARGET_SET) {
            for (let key of this.sortedArmors[next - 1].keys()) {
                let armor = new Armor(key);
                this.currentCombination.addArmor(armor, next);
                if (this.canFinish()) {
                    //this.printCombo();
                    this.calculateFoundSet();
                    this.removeArmor(armor, next);
                    continue;
                }
                if (this.foundSet < this.TARGET_SET) {
                    this.recursiveSearch(next);
                } else {
                    break;
                }
                this.removeArmor(armor, next);
            }
        }
    }

    // printCombo(): void {
    //     let x = "";
    //     this.decos = [0, 0, 0];
    //     for (let i = 0; i < this.currentCombination.length - 1; i++) {
    //         if (this.currentCombination[i] > 0) {
    //             x += this.getArmorFromList(this.currentCombination[i]).name + ",\t";
    //             console.log(this.getArmorFromList(this.currentCombination[i]).name + "\t" + this.getArmorFromList(this.currentCombination[i]).grade);
    //             this.addDecoSlots(this.getArmorFromList(this.currentCombination[i]).decoSlots, true)
    //         } else if (this.currentCombination[i] != this.UNDEFINED_ARMOR) {
    //             x += DECO_SLOT_COMBINATION_LIST[-this.currentCombination[i]].slots + ",\t";
    //             this.addDecoSlots(-this.currentCombination[i], true)
    //         } else {
    //             x += "any,\t";
    //         }
    //     }
    //     if (this.currentCombination[5] > 0) {
    //         x += this.talismanList.get(this.currentCombination[5])!.label;
    //     } else if (this.currentCombination[5] == this.UNDEFINED_ARMOR) {
    //         x += "any";
    //     } else {
    //         x += DECO_SLOT_COMBINATION_LIST[-this.currentCombination[5]].label;
    //     }
    //     x += "\n" + this.decos + "\t[" + this.unmetLevel3 + "\, " + this.unmetLevel2 + ", " + this.unmetLevel1 + "]";
    //     console.log(x);
    // }

    addDecoSlots(combination: number, isAdding: boolean): void {
        if (this.decoSlots[combination].slot1 > 0) {
            this.decos[Math.abs(this.decoSlots[combination].slot1 - 3)] += isAdding ? 1 : -1;
        }
        if (this.decoSlots[combination].slot2 > 0) {
            this.decos[Math.abs(this.decoSlots[combination].slot2 - 3)] += isAdding ? 1 : -1;
        }
        if (this.decoSlots[combination].slot3 > 0) {
            this.decos[Math.abs(this.decoSlots[combination].slot3 - 3)] += isAdding ? 1 : -1;
        }

    }

    canFinish(): boolean {
        let carryover = 0;
        if (this.unmetLevel3 > this.decos[0]) {
            return false;
        }
        carryover += this.decos[0] - this.unmetLevel3;
        if (this.unmetLevel2 > this.decos[1] + carryover) {
            return false;
        }
        carryover = this.decos[1] + carryover - this.unmetLevel2;
        return carryover + this.decos[2] >= this.unmetLevel1;
    }

    addToUnmetLevels(skillID: number, change: number): void {
        switch (this.skills[skillID - 1].decoLevel) {
            case 1:
                this.unmetLevel1 += change;
                break;
            case 2:
                this.unmetLevel2 += change;
                break;
            case 3:
                this.unmetLevel3 += change;
                break;
        }
    }

    removeArmor(armor: IArmor, index: number): void {
        this.currentCombination.removeArmor(index);
        this.addDecoSlots(armor.decoSlots, false);
        for (let i = 0; i < armor.skills.length; i++) {
            if (this.relevantSkills.has(-armor.skills[i])) {
                if (this.relevantSkills.get(-armor.skills[i])! >= 0) {
                    this.addToUnmetLevels(armor.skills[i], armor.skillLevels[i]);
                } else if (Math.abs(this.relevantSkills.get(-armor.skills[i])!) < armor.skillLevels[i]) {
                    this.addToUnmetLevels(armor.skills[i], armor.skillLevels[i] + this.relevantSkills.get(-armor.skills[i])!);
                }
                this.relevantSkills.set(-armor.skills[i], this.relevantSkills.get(-armor.skills[i])! + armor.skillLevels[i]);
            }
        }
    }

    addArmor(armor: IArmor, index: number): void {
        this.currentCombination.addArmor(armor, index);
        this.addDecoSlots(armor.decoSlots, true);
        for (let i = 0; i < armor.skills.length; i++) {
            if (this.relevantSkills.has(-armor.skills[i])) {
                this.addToUnmetLevels(armor.skills[i], -Math.min(Math.max(0, this.relevantSkills.get(-armor.skills[i])!), armor.skillLevels[i]));
                this.relevantSkills.set(-armor.skills[i], this.relevantSkills.get(-armor.skills[i])! - armor.skillLevels[i]);
            }
        }
    }

    gradeArmors(result: Array<Array<IArmor>>, index: number) {
        this.sortedArmors.push(new Map<number, Array<IArmor>>());
        this.armor[index].forEach(armor => {
            var grade = 0;
            for (let i = 0; i < armor.skills.length; i++) {
                if (this.relevantSkills.has(armor.skills[i])) {
                    grade += Math.min(this.relevantSkills.get(armor.skills[i])!, armor.skillLevels[i]);
                }
            }
            if (grade > 0) {
                if (result.length < grade + 1) {
                    for (let i = result.length; i <= grade; i++) {
                        result.push([] as Array<IArmor>);
                    }
                }
                result[grade].push(armor);
            } else if (armor.decoSlots > 0) {
                if (!this.sortedArmors[index].has(armor.decoSlots)) {
                    this.sortedArmors[index].set(armor.decoSlots, []);
                }
                this.sortedArmors[index].get(armor.decoSlots)!.push(armor);
            }
        });
    }
}





async function findSet(skills: string, talismans: string, target: string): Promise<IArmorSet[]> {
    let search = new searchingAlgorithm();
    let talismanList: Talisman[] = [];
    let talismanStringLits = talismans.split(",");
    for (let i = 0; i < talismanStringLits.length; i++) {
        talismanList.push(Talisman.formTalisman(i + 1, talismanStringLits[i]));
    }
    return search.findSet(skills.split(","), talismanList, parseInt(target));
}

export default {
    findSet
} as const;
