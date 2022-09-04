import { _resolveDirectionality } from "@angular/cdk/bidi/directionality";
import { Armor } from "./Armor";
import { DECO_SLOT_COMBINATION_LIST } from "../common/DataList";
import { Talisman } from "./Talisman";

export interface IArmorSet {
    head?: Armor;
    chest?: Armor;
    waist?: Armor;
    arms?: Armor;
    legs?: Armor;
    talisman?: Talisman;
}

export class ArmorSet implements IArmorSet {
    head?: Armor;
    chest?: Armor;
    waist?: Armor;
    arms?: Armor;
    legs?: Armor;
    talisman?: Talisman;

    constructor(head?: Armor, chest?: Armor, waist?: Armor, arms?: Armor, legs?: Armor, talisman?: Talisman) {
        this.head = head;
        this.chest = chest;
        this.waist = waist;
        this.arms = arms;
        this.legs = legs;
        this.talisman = talisman;
    }

    resolveSet(): string[] {
        let resolvedNames: string[] = [];
        this.resolvePiece(resolvedNames, this.arms);
        this.resolvePiece(resolvedNames, this.chest);
        this.resolvePiece(resolvedNames, this.waist);
        this.resolvePiece(resolvedNames, this.arms);
        this.resolvePiece(resolvedNames, this.legs);
        if (this.talisman == undefined) {
            resolvedNames.push("Any");
        } else if (this.talisman.identifier > 0) {
            resolvedNames.push(this.talisman.label);
        } else {
            resolvedNames.push("Any armor with " + DECO_SLOT_COMBINATION_LIST[this.talisman.DecoSlotID].label + " slots.");
        }
        return resolvedNames;
    }

    resolvePiece(resolvedList: string[], armor?: Armor) {
        if (armor == undefined) {
            resolvedList.push("Any");
        } else if (armor.id > 0) {
            resolvedList.push(armor.name);
        } else {
            resolvedList.push("Any armor with " + DECO_SLOT_COMBINATION_LIST[armor.decoSlots].label + " slots.");
        }
    }
}