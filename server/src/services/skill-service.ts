import skillrepo from '@repos/skill-repo';
import { ISkill } from '@models/iSkills';

// **** Functions **** //

/**
 * Get all users
 */
function getAll(): Promise<ISkill[]> {
    return skillrepo.getAll();
}

function get(id: number): Promise<ISkill | null> {
    return skillrepo.get(id);
}

export default {
    getAll,
    get
} as const;
