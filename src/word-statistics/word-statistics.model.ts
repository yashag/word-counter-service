import dbConnection from '../utils/database-connection';

export const selectWordCount = (word: string): Promise<number> => {
    const selectQuery = `SELECT counter FROM words_statistics WHERE word = (?)`;

    return new Promise<number>((resolve, reject) => {
        dbConnection.get(selectQuery, [word], (err, row) => {
            err ? reject(err) : resolve(row?.counter ?? 0);
        });
    });
};