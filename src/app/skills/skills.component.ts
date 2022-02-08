import { Component, OnInit } from '@angular/core';
import { SKILL_LIST } from '../SkillList'
import { SkillSetSharingService } from '../SkillSetSharingService';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})


export class SkillsComponent implements OnInit {

  skillList = SKILL_LIST;
  regularDistribution = 100 / 5;
  selectedSkills = new Map<number, number>();
  subject: Subject<number[]>;

  constructor(sharingService: SkillSetSharingService) { 
    this.subject = sharingService.getObservable()
  }

  ngOnInit(): void {
  }

  onValueChanged(value: number[]) {
    if (value[1] > 0) {
      this.selectedSkills.set(value[0], value[1])
    } else if (this.selectedSkills.has(value[0])) {
      this.selectedSkills.delete(value[0])
    }
    this.subject.next(value);
  }

  range = function (
    count: number,
    start_with: number = 0
  ): number[] {
    return [...Array(count).keys()].map((key) => key + start_with)
  };
}



