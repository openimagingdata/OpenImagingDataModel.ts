import { describe, it, expect } from 'vitest';
import { BodyPartData, bodyPartSchema } from './bodyPart';

describe('BodyPart', () => {
  it('should parse body part JSON', () => {
    const bodyPartJson = {
      name: 'Aorta',
      index_codes: {
        system: 'RADLEX',
        code: 'RID480',
        display: 'Aorta',
        href: 'http://www.radlex.org/RID/RID480',
      },
    };
    const bodyPartData: BodyPartData = bodyPartSchema.parse(bodyPartJson);
    expect(bodyPartData).toHaveProperty('name', 'Aorta');
    expect(bodyPartData).toHaveProperty('index_codes');
    expect(bodyPartData.index_codes).toHaveProperty('system', 'RADLEX');
  });
});
