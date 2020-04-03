import supertest from 'supertest';

import app from '../app';

const request = supertest(app);

describe("This", () => {
  describe("should", () => {
    it("always pass", () => {
      expect(true).toBe(true);
    });
  });
});