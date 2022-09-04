import { IArmor } from "./iArmors";
import { ITalisman } from "./iTalismans";

export interface IArmorSet {
    head?: IArmor;
    chest?: IArmor;
    waist?: IArmor;
    arms?: IArmor;
    legs?: IArmor;
    talisman?: ITalisman;
}

export class ArmorSet implements IArmorSet {
    head?: IArmor;
    chest?: IArmor;
    waist?: IArmor;
    arms?: IArmor;
    legs?: IArmor;
    talisman?: ITalisman;

    constructor(head?: IArmor, chest?: IArmor, waist?: IArmor, arms?: IArmor, legs?: IArmor, talisman?: ITalisman) {
        this.head = head;
        this.chest = chest;
        this.waist = waist;
        this.arms = arms;
        this.legs = legs;
        this.talisman = talisman;
    }

    copy(): ArmorSet {
        return new ArmorSet(this.head, this.chest, this.waist, this.arms, this.legs, this.talisman);
    }

    addTalisman(talisman: ITalisman) {
        this.talisman = talisman;
    }

    removeTalisman() {
        this.talisman = undefined;
    }

    addArmor(armor: IArmor, index: number) {
        switch (index) {
            case 1:
                this.head = armor;
                break;
            case 2:
                this.chest = armor;
                break;
            case 3:
                this.arms = armor;
                break;
            case 4:
                this.waist = armor;
                break;
            case 5:
                this.legs = armor;
                break;
        }
    }

    removeArmor(index: number) {
        switch (index) {
            case 1:
                this.head = undefined;
                break;
            case 2:
                this.chest = undefined;
                break;
            case 3:
                this.arms = undefined;
                break;
            case 4:
                this.waist = undefined;
                break;
            case 5:
                this.legs = undefined;
                break;
        }
    }
}