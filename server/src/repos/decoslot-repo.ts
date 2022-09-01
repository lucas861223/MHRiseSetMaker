import { IDecoSlot } from "../models/iDecoSlots"
import orm from './mock-orm';

export default {
    get,
    getAll,
} as const;


async function get(id: number): Promise<IDecoSlot | null> {
    const db = await orm.openDb();
    for (const decoslot of db.decoslots) {
        if (decoslot.id === id) {
            return decoslot;
        }
    }
    return null;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IDecoSlot[]> {
    const db = await orm.openDb();
    return db.decoslots;
}

