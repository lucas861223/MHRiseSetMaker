import { IArmor } from '@models/iArmors';
import armorService from '@services/armor-service'
import { IDecoSlot } from '@models/iDecoSlots';
import decoslotService from '@services/decoslot-service'
import { ISkill } from '@models/iSkills'
import { ISet } from '@models/iSets';
import { ITalisman } from '@models/iTalismans'
//import skillService from '@services/armor-service'

// **** Functions **** //

function findSet(skills: string, talismans: string): ISet[] {
    return [];
}

export default {
    findSet
} as const;
