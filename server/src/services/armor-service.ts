import armorrepo from '@repos/armor-repo';
import { IArmor } from '@models/iArmors';

// **** Functions **** //

/**
 * Get all users
 */
function getAll(): Promise<IArmor[][]> {
    return armorrepo.getAll();
}

function get(id: number): Promise<IArmor | null> {
    return armorrepo.get(id);
}

export default {
    getAll,
    get
} as const;
