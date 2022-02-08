import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SKILLLIST } from '../skills/SkillList'
import { Skills } from '../skills/skills';


@Component({
  selector: 'app-talisman',
  encapsulation:ViewEncapsulation.None,
  templateUrl: './talisman.component.html',
  styleUrls: ['./talisman.component.scss']
})
export class TalismanComponent implements OnInit {
  
  skillList = SKILLLIST;
  talismanText = "";
  newSkill1?: Skills;
  newSkill2?: Skills
  newSlots?: string;

  constructor() { }

  ngOnInit(): void {
  }

  newTalistmanList() {
    var numbers = this.talismanText.split(",");
  }

}
