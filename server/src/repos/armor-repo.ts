import { IArmor } from "../models/iArmors"
import orm from './mock-orm';

export default {
    get,
    getAll,
} as const;


async function get(id: number): Promise<IArmor | null> {
    const db = await orm.openDb();
    for (const armor of db.armors) {
        if (armor.id === id) {
            return armor;
        }
    }
    return null;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IArmor[][]> {
    const db = await orm.openDb();
    let armors: IArmor[][] = []; 
    armors.push(db.armors.head);
    armors.push(db.armors.chest);
    armors.push(db.armors.arms);
    armors.push(db.armors.waist);
    armors.push(db.armors.legs);
    return armors;
}

