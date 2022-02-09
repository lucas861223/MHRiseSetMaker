export class DecoSlotCombination {
    id: number;
    slot1: number = 0;
    slot2: number = 0;
    slot3: number = 0;
    label: string;

    constructor(id: number, slot1?: number, slot2?: number, slot3?: number) {
        if (typeof slot1 !== 'undefined') {
            this.slot1 = slot1;
        }
        if (typeof slot2 !== 'undefined') {
            this.slot2 = slot2;
        }
        if (typeof slot3 !== 'undefined') {
            this.slot3 = slot3;
        }
        this.id = id;
        this.label = this.slot1 + "-" + this.slot2 + "-" + this.slot3;
    }
}