export class DecoSlotCombination {
    id: number;
    slot1: number = 0;
    slot2: number = 0;
    slot3: number = 0;
    label: string;
    slots: number[] = [0, 0, 0];

    constructor(id: number, slot1?: number, slot2?: number, slot3?: number) {
        if (typeof slot1 !== 'undefined') {
            this.slot1 = slot1;
            this.slots[slot1 - 1] += 1;
        }
        if (typeof slot2 !== 'undefined') {
            this.slot2 = slot2;
            this.slots[slot2 - 1] += 1;
        }
        if (typeof slot3 !== 'undefined') {
            this.slot3 = slot3;
            this.slots[slot3 - 1] += 1;
        }
        this.id = id;
        this.label = this.slot1 + "-" + this.slot2 + "-" + this.slot3;
    }
}