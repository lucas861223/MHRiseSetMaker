import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SKILL_LIST } from '../SkillList'
import { Skill } from '../Skill';
import { DECO_SLOT_COMBINATION_LIST } from '../DecoSlotCombinationList';
import { SkillSetSharingService } from '../SkillSetSharingService';
import { Talisman } from '../Talisman';
import { ARMOR_LIST } from '../ArmorList';
import { zip } from 'rxjs';


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
  talismanList = new Map<number, Talisman>();
  relevantTalisman = new Map<number, Talisman>();
  otherTalisman = new Map<number, Talisman>();


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

  removeFromRelevant(key: number) {
    this.talismanList.delete(key);
    this.relevantTalisman.delete(key);
  }

  removeFromOther(key: number) {
    this.talismanList.delete(key);
    this.otherTalisman.delete(key);
  }

  getSpecifyLevel(talisman: Talisman) {
    let similarity = 0;
    if (talisman.skill1ID == this.relevantSkill?.id) {
      similarity += 1;
      if (talisman.skill1Level == this.relevantSkillLevel) {
        similarity += 1;
      }
    } else if (talisman.skill2ID == this.relevantSkill?.id) {
      similarity += 1;
      if (talisman.skill2Level == this.relevantSkillLevel) {
        similarity += 1;
      }
    }
    if (talisman.skill1ID == this.otherSkill?.id) {
      similarity += 1;
      if (talisman.skill1Level == this.otherSkillLevel) {
        similarity += 1;
      }
    } else if (talisman.skill2ID == this.otherSkill?.id) {
      similarity += 1;
      if (talisman.skill2Level == this.otherSkillLevel) {
        similarity += 1;
      }
    }
    if (talisman.DecoSlotID == this.newSlots) {
      similarity += 1;
    }

    if (similarity == 0) {
      return "darkgray";
    } else if (similarity == 1) {
      return "rgb(115, 185, 238)";
    } else if (similarity == 2) {
      return "rgb(84, 148, 218)";
    } else if (similarity == 3) {
      return "rgb(51, 115, 196)";
    } else if (similarity == 4) {
      return "rgb(23, 80, 172)";
    } else {
      return "rgb(0, 3, 152)";
    }
  }

  exportTalismanAsText() {
    this.talismanText = "";
    this.talismanList.forEach((talisman) => {
      let text = ",[" + talisman.DecoSlotID;
      if (talisman.skill1ID > 0) {
        text += "," + talisman.skill1ID + "," + talisman.skill1Level;
      }
      if (talisman.skill2ID > 0) {
        text += "," + talisman.skill2ID + "," + talisman.skill2Level;
      }
      this.talismanText += text + "]";
    });
    this.talismanText = this.talismanText.substring(1);
  }

  ngOnInit(): void {
  }

  reOrganizeTalismanList() {
    this.relevantTalisman.clear();
    this.otherTalisman.clear();
    this.talismanList.forEach((talisman) => {
      if (this.relevantSkills.has(talisman.skill1ID) || this.relevantSkills.has(talisman.skill2ID)) {
        this.relevantTalisman.set(talisman.identifier, talisman);
      } else {
        this.otherTalisman.set(talisman.identifier, talisman);
      }
    });
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

  replaceAll(target: string, search: string, replace: string) {
    return target.split(search).join(replace);
  }

  newTalistmanList() {
    this.talismanList.clear();
    if (this.talismanText !== '') {
      let talismanTextTemp = "";
      JSON.parse('[' + this.replaceAll(this.replaceAll(this.talismanText, " ", ""), "][", "],[") + ']').forEach((talisman: number[]) => {
        let talismanTmp = new Talisman(talisman[0]);
        let text = "[" + talismanTmp.DecoSlotID;
        if (talisman.length > 2) {
          talismanTmp.setSkill1(talisman[1], talisman[2]);
          text += "," + talisman[1] + "," + talisman[2];
        }
        if (talisman.length > 4) {
          talismanTmp.setSkill2(talisman[3], talisman[4]);
          text += "," + talisman[3] + "," + talisman[4];
        }
        text += "]";
        if (!this.talismanList.has(talismanTmp.identifier)) {
          this.talismanList.set(talismanTmp.identifier, talismanTmp)
          talismanTextTemp += "," + text;
        }
      });
      this.talismanText = talismanTextTemp.substring(1);
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
    if (this.relevantSkill != undefined) {
      talisman.setSkill1(this.relevantSkill.id, this.relevantSkillLevel);
      isRelevant = this.relevantSkills.has(this.relevantSkill.id);
    }
    if (this.otherSkill != undefined) {
      talisman.setSkill2(this.otherSkill.id, this.otherSkillLevel);
      if (!isRelevant) {
        isRelevant = this.relevantSkills.has(this.otherSkill.id);
      }
    }
    if (!this.talismanList.has(talisman.identifier)) {
      this.talismanList.set(talisman.identifier, talisman);
      if (isRelevant) {
        this.relevantTalisman.set(talisman.identifier, talisman);
      } else {
        this.otherTalisman.set(talisman.identifier, talisman);
      }
    }
  }
}
