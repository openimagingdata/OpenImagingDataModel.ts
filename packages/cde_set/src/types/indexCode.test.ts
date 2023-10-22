import { describe, it, expect } from 'vitest';
import { IndexCodeData } from './indexCode';

describe('IndexCode', () => {
  const indexCodeJson: IndexCodeData = {
    system: 'RADLEX',
    code: 'RID58',
    display: 'liver',
    href: 'http://www.radlex.org/RID/RID58',
  };
  const invalidIndexCodeJson: IndexCodeData = {
    system: 'RADLEX',
    code: 'RID58',
    display: undefined,
    href: undefined,
  };
  it('Parse index code JSON data', () => {
    expect(indexCodeJson).to.have.property('system', 'RADLEX');
    expect(indexCodeJson).to.have.property('code', 'RID58');
    expect(indexCodeJson).to.have.property('display', 'liver');
    expect(indexCodeJson).to.have.property(
      'href',
      'http://www.radlex.org/RID/RID58'
    );
  });
  //display and href are optional.
  it('Handle missing display and href ', () => {
    expect(invalidIndexCodeJson).to.have.property('display', undefined);
    expect(invalidIndexCodeJson).to.have.property('href', undefined);
  });
});
