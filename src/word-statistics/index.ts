import { Router } from 'express';
import { getWordStatistics } from './word-statistics.routes';

const wordStatisticsRouter: Router = Router();

wordStatisticsRouter.get('/', getWordStatistics);

export default wordStatisticsRouter;