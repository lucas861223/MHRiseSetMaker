import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SKILL_LIST } from '../SkillList'
import { Skill } from '../Skill';
import { DECO_SLOT_COMBINATION_LIST } from '../DecoSlotCombinationList';
import { SkillSetSharingService } from '../SkillSetSharingService';
import { Talisman } from '../Talisman';


@Component({
  selector: 'app-talisman',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './talisman.component.html',
  styleUrls: ['./talisman.component.scss']
})
export class TalismanComponent implements OnInit {

  skillList = SKILL_LIST;
  decoSlotCombination = DECO_SLOT_COMBINATION_LIST;
  talismanText = "";
  newSlots = 1;
  relevantSkillLevel = 0;
  relevantSkill?: Skill;
  otherSkill?: Skill;
  otherSkillLevel = 0;
  relevantSkillMaxLevelRange: number[] = [];
  otherSkillMaxLevelRange: number[] = [];
  relevantSkills = new Map<number, Skill>();
  talismanList: Talisman[] = [];
  relevantTalisman: Talisman[] = [];
  otherTalisman: Talisman[] = [];

  constructor(sharingService: SkillSetSharingService) {
    sharingService.getObservable().subscribe(value => {
      if (value[1] > 0) {
        this.relevantSkills.set(value[0], SKILL_LIST[value[0] - 1])
      } else if (this.relevantSkills.has(value[0])) {
        this.relevantSkills.delete(value[0])
        if (value[0] == this.relevantSkill?.id) {
          this.resetSelection();
        }
      }
      this.reOrganizeTalismanList();
    })
  }

  ngOnInit(): void {
  }

  reOrganizeTalismanList() {
    this.relevantTalisman = [];
    this.otherTalisman = [];
    for (let talisman of this.talismanList) {
      if (this.relevantSkills.has(talisman.skill1ID) || this.relevantSkills.has(talisman.skill2ID)) {
        this.relevantTalisman.push(talisman);
      } else {
        this.otherTalisman.push(talisman);
      }
    }
  }

  resetOtherSelection() {
    this.otherSkillLevel = 0;
    this.otherSkill = undefined;
    this.otherSkillMaxLevelRange = [];
  }

  updateOtherLevelRange() {
    this.otherSkillLevel = 1;
    this.otherSkillMaxLevelRange = [...Array(this.otherSkill?.maxLevel).keys()].map((key) => key + 1)
    if (this.otherSkill?.id == this.relevantSkill?.id) {
      this.resetSelection();
    }
  }

  resetSelection() {
    this.relevantSkillLevel = 0;
    this.relevantSkill = undefined;
    this.relevantSkillMaxLevelRange = [];
  }

  updateLevelRange() {
    this.relevantSkillLevel = 1;
    this.relevantSkillMaxLevelRange = [...Array(this.relevantSkill?.maxLevel).keys()].map((key) => key + 1)
    if (this.otherSkill?.id == this.relevantSkill?.id) {
      this.resetOtherSelection();
    }
  }

  newTalistmanList() {
    this.talismanList = [];
    this.talismanText = this.talismanText.replace(" ", "").replace("][", "],[")
    if (this.talismanText !== '') {
      console.log(JSON.parse('[' + this.talismanText + ']'));
      JSON.parse('[' + this.talismanText + ']').forEach((talisman: number[]) => {
        let talismanTmp = new Talisman(talisman[0]);
        if (talisman.length > 2) {
          talismanTmp.setSkill1(talisman[1], talisman[2]);
        }
        if (talisman.length > 4) {
          talismanTmp.setSkill2(talisman[3], talisman[4]);
        }
        this.talismanList.push(talismanTmp)
      });
    }
    this.reOrganizeTalismanList();
  }

  textareaKeydown(event: any) {
    //allow paste/select all/copy/cut
    if (!event.ctrlKey || (event.code != 'KeyV' && event.code != 'KeyA' && event.code != 'KeyC' && event.code != 'KeyX' && event.code != 'KeyZ')) {
      event.preventDefault();
    }
  }

  addTalisman() {
    let talisman = new Talisman(this.newSlots);
    let isRelevant = false;
    let text = "[" + this.newSlots;
    if (this.relevantSkill != undefined) {
      talisman.setSkill1(this.relevantSkill.id, this.relevantSkillLevel);
      isRelevant = true;
      text += "," + this.relevantSkill.id + "," + this.relevantSkillLevel;
    }
    if (this.otherSkill != undefined) {
      talisman.setSkill2(this.otherSkill.id, this.otherSkillLevel);
      text += "," + this.otherSkill.id + "," + this.otherSkillLevel;
      if (!isRelevant) {
        isRelevant = this.relevantSkills.has(this.otherSkill.id);
      }
    }
    if (this.talismanList.length > 0) {
      this.talismanText += ",";
    }
    this.talismanText += text + "]";
    this.talismanList.push(talisman);
    if (isRelevant) {
      this.relevantTalisman.push(talisman);
    } else {
      this.otherTalisman.push(talisman);
    }
  }
}
