import decoslotrepo from '@repos/decoslot-repo';
import { IDecoSlot } from '@models/iDecoSlots';

// **** Functions **** //

/**
 * Get all users
 */
function getAll(): Promise<IDecoSlot[]> {
    return decoslotrepo.getAll();
}

function get(id: number): Promise<IDecoSlot | null> {
    return decoslotrepo.get(id);
}

export default {
    getAll,
    get
} as const;
