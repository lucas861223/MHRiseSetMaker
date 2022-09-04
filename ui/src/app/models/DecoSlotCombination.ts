export class DecoSlotCombination {
    id: number = 0;
    slot1: number = 0;
    slot2: number = 0;
    slot3: number = 0;
    label: string;

    constructor(init: Partial<DecoSlotCombination>) {
        Object.assign(this, init);
        this.label = this.slot1 + "-" + this.slot2 + "-" +  this.slot3;
    }
}