import { ISkill } from "../models/iSkills"
import orm from './mock-orm';

export default {
    get,
    getAll,
} as const;


async function get(id: number): Promise<ISkill | null> {
    const db = await orm.openDb();
    for (const skill of db.skills) {
        if (skill.id === id) {
            return skill;
        }
    }
    return null;
}

/**
 * Get all users.
 */
async function getAll(): Promise<ISkill[]> {
    const db = await orm.openDb();
    return db.skills;
}

