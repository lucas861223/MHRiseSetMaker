import { Component, OnInit } from '@angular/core';
import { ARMOR_LIST } from '../ArmorList';
import { Armor } from '../Armor';
import { SKILL_LIST } from '../SkillList';
import { SkillSetSharingService } from '../SkillSetSharingService';
import { TalismanSharingService } from '../TalismanSharingService';
import { Talisman } from '../Talisman';
import { DECO_SLOT_COMBINATION_LIST } from '../DecoSlotCombinationList';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  constructor(sharingService: SkillSetSharingService,
    talismanService: TalismanSharingService) {
    sharingService.getObservable().subscribe(value => {
      if (value[1] > 0) {
        this.relevantSkills.set(value[0], value[1]);
      } else if (this.relevantSkills.has(value[0])) {
        this.relevantSkills.delete(value[0]);
      }
    })
    talismanService.getObservable().subscribe(value => {
      if (value[0] < 0) {
        this.talismanList.delete(Math.abs(value[0]));
      } else {
        this.talismanList.set(value[0], value[1]!);
      }
    })
  }

  head: Array<Array<number>> = [];
  chest: Array<Array<number>> = [];
  arms: Array<Array<number>> = [];
  waist: Array<Array<number>> = [];
  legs: Array<Array<number>> = [];
  grades: Array<Array<number>> = [];
  requirements: Array<Array<number>> = [];
  talisman: Array<Array<number>> = [];
  talismanList = new Map<number, Talisman>();
  relevantSkills = new Map<number, number>();
  sortedArmors: Array<Map<number, Array<number>>> = [];
  unmetLevel1 = 0;
  unmetLevel2 = 0;
  unmetLevel3 = 0;
  foundSet: number = 0;
  decos: Array<number> = [0, 0, 0];
  combinations: Array<Array<string>> = [];
  UNDEFINED_ARMOR = -200;
  TARGET_SET = 10;
  currentCombination: Array<number> = [this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR];

  ngOnInit(): void {

  }

  gradeArmors(result: Array<Array<number>>, index: number) {
    this.sortedArmors.push(new Map<number, Array<number>>());
    ARMOR_LIST[index].forEach(armor => {
      var grade = 0;
      for (let i = 0; i < armor.skills.length; i++) {
        if (this.relevantSkills.has(armor.skills[i])) {
          grade += Math.min(this.relevantSkills.get(armor.skills[i])!, armor.skillLevels[i]);
        }
      }
      if (grade > 0) {
        if (result.length < grade + 1) {
          for (let i = result.length; i <= grade; i++) {
            result.push([] as Array<number>);
          }
        }
        result[grade].push(armor.id);
      } else if (armor.decoSlots > 0) {
        if (!this.sortedArmors[index].has(armor.decoSlots)) {
          this.sortedArmors[index].set(armor.decoSlots, []);
        }
        this.sortedArmors[index].get(armor.decoSlots)!.push(armor.id);
      }
    });
  }

  search(): void {
    this.head = [];
    this.chest = [];
    this.arms = [];
    this.waist = [];
    this.legs = [];
    this.grades = [];
    this.talisman = [];
    this.combinations = [];
    this.foundSet = 0;
    this.sortedArmors = [];
    this.unmetLevel1 = 0;
    this.unmetLevel2 = 0;
    this.unmetLevel3 = 0;
    this.gradeArmors(this.head, 0);
    this.gradeArmors(this.chest, 1);
    this.gradeArmors(this.arms, 2);
    this.gradeArmors(this.waist, 3);
    this.gradeArmors(this.legs, 4);
    this.decos = [0, 0, 0];
    this.currentCombination = [this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR, this.UNDEFINED_ARMOR];
    for (let key of this.relevantSkills.keys()) {
      if (key > 0) {
        this.addToUnmetLevels(key, this.relevantSkills.get(key)!);
        this.relevantSkills.set(-key, this.relevantSkills.get(key)!);
      }
    }
    this.sortedArmors.push(new Map<number, Array<number>>());
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
            this.talisman.push([] as Array<number>);
          }
        }
        this.talisman[grade].push(talisman.identifier);
      } else if (talisman.DecoSlotID > 0) {
        if (!this.sortedArmors[5].has(talisman.DecoSlotID)) {
          this.sortedArmors[5].set(talisman.DecoSlotID, []);
        }
        this.sortedArmors[5].get(talisman.DecoSlotID)!.push(talisman.identifier);
      }

    });
    console.log("head\t" + this.head.join("\t") + "\nchest\t" + this.chest.join("\t") + "\narms\t" + this.arms.join("\t") + "\nwaist\t" + this.waist.join("\t") + "\nlegs\t" + this.legs.join("\t") + "\ntalisman\t" + this.talisman.join("\t"));
    console.log(this.relevantSkills);
    this.recursiveSearch(0);
  }

  recursiveSearch(depth: number): void {
    switch (depth) {
      case 0:
        if (this.canFinish()) {
          this.calculateFoundSet();
        } else {
          this.recursiveSearchArmor(this.head, 1);
        }
        break;
      case 1:
        this.recursiveSearchArmor(this.chest, 2);
        break;
      case 2:
        this.recursiveSearchArmor(this.arms, 3);
        break;
      case 3:
        this.recursiveSearchArmor(this.waist, 4);
        break;
      case 4:
        this.recursiveSearchArmor(this.legs, 5);
        break;
      case 5:
        for (let i = this.talisman.length - 1; i >= 1 && this.foundSet < this.TARGET_SET; i--) {
          for (let talismanID of this.talisman[i]) {
            let talisman = this.talismanList.get(talismanID)!;
            this.currentCombination[5] = talismanID;
            this.addDecoSlots(talisman.DecoSlotID, true);
            if (this.relevantSkills.has(-talisman.skill1ID)) {
              this.addToUnmetLevels(talisman.skill1ID, - Math.min(Math.max(0, this.relevantSkills.get(-talisman.skill1ID)!), talisman.skill1Level));
            }
            if (this.relevantSkills.has(-talisman.skill2ID)) {
              this.addToUnmetLevels(talisman.skill2ID, - Math.min(Math.max(0, this.relevantSkills.get(-talisman.skill2ID)!), talisman.skill2Level));
            }
            if (this.canFinish()) {
              this.calculateFoundSet();
              //this.printCombo();
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
        if (this.foundSet < this.TARGET_SET) {
          for (let key of this.sortedArmors[5].keys()) {
            this.currentCombination[5] = -key;
            this.addDecoSlots(key, true);
            if (this.canFinish()) {
              //this.printCombo();
              this.calculateFoundSet();
            }
            this.addDecoSlots(key, false);
          }
        }
        break;
    }
  }

  calculateFoundSet(): void {
    let actualCombinationCount = 1;
    this.printCombo();
    let resolvedCombination: string[] = ["", "", "", "", "", ""];
    for (let i = 0; i < this.currentCombination.length - 1; i++) {
      if (this.currentCombination[i] > 0) {
        resolvedCombination[i] = this.getArmorFromList(this.currentCombination[i]).name;
      } else if (this.currentCombination[i] == this.UNDEFINED_ARMOR) {
        resolvedCombination[i] = "any";
      } else {
        if (this.sortedArmors[i].get(-this.currentCombination[i])!.length == 1) {
          resolvedCombination[i] = this.getArmorFromList(this.sortedArmors[i].get(-this.currentCombination[i])![0]).name;
        } else {
          resolvedCombination[i] = "any piece with " + DECO_SLOT_COMBINATION_LIST[-this.currentCombination[i]].label + " slots";
        }
      }
    }
    if (this.currentCombination[5] > 0) {
      resolvedCombination[5] = this.talismanList.get(this.currentCombination[5])!.label;
    } else if (this.currentCombination[5] == this.UNDEFINED_ARMOR) {
      resolvedCombination[5] = "any";
    } else {
      resolvedCombination[5] = "any talisman with " + DECO_SLOT_COMBINATION_LIST[-this.currentCombination[5]].label + " slots";
    }
    this.combinations.push(resolvedCombination.slice());
    console.log(this.combinations);
    this.foundSet += actualCombinationCount;
  }

  recursiveSearchArmor(list: Array<Array<number>>, next: number): void {
    for (let i = list.length - 1; i >= 1; i--) {
      for (let armorID of list[i]) {
        this.currentCombination[next - 1] = armorID;
        this.addArmor(this.getArmorFromList(armorID));
        if (this.canFinish()) {
          //this.printCombo();
          this.calculateFoundSet();
          this.removeArmor(this.getArmorFromList(armorID));
          continue;
        }
        if (this.foundSet < this.TARGET_SET) {
          this.recursiveSearch(next);
        } else {
          break;
        }
        this.removeArmor(this.getArmorFromList(armorID));
      }
    }
    if (this.foundSet < this.TARGET_SET) {
      for (let key of this.sortedArmors[next - 1].keys()) {
        this.currentCombination[next - 1] = -key;
        this.addDecoSlots(key, true);
        if (this.canFinish()) {
          //this.printCombo();
          this.calculateFoundSet();
          this.addDecoSlots(key, false);
          continue;
        }
        if (this.foundSet < this.TARGET_SET) {
          this.recursiveSearch(next);
        } else {
          break;
        }
        this.addDecoSlots(key, false);
      }
    }
  }

  printCombo(): void {
    let x = "";
    this.decos = [0, 0, 0];
    for (let i = 0; i < this.currentCombination.length - 1; i++) {
      if (this.currentCombination[i] > 0) {
        x += this.getArmorFromList(this.currentCombination[i]).name + ",\t";
        console.log(this.getArmorFromList(this.currentCombination[i]).name + "\t" + this.getArmorFromList(this.currentCombination[i]).grade);
        this.addDecoSlots(this.getArmorFromList(this.currentCombination[i]).decoSlots, true)
      } else if (this.currentCombination[i] != this.UNDEFINED_ARMOR) {
        x += DECO_SLOT_COMBINATION_LIST[-this.currentCombination[i]].slots + ",\t";
        this.addDecoSlots(-this.currentCombination[i], true)
      } else {
        x += "any,\t";
      }
    }
    if (this.currentCombination[5] > 0) {
      x += this.talismanList.get(this.currentCombination[5])!.label;
    } else if (this.currentCombination[5] == this.UNDEFINED_ARMOR) {
      x += "any";
    } else {
      x += DECO_SLOT_COMBINATION_LIST[-this.currentCombination[5]].label;
    }
    x += "\n" + this.decos + "\t[" + this.unmetLevel3 + "\, " + this.unmetLevel2 + ", " + this.unmetLevel1 + "]";
    console.log(x);
  }

  addDecoSlots(combination: number, isAdding: boolean): void {
    if (DECO_SLOT_COMBINATION_LIST[combination].slot1 > 0) {
      this.decos[Math.abs(DECO_SLOT_COMBINATION_LIST[combination].slot1 - 3)] += isAdding ? 1 : -1;
    }
    if (DECO_SLOT_COMBINATION_LIST[combination].slot2 > 0) {
      this.decos[Math.abs(DECO_SLOT_COMBINATION_LIST[combination].slot2 - 3)] += isAdding ? 1 : -1;
    }
    if (DECO_SLOT_COMBINATION_LIST[combination].slot3 > 0) {
      this.decos[Math.abs(DECO_SLOT_COMBINATION_LIST[combination].slot3 - 3)] += isAdding ? 1 : -1;
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
    switch (SKILL_LIST[skillID - 1].decoLevel) {
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

  removeArmor(armor: Armor): void {
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

  addArmor(armor: Armor): void {
    this.addDecoSlots(armor.decoSlots, true);
    for (let i = 0; i < armor.skills.length; i++) {
      if (this.relevantSkills.has(-armor.skills[i])) {
        this.addToUnmetLevels(armor.skills[i], -Math.min(Math.max(0, this.relevantSkills.get(-armor.skills[i])!), armor.skillLevels[i]));
        this.relevantSkills.set(-armor.skills[i], this.relevantSkills.get(-armor.skills[i])! - armor.skillLevels[i]);
      }
    }
  }

  getArmorFromList(id: number): Armor {
    if (id < 144) {
      return ARMOR_LIST[0][id - 1];
    } else if (id < 278) {
      return ARMOR_LIST[1][id - 144];
    } else if (id < 406) {
      return ARMOR_LIST[2][id - 278];
    } else if (id < 537) {
      return ARMOR_LIST[3][id - 406];
    } else {
      return ARMOR_LIST[4][id - 537];
    }
  }
}
