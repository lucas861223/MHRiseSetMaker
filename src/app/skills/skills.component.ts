import { Component, OnInit } from '@angular/core';
import { SKILLLIST } from '../skills/SkillList'

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})


export class SkillsComponent implements OnInit {

  skillList = SKILLLIST;
  constructor() { }

  ngOnInit(): void {
  }

  range = function (
    count: number,
    start_with: number = 0
  ): string[] {
    var numbers = [...Array(count).keys()].map((key) => key + start_with)
    return numbers.map(function(level) {return level.toString();});
  };
}



