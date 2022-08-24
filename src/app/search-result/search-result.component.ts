import { Component, OnInit } from '@angular/core';
import { ARMOR_LIST } from '../ArmorList';
import { Armor } from '../Armor';
import { SKILL_LIST } from '../SkillList';
import { Skill } from '../Skill';
import { Console } from 'console';
import { JsonpClientBackend } from '@angular/common/http';
import { SkillSetSharingService } from '../SkillSetSharingService';
import { emitWarning } from 'process';
import { min } from 'rxjs';
import { TalismanSharingService } from '../TalismanSharingService';
import { Talisman } from '../Talisman';
import { GridAlignRowsStyleBuilder } from '@angular/flex-layout';
import { DecoSlotCombination } from '../DecoSlotCombination';
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
  decos: Array<number> = [0, 0, 0];
  combinations: Array<Array<number>> = [];
  currentCombination: Array<number> = [-1, -1, -1, -1, -1, -1];
  ngOnInit(): void {

  }

  gradeArmors(result: Array<Array<number>>, index: number) {
    this.sortedArmors.push(new Map<number, Array<number>>());
    ARMOR_LIST[index].forEach(armor => {
      var grade = 0;
      for (let i = 0; i < armor.skills.length; i++) {
        if (this.relevantSkills.has(armor.skills[i])) {
          if (SKILL_LIST[armor.skills[i] - 1].decoLevel >= 2) {
            grade += Math.min(this.relevantSkills.get(armor.skills[i])!, armor.skillLevels[i]);
          }
        }
      }
      //console.log(armor.name + "done, grade " + grade);
      if (grade > 0) {
        if (result.length < grade + 1) {
          console.log("not enough grades");
          for (let i = result.length; i <= grade; i++) {
            result.push([] as Array<number>);
            console.log(grade + "\t" + result.length);
          }
        }
        result[grade].push(armor.id);
      } else {
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
    this.gradeArmors(this.head, 0);
    this.gradeArmors(this.chest, 1);
    this.gradeArmors(this.arms, 2);
    this.gradeArmors(this.waist, 3);
    this.gradeArmors(this.legs, 4);
    this.decos = [0, 0, 0];
    this.currentCombination = [-1, -1, -1, -1, -1, -1];
    for (let key of this.relevantSkills.keys()) {
      if (key > 0) {
        this.addToUnmetLevels(key, this.relevantSkills.get(key)!);
        this.relevantSkills.set(-key, this.relevantSkills.get(key)!);
      }
    }
    this.talismanList.forEach(talisman => {
      var grade = 0;
      if (this.relevantSkills.has(talisman.skill1ID) && SKILL_LIST[talisman.skill1ID - 1].decoLevel >= 2) {
        grade += Math.min(this.relevantSkills.get(talisman.skill1ID)!, talisman.skill1Level);
      }
      if (this.relevantSkills.has(talisman.skill2ID) && SKILL_LIST[talisman.skill2ID - 1].decoLevel >= 2) {
        grade += Math.min(this.relevantSkills.get(talisman.skill2ID)!, talisman.skill2Level);
      }
      if (grade > 0) {
        //console.log(talisman.identifier + " done, grade " + grade);
        if (this.talisman.length < grade + 1) {
          //console.log("not enough grades");
          for (let i = this.talisman.length; i <= grade; i++) {
            //console.log(grade + "\t" + this.talisman.length);
            this.talisman.push([] as Array<number>);
          }
        }
      } else {
        if (!this.sortedArmors[5].has(talisman.DecoSlotID)) {
          this.sortedArmors[5].set(talisman.DecoSlotID, []);
        }
        this.sortedArmors[5].get(talisman.DecoSlotID)!.push(talisman.identifier);
      }

    });
    console.log("head\t" + this.head.splice(1).join("\t") + "\nchest\t" + this.chest.splice(1).join("\t") + "\narms\t" + this.arms.splice(1).join("\t") + "\nwaist\t" + this.waist.splice(1).join("\t") + "\nlegs\t" + this.legs.splice(1).join("\t") + "\ntalisman\t" + this.talisman.splice(1).join("\t"));

    console.log(this.relevantSkills);
    this.recursiveSearch(0);
  }

  recursiveSearch(depth: number): void {
    switch (depth) {
      case 0:
        console.log("searhching\t" + this.head.length + "\t" + this.head[1]);
        this.recursiveSearchArmor(this.head, 1);
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
        for (let i = this.talisman.length - 1; i >= 1; i--) {
          for (let talismanID of this.talisman[i]) {
            let talisman = this.talismanList.get(talismanID)!;
            console.log("tring to find: \t" + this.getArmorFromList(talismanID).name);
            this.currentCombination[5] = talismanID;
            this.decos[0] += talisman.grade[0];
            this.decos[1] += talisman.grade[1];
            this.decos[2] += talisman.grade[2];
            if (this.relevantSkills.has(-talisman.skill1ID)) {
              this.addToUnmetLevels(talisman.skill1ID, - Math.min(Math.max(0, this.relevantSkills.get(-talisman.skill1ID)!), talisman.skill1Level));
            }
            if (this.relevantSkills.has(-talisman.skill2ID)) {
              this.addToUnmetLevels(talisman.skill2ID, - Math.min(Math.max(0, this.relevantSkills.get(-talisman.skill2ID)!), talisman.skill2Level));
            }

            if (this.canFinish()) {
              this.combinations.push(this.currentCombination.slice());
              alert(this.currentCombination);
            }
            //console.log(this.relevantSkills, this.currentCombination, this.unmetCondition, this.unmetLevels)
            if (this.combinations.length >= 10) {
              break;
            }
            this.decos[0] -= talisman.grade[0];
            this.decos[1] -= talisman.grade[1];
            this.decos[2] -= talisman.grade[2];
            if (this.relevantSkills.get(-talisman.skill1ID)! > 0) {
              this.addToUnmetLevels(talisman.skill1ID, talisman.skill1Level);
            } else if (Math.abs(this.relevantSkills.get(-talisman.skill1ID)!) < talisman.skill1ID) {
              this.addToUnmetLevels(talisman.skill1ID, talisman.skill1Level + this.relevantSkills.get(-talisman.skill1ID)!);
            }
            if (this.relevantSkills.get(-talisman.skill2ID)! > 0) {
              this.addToUnmetLevels(talisman.skill2ID, talisman.skill2Level);
            } else if (Math.abs(this.relevantSkills.get(-talisman.skill2ID)!) < talisman.skill2ID) {
              this.addToUnmetLevels(talisman.skill2ID, talisman.skill2Level + this.relevantSkills.get(-talisman.skill2ID)!);
            }
          }
        }
        console.log("time to go into other armor")
        if (this.combinations.length < 10) {
          for (let i = DECO_SLOT_COMBINATION_LIST.length; i > 0 && this.combinations.length < 10; i--) {
            if (this.sortedArmors[5].has(i)) {
              this.currentCombination[5] = -i;
              this.unmetLevel1 -= DECO_SLOT_COMBINATION_LIST[i - 1].slot1;
              this.unmetLevel2 -= DECO_SLOT_COMBINATION_LIST[i - 1].slot2;
              this.unmetLevel3 -= DECO_SLOT_COMBINATION_LIST[i - 1].slot3;
              console.log("can I finish")
              if (this.canFinish()) {
                this.combinations.push(this.currentCombination.slice());
                alert(this.currentCombination);
              }
              console.log("recur next part")
              this.unmetLevel1 += DECO_SLOT_COMBINATION_LIST[i - 1].slot1;
              this.unmetLevel2 += DECO_SLOT_COMBINATION_LIST[i - 1].slot2;
              this.unmetLevel3 += DECO_SLOT_COMBINATION_LIST[i - 1].slot3;
            }
          }
          console.log("done one")
        }
        break;
    }
  }

  recursiveSearchArmor(list: Array<Array<number>>, next: number): void {
    console.log("searhching\t" + list.length + "\t" + list[1]);
    for (let i = list.length - 1; i >= 1; i--) {
      for (let j = next; j < this.currentCombination.length; j++) {
        this.currentCombination[j] = -1;
      }
      list[i].forEach(armorID => {
        console.log("tring to find: \t" + this.getArmorFromList(armorID).name);
        this.currentCombination[next - 1] = armorID;
        this.removeskills(this.getArmorFromList(armorID));
        if (this.canFinish()) {
          this.combinations.push(this.currentCombination.slice());
          alert(this.currentCombination);
        }
        console.log(this.getArmorFromList(armorID))
        //console.log(this.relevantSkills, this.currentCombination, this.unmetCondition, this.unmetLevels)
        if (this.combinations.length < 10) {
          this.recursiveSearch(next);
        }
        this.addSkills(this.getArmorFromList(armorID));
      });
    }
    console.log("time to go into other armor")
    if (this.combinations.length < 10) {
      for (let i = DECO_SLOT_COMBINATION_LIST.length; i > 0 && this.combinations.length < 10; i--) {
        if (this.sortedArmors[next - 1].has(i)) {
          this.currentCombination[next - 1] = -i;
          for (let j = next; j < this.currentCombination.length; j++) {
            this.currentCombination[j] = -1;
          }
          this.unmetLevel1 -= DECO_SLOT_COMBINATION_LIST[i - 1].slot1;
          this.unmetLevel2 -= DECO_SLOT_COMBINATION_LIST[i - 1].slot2;
          this.unmetLevel3 -= DECO_SLOT_COMBINATION_LIST[i - 1].slot3;
          console.log("can I finish")
          if (this.canFinish()) {
            this.combinations.push(this.currentCombination.slice());
            alert(this.currentCombination);
          }
          console.log("recur next part")
          if (this.combinations.length < 10) {
            this.recursiveSearch(next);
          }
          this.unmetLevel1 += DECO_SLOT_COMBINATION_LIST[i - 1].slot1;
          this.unmetLevel2 += DECO_SLOT_COMBINATION_LIST[i - 1].slot2;
          this.unmetLevel3 += DECO_SLOT_COMBINATION_LIST[i - 1].slot3;
        }
      }
      console.log("done one")
    }
    console.log("done")
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

  addSkills(armor: Armor): void {
    this.decos[0] += armor.grade[0];
    this.decos[1] += armor.grade[1];
    this.decos[2] += armor.grade[2];

    for (let i = 0; i < armor.skills.length; i++) {
      if (this.relevantSkills.has(-armor.skills[i])) {
        if (this.relevantSkills.get(-armor.skills[i])! > 0) {
          this.addToUnmetLevels(armor.skills[i], armor.skillLevels[i]);
        } else if (Math.abs(this.relevantSkills.get(-armor.skills[i])!) < armor.skillLevels[i]) {
          this.addToUnmetLevels(armor.skills[i], armor.skillLevels[i] + this.relevantSkills.get(-armor.skills[i])!);
        }
        this.relevantSkills.set(-armor.skills[i], this.relevantSkills.get(-armor.skills[i])! + armor.skillLevels[i]);
      }
    }
  }

  removeskills(armor: Armor): void {
    this.decos[0] -= armor.grade[0];
    this.decos[1] -= armor.grade[1];
    this.decos[2] -= armor.grade[2];
    for (let i = 0; i < armor.skills.length; i++) {
      if (this.relevantSkills.has(-armor.skills[i])) {
        this.addToUnmetLevels(armor.skills[i], - Math.min(Math.max(0, this.relevantSkills.get(-armor.skills[i])!), armor.skillLevels[i]));
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
