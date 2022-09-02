import { Component, OnInit } from '@angular/core';
import { SKILL_LIST } from '../common/DataList'
import { SkillSetSharingService } from '../services/SkillSetSharingService';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';
import { Output, EventEmitter } from '@angular/core';
import { Skill } from '../models/Skill';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})

export class SkillsComponent implements OnInit {

  skillList: Skill[] = SKILL_LIST;
  regularDistribution = 100 / 5;
  @Output() selectedSkillList = new EventEmitter<string>();
  selectedSkills = new Map<number, number>();
  subject: Subject<number[]>;

  constructor(sharingService: SkillSetSharingService) { 
    this.subject = sharingService.getObservable()
  }

  ngOnInit(): void {
  }

  onValueChanged(skill: Skill) {
    if (skill.desiredLevel > 0) {
      this.selectedSkills.set(skill.id, skill.desiredLevel)
    } else if (this.selectedSkills.has(skill.id)) {
      this.selectedSkills.delete(skill.id)
    }
    this.subject.next([skill.id, skill.desiredLevel, skill.oldLevel]);
    skill.oldLevel = skill.desiredLevel;
  }

  range = function (
    count: number,
    start_with: number = 0
  ): number[] {
    return [...Array(count).keys()].map((key) => key + start_with)
  };
}

