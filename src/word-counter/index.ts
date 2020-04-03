import { Router } from 'express';
import { postWordCount } from './word-counter.routes';

const wordCountRouter: Router = Router();

wordCountRouter.post('/', postWordCount);

export default wordCountRouter;