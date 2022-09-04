import { Component, OnInit } from '@angular/core';
import { SkillSetSharingService } from '../services/SkillSetSharingService';
import { TalismanSharingService } from '../services/TalismanSharingService';
import { Talisman } from '../models/Talisman';
import { ArmorSet } from '../models/ArmorSet';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SKILL_LIST } from '../common/DataList';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  combinations?: ArmorSet[];
  headers: string[];
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

    // console.log("head\t" + this.head.join("\t") + "\nchest\t" + this.chest.join("\t") + "\narms\t" + this.arms.join("\t") + "\nwaist\t" + this.waist.join("\t") + "\nlegs\t" + this.legs.join("\t") + "\ntalisman\t" + this.talisman.join("\t"));
    // console.log(this.relevantSkills);

    // // for (let key of this.relevantSkills.keys()) {
    // //   if (key > 0) {
    // //     this.addToUnmetLevels(key, this.relevantSkills.get(key)!);
    // //     this.relevantSkills.set(-key, this.relevantSkills.get(key)!);
    // //   }
    // // }
    // console.log("done");
    // if (this.foundSet == 0) {
    //   this.combinations.push(["No Matching Set"])
    // }
    let queryParams = new HttpParams();
    let querystring = "";
    for (let key of this.relevantSkills.keys()) {
      querystring += key + "," + this.relevantSkills.get(key) + ",";
    }
    queryParams = queryParams.set("skills",  querystring.substring(0, querystring.length - 1));
    console.log(querystring);
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
    console.log(queryParams.keys());
    console.log(queryParams.getAll('skills'));
    this.http.get('/api/sets/find-set', { params: queryParams }).subscribe((data: any) => {
      console.log(data);
    });
  }
}
