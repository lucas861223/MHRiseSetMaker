import { Component, OnInit } from '@angular/core';
import { SKILLLIST } from '../skills/SkillList'

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})


export class SkillsComponent implements OnInit {

  skillList = SKILLLIST;
  regularDistribution = 100 / 5;

  constructor() { }

  ngOnInit(): void {
  }

  range = function (
    count: number,
    start_with: number = 0
  ): number[] {
    return [...Array(count).keys()].map((key) => key + start_with)
  };
}



