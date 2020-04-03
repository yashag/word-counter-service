import dbConnection from '../utils/database-connection';

import { WordStatistics } from './word-counter.types';

export const insertWordStatistics = (calculatedStatistics: WordStatistics) => {
    return new Promise<undefined>((resolve, reject) => {

        const insertStatment = dbConnection.prepare(`INSERT INTO words_statistics (word, counter) VALUES(:word, :counter)
        ON CONFLICT(word)
        DO UPDATE SET counter = counter + :counter;
        `);

        Object.entries(calculatedStatistics).forEach(statistic => {
            insertStatment.run(statistic, (err: Error) => {
                if (err) reject(err);
            });
        });

        insertStatment.finalize((err: Error) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};