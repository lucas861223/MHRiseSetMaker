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

}
