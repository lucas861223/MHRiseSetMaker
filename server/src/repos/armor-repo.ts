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
    return db.armor;
}

