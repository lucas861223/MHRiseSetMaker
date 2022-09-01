import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import skillService from '@services/skill-service';


// **** Variables **** //

// Misc
const router = Router();
const { OK } = StatusCodes;

// Paths
export const p = {
  get: '/all',
} as const;


// **** Functions **** //w

/**
 * Get all users
 */
router.get(p.get, async (_: Request, res: Response) => {
    const skills = await skillService.getAll();
    return res.status(OK).json({skills});
});


// **** Export default **** //

export default router;
