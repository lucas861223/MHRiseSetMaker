import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import setService from '@services/set-service';


// **** Variables **** //

// Misc
const router = Router();
const { OK } = StatusCodes;

// Paths
export const p = {
    get: '/find-set',
} as const;


// **** Functions **** //w

/**
 * Get all users
 */
router.get(p.get, async (req: Request, res: Response) => {
    setService.findSet(req.query.skills as string, req.query.talismans as string, req.query.target as string).then(data => {return res.status(OK).json(data);});
});


// **** Export default **** //

export default router;
