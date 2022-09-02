import { Skill } from '../models/Skill'
import { HttpClient } from '@angular/common/http';
import { DecoSlotCombination } from '../models/DecoSlotCombination';
import { TalismanComponent } from '../talisman/talisman.component';

type skillJson = {
    skills: Skill[];
};

type slotJson = {
    decoslots: DecoSlotCombination[];
};

export class dataService {
    static SKILL_LIST: Skill[] = [];
    static DECO_SLOT_COMBINATION_LIST: DecoSlotCombination[] = [];
    static loadData(http: HttpClient, skillListCallback: Function, decoListCallBack: Function, instance: TalismanComponent) {
        http.get('/api/skills/all').subscribe((data: any) => {
            for (let skill of (data as skillJson).skills) {
                dataService.SKILL_LIST.push(new Skill(skill))
            }
            //can be updated to use event in the future
            skillListCallback(instance);
        });
        http.get('/api/slots/all').subscribe((data: any) => {
            for (let slot of (data as slotJson).decoslots) {
                dataService.DECO_SLOT_COMBINATION_LIST.push(new DecoSlotCombination(slot))
            }
            decoListCallBack(instance);
        });
    }
}

export const SKILL_LIST = dataService.SKILL_LIST;
export const DECO_SLOT_COMBINATION_LIST = dataService.DECO_SLOT_COMBINATION_LIST;