import { describe, it, expect } from 'vitest';
import { ExamTypeIndex } from '.';

describe('ExamTypeIndex', () => {
  //write a test to make sure we have the right number of exam types
  it('should have more than 1 exam type', () => {
    expect(ExamTypeIndex.size).toBeGreaterThan(1);
    console.log(ExamTypeIndex.size);
  });
});
