import supertest from 'supertest';

import app from '../server';
import { countWordsInText } from '../src/word-counter/word-counter.service';

const request = supertest(app);

describe("words-statistics endpoint", () => {

  describe("GET /words-statistic", () => {

    beforeAll(() => {
      return countWordsInText(`customtestword customtestword customtestword`);
    });

    const getWordStatisticsPath = '/word-statistics';

    it("get the fitting counter for the word name", async done => {
      const response = await request.get(`${getWordStatisticsPath}?word=customtestword`)
      const result = parseInt(response.text, 10);

      expect(response.status).toBe(200)
      expect(result).toBe(3);
      done();
    });

    it("fail upon requesting the counter for a word never encountered before", async done => {
      const response = await request.get(`${getWordStatisticsPath}?word=hello`);
      const result = parseInt(response.text, 10);

      expect(response.status).toBe(200)
      expect(result).toEqual(0);
      done();
    });

    it("fail when word is not provided", async done => {
      const response = await request.get(getWordStatisticsPath);

      expect(response.status).toBe(400)
      expect(response.text).toBe("Bad Request");
      done();
    });

  });
});