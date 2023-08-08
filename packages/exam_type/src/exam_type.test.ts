import { describe, it, expect } from 'vitest';
import ExamType from '.';

describe('ExamType', () => {
  it('should have a version number', () => {
    expect(ExamType.VERSION).toBeTruthy();
  });
});
