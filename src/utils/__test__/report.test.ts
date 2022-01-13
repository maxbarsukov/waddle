import Report from '../Report';

describe('Report', () => {
  const testCases = {
    'My Message': { message: 'My Message', pos: { line: 0, column: 0 } },
    '2:2: Message': { message: 'Message', pos: { line: 1, column: 1 } },
    '101:101: Another Message': { message: 'Another Message', pos: { line: 100, column: 100 } },
  };

  Object.entries(testCases).forEach(([report, errorMessage]) => {
    it(`test for report ${report}`, () => {
      const res = Report.error(errorMessage);
      expect(res).toBe(report);
    });
  });
});
