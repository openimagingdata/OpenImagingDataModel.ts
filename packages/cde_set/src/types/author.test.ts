import { describe, it, expect } from 'vitest';
import { AuthorData } from './author';

describe('Author', () => {
  const authorJson: AuthorData = {
    person: [
      {
        name: 'Name',
        orcid_id: '1234',
        twitter_handle: 'twitter_handle',
        url: 'http://www.radlex.org/RID/RID480',
        role: 'author',
      },
    ],
    organization: [
      {
        name: 'Name',
        abbreviation: 'abbreviation',
        url: 'http://www.radlex.org/RID/RID480',
        comment: 'this is a comment',
        role: 'author',
      },
    ],
  };
  it('Parse author JSON data', () => {
    //check author attributes
    expect(authorJson).toHaveProperty('person');
    expect(authorJson).toHaveProperty('organization');
  });
  //check person attributes
  it('Parse person JSON data', () => {
    const person = authorJson.person[0];
    expect(person).to.have.property('name', 'Name');
    expect(person).to.have.property('orcid_id', '1234');
    expect(person).to.have.property('twitter_handle', 'twitter_handle');
    expect(person).to.have.property('url', 'http://www.radlex.org/RID/RID480');
    expect(person).to.have.property('role', 'author');
  });
  //check organization attributes
  it('Parse organization JSON data', () => {
    const organization = authorJson.organization[0];
    expect(organization).to.have.property('name', 'Name');
    expect(organization).to.have.property('abbreviation', 'abbreviation');
    expect(organization).to.have.property(
      'url',
      'http://www.radlex.org/RID/RID480'
    );
    expect(organization).to.have.property('comment', 'this is a comment');
    expect(organization).to.have.property('role', 'author');
  });
  //
  it('Handle missing required fields', () => {
    //Partial makes all field optional
    const invalidAuthorJson: Partial<AuthorData> = {
      // Missing 'person' and 'organization' arrays
    };
    expect(invalidAuthorJson).not.to.have.property('person');
    expect(invalidAuthorJson).not.to.have.property('organization');
  });
  it('Handle correct data type', () => {
    const person = authorJson.person[0];
    expect(person).not.to.have.property('orcid_id', 1234);
  });
});
