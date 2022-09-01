export interface ISkill {
    id: number;
    name: string;
    maxLevel: number;
    decoLevel: number;
    description?: string;
    levelDescriptions?: string[];
    desiredLevel: number;
}
