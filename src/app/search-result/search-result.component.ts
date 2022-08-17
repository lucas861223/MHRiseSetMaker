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

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  constructor(sharingService: SkillSetSharingService) {
    sharingService.getObservable().subscribe(value => {
      if (value[1] > 0) {
        this.relevantSkills.set(value[0], value[1])
      } else if (this.relevantSkills.has(value[0])) {
        this.relevantSkills.delete(value[0])
      }
    })
  }

  armorlist = ARMOR_LIST;
  grades = [];
  requirements = [];
  talisman = [];
  relevantSkills = new Map<number, number>();

  ngOnInit(): void {
    
  }

  search(): void {
    this.armorlist.forEach(armorpart => {
      armorpart.forEach(armor => {
        console.log(armor.name + "\t" + armor.grade + "pre");
        for (let i = 0; i < armor.skills.length; i++) {
          if (this.relevantSkills.has(armor.skills[i])) {
            console.log(Math.min(this.relevantSkills.get(armor.skills[i]) as number, armor.skillLevels[i]));
            armor.grade[SKILL_LIST[armor.skills[i] - 1].decoLevel] += Math.min(this.relevantSkills.get(armor.skills[i]) as number, armor.skillLevels[i]);
          }
        }
        console.log(armor.name + "\t" + armor.grade + "post");
      });
    });
  }

}
