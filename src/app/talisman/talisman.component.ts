import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SKILL_LIST } from '../SkillList'
import { Skill } from '../Skill';
import { DECO_SLOT_COMBINATION } from '../DecoSlotCombination';
import { Subject } from 'rxjs';
import { SkillSetSharingService } from '../SkillSetSharingService';


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
  newSkill1?: Skill;
  newSkill2?: Skill;
  newSlots = "0-0-0";
  releventSkills = new Map<number, Skill>();

  constructor(private sharingService: SkillSetSharingService) {
    sharingService.getObservable().subscribe(value => {
      if (value[1] > 0) {
        this.releventSkills.set(value[0], SKILL_LIST[value[0] - 1])
      } else if (this.releventSkills.has(value[0])) {
        this.releventSkills.delete(value[0])
      }
    }
    )
  }

  ngOnInit(): void {
  }

  newTalistmanList() {
    var numbers = this.talismanText.split(",");
  }

}
