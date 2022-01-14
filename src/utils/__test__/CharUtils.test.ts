import CharUtils from '../CharUtils';

describe('CharUtils', () => {
  it('#isNewline', () => {
    expect(CharUtils.isNewline('\n')).toBe(true);
    expect(CharUtils.isNewline('\r\n')).toBe(true);
    expect(CharUtils.isNewline(' ')).toBe(false);
    expect(CharUtils.isNewline(' \n')).toBe(false);
    expect(CharUtils.isNewline('a')).toBe(false);
  });
});
