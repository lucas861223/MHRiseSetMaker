import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import decoslotService from '@services/decoslot-service';


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
    const decoslots = await decoslotService.getAll();
    return res.status(OK).json({decoslots});
});


// **** Export default **** //

export default router;
