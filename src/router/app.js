import cors from 'cors';
import { Router } from 'express';
import swaggerRouter from '#src/router/swagger';

const router = Router();

router.use('/swagger', swaggerRouter);

router
  .route('/')
  .options(cors({ methods: ['OPTIONS', 'GET'] }))
  .get(cors(), (req, res) => {
    res
      .status(200)
      .json({
      });
  });

export default router;
