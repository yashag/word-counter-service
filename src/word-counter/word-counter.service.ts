import fs from 'fs';
import { cleanUpText } from '../utils/text-helpers';

import { WordStatistics } from './word-counter.types';
import { insertWordStatistics } from './word-counter.model';


export const countWordsInText = (text: string) => {
    const cleanedUpText: string = cleanUpText(text);

    const calculatedStatistics: WordStatistics = cleanedUpText
        .split(";")
        .reduce((accumulator: { [key: string]: number; }, word: string) => {
            accumulator[word] = (accumulator[word] || 0) + 1;
            return accumulator;
        }, {});

    return insertWordStatistics(calculatedStatistics);
};

export const countWordsInTextFile = (filePath: string) => {
    const readStream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
        readStream.on('data', chunk => {
            console.log(chunk);
        });

        readStream.on('error', reject);

        readStream.on('end', () => {
            // resolve(Buffer.concat(chunks).toString('utf8'))
            resolve();
        });
    });
}