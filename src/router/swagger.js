import express, { Router } from 'express';
import cors from 'cors';
import Swagger from 'swagger-ui-express';

const router = Router();

router.use('/spec', cors(), express.static('spec'));
router.use('/', Swagger.serve);
router.use('/', Swagger.setup(undefined, {
  swaggerOptions: {
    url: '/swagger/spec/swagger.yaml',
  },
}));

export default router;
