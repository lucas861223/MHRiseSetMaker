import { Component, OnInit } from '@angular/core';
import { SkillSetSharingService } from '../services/SkillSetSharingService';
import { TalismanSharingService } from '../services/TalismanSharingService';
import { Talisman } from '../models/Talisman';
import { ArmorSet } from '../models/ArmorSet';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DECO_SLOT_COMBINATION_LIST, SKILL_LIST } from '../common/DataList';
import { Armor } from '../models/Armor';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  combinations?: ArmorSet[];
  combinationsString: string[][] = [];
  headers: string[];
  pressed: boolean = false;
  searching: boolean = false;
  constructor(sharingService: SkillSetSharingService,
    talismanService: TalismanSharingService,
    private http: HttpClient) {
    sharingService.getObservable().subscribe(value => {
      if (value[1] > 0) {
        this.relevantSkills.set(value[0], value[1]);
      } else if (this.relevantSkills.has(value[0])) {
        this.relevantSkills.delete(value[0]);
      }
    })
    talismanService.getObservable().subscribe(value => {
      if (value[0] < 0) {
        this.talismanList.delete(Math.abs(value[0]));
      } else {
        this.talismanList.set(value[0], value[1]!);
      }
    })
    this.headers = ["head", "chest", "arms", "waist", "legs", "talisman"];
  }

  talismanList = new Map<number, Talisman>();
  relevantSkills = new Map<number, number>();
  ngOnInit(): void {

  }

  search(): void {
    this.searching = true;
    this.pressed = true;
    let queryParams = new HttpParams();
    let querystring = "";
    for (let key of this.relevantSkills.keys()) {
      querystring += key + "," + this.relevantSkills.get(key) + ",";
    }
    queryParams = queryParams.set("skills",  querystring.substring(0, querystring.length - 1));
    querystring = "";
    for (let key of this.talismanList.keys()) {
      if (this.talismanList.get(key)!.skill1ID > 0) {
        querystring += this.talismanList.get(key)!.skill1ID + "-" + this.talismanList.get(key)!.skill1Level;
      }
      if (this.talismanList.get(key)!.skill2ID > 0) {
        querystring += this.talismanList.get(key)!.skill2ID + "-" + this.talismanList.get(key)!.skill2Level;
      }
      querystring += this.talismanList.get(key)!.DecoSlotID + ",";
    }

    queryParams = queryParams.set("talismans", querystring.substring(0, querystring.length - 1));
    queryParams = queryParams.set("target", "10");
    this.combinationsString = [];
    this.http.get('/api/sets/find-set', { params: queryParams }).subscribe((sets: any) => {
      for (let set of sets) {
        let names: string[] = [];
        names.push(this.resolveName(set.head));
        names.push(this.resolveName(set.chest));
        names.push(this.resolveName(set.arms));
        names.push(this.resolveName(set.waist));
        names.push(this.resolveName(set.leg));
        if (set.talisman == undefined) {
          names.push("any");
        } else if (set.talisman.identifier > 0) {
          names.push(this.talismanList.get(set.talisman.identifier)!.label);
        } else {
          names.push("Any armor with " + DECO_SLOT_COMBINATION_LIST[set.talisman.decoSlots].label + " slots");
        }
        this.combinationsString!.push(names);
      }
      if (this.combinationsString.length == 0) {
        this.combinationsString.push(["No Matching Set."]);
      }
      this.searching = false;
    });
  }

  resolveName(armor?: Armor): string {
    if (armor == undefined) {
      return "Any";
    } else if (armor.id > 0) {
      return armor.name;
    } else {
      return "Any armor with " + DECO_SLOT_COMBINATION_LIST[armor.decoSlots].label + " slots";
    }
  }
}
