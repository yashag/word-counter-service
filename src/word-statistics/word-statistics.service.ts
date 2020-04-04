import { selectWordCount } from './word-statistics.model';

export const queryWordCount = (word: string): Promise<number> => {
    return selectWordCount(word);
};