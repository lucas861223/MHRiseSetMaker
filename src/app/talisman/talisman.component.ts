import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SKILL_LIST } from '../SkillList'
import { Skill } from '../Skill';
import { DECO_SLOT_COMBINATION } from '../DecoSlotCombination';
import { SkillSetSharingService } from '../SkillSetSharingService';
import { asLiteral } from '@angular/compiler/src/render3/view/util';


@Component({
  selector: 'app-talisman',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './talisman.component.html',
  styleUrls: ['./talisman.component.scss']
})
export class TalismanComponent implements OnInit {

  skillList = SKILL_LIST;
  decoSlotCombination = DECO_SLOT_COMBINATION;
  talismanText = "";
  newSlots = "0-0-0";
  relevantSkillLevel = 0;
  relevantSkill?: Skill;
  otherSkill?: Skill;
  otherSkillLevel = 0;
  relevantSkillMaxLevelRange: number[] = [];
  otherSkillMaxLevelRange: number[] = [];
  releventSkills = new Map<number, Skill>();

  constructor(sharingService: SkillSetSharingService) {
    sharingService.getObservable().subscribe(value => {
      if (value[1] > 0) {
        this.releventSkills.set(value[0], SKILL_LIST[value[0] - 1])
      } else if (this.releventSkills.has(value[0])) {
        this.releventSkills.delete(value[0])
        if (value[0] == this.relevantSkill?.id) {
          this.resetSelection()
        }
      }
    }
    )
  }

  ngOnInit(): void {
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
    var numbers = this.talismanText.split(",");
  }

}
