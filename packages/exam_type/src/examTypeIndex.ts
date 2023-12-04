import { ExamTypeData } from './exam_type';

export default class ExamTypeIndex {
  static VERSION = '0.0.1';
  private static _idIndex: Map<string, ExamTypeData>;

  static {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const examTypes: ExamTypeData[] = require('../data/exam_types.json');
    ExamTypeIndex._idIndex = new Map();
    examTypes.forEach((examType) => {
      ExamTypeIndex._idIndex.set(examType.loincId, examType);
    });
  }

  public static get(loincId: string): ExamTypeData | undefined {
    return ExamTypeIndex._idIndex.get(loincId);
  }

  public static has(loincId: string): boolean {
    return ExamTypeIndex._idIndex.has(loincId);
  }

  static get size(): number {
    return ExamTypeIndex._idIndex.size;
  }

  // create an iterator for the exam types
  static [Symbol.iterator](): IterableIterator<ExamTypeData> {
    return ExamTypeIndex._idIndex.values();
  }
}
