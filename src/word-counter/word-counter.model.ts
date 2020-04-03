import dbConnection from '../utils/database-connection';

import { WordStatistics } from './word-counter.types';

export const insertWordStatistics = (calculatedStatistics: WordStatistics) => {
    const insertStatment = dbConnection.prepare(`INSERT INTO words_statistics (word, counter) VALUES(:word, :counter)
        ON CONFLICT(word)
        DO UPDATE SET counter = counter + :counter;
    `);

    Object.entries(calculatedStatistics).forEach(statistic => {
        insertStatment.run(statistic, function (err: Error) {
            if (err) {
                console.error("An error ocurred during insertion. Details: ", err);
            }
        });
    });

    insertStatment.finalize();
};