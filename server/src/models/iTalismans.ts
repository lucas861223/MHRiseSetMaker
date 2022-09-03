export interface ITalisman {
    skill1ID: number;
    skill1Level: number;
    skill2ID: number;
    skill2Level: number;
    DecoSlotID: number;
    identifier: number;
}


export class Talisman implements ITalisman {

    static formTalisman(id: number, label: string): Talisman {
        label.split('-');
        let talisman = new Talisman(parseInt(label[0]));
        talisman.identifier = id;
        if (label.length > 1) {
            talisman.skill1ID = parseInt(label[1]);
            talisman.skill1Level = parseInt(label[2]);
        }
        if (label.length > 3) {
            talisman.skill2ID = parseInt(label[3]);
            talisman.skill2Level = parseInt(label[4]);
        }
        return talisman;
    }

    skill1ID: number = -1;
    skill1Level: number = -1;
    skill2ID: number = -1;
    skill2Level: number = -1;
    DecoSlotID: number = -1;
    identifier: number = -1;
    constructor(DecoSlotID: number, skill1ID?: number, skill1Level?: number, skill2ID?: number, skill2Level?: number, identifier?: number) {
        this.DecoSlotID = DecoSlotID;
        if (skill1ID != undefined) {
            this.skill1ID = skill1ID;
        }
        if (skill1Level != undefined) {
            this.skill1Level = skill1Level;
        }
        if (skill2ID != undefined) {
            this.skill2ID = skill2ID;
        }
        if (skill2Level != undefined) {
            this.skill2Level = skill2Level;
        }
        if (identifier != undefined) {
            this.identifier = identifier;
        }
    }
}
