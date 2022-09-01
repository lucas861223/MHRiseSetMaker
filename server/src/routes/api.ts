import { Router } from 'express';
import skillRouter from './skills-router';
import decoslotRouter from './decoslot-router';


// Export the base-router
const baseRouter = Router();

// Setup routers
//baseRouter.use('/users', userRouter);
baseRouter.use('/skills', skillRouter);
baseRouter.use('/slots', decoslotRouter);

// *** Export default **** //

export default baseRouter;
