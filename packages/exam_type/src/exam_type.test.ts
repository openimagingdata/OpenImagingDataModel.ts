import { describe, it, expect } from 'vitest';
import { ExamType } from '.';
import { examTypeSchema } from './exam_type';

describe('ExamType', () => {
  it('class should have a version number', () => {
    expect(ExamType.VERSION).toBeTruthy();
  });

  const includedBodyParts = [
    'RID56',
    'RID294',
    'RID168',
    'RID237',
    'RID944',
    'RID1193',
    'RID30958',
    'RID295',
    'RID30346',
    'RID30345',
    'RID38068',
    'RID38069',
    'RID38070',
    'RID38034',
    'RID38035',
    'RID38036',
    'RID34801',
    'RID34802',
    'RID34803',
    'RID34804',
    'RID34805',
    'RID34806',
    'RID945',
    'RID1194',
    'RID290',
    'RID32830',
    'RID32829',
    'RID163',
    'RID162',
    'RID302',
    'RID375',
    'RID29188',
    'RID29189',
    'RID29190',
    'RID29191',
    'RID303',
    'RID2485',
    'RID2632',
    'RID13315',
    'RID33194',
    'RID33195',
    'RID33196',
    'RID301',
    'RID31695',
    'RID31696',
    'RID315',
    'RID322',
    'RID30748',
    'RID30749',
    'RID466',
    'RID34560',
    'RID34559',
    'RID34557',
    'RID34558',
    'RID35962',
    'RID34884',
  ];
  const examTypeSampleData = {
    loincId: '24531-6',
    commonName: 'US Retroperitoneum',
    playbookId: 'RPID2142',
    modality: 'US',
    lateral: false,
    focusedBodyParts: ['RID431'],
    includedBodyParts: includedBodyParts,
  };

  it('schema should parse the data', () => {
    const parsed = examTypeSchema.safeParse(examTypeSampleData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const examType = new ExamType(parsed.data);
      expect(examType.loincId).toBe('24531-6');
      expect(examType.commonName).toBe('US Retroperitoneum');
      expect(examType.playbookId).toBe('RPID2142');
      expect(examType.modality).toBe('US');
      expect(examType.lateral).toBe(false);
      expect(examType.focusedBodyParts).toEqual(['RID431']);
      expect(examType.includedBodyParts).toEqual(includedBodyParts);
    }
  });
});
