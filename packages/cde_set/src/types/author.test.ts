import { describe, it, expect } from 'vitest';
import { AuthorData } from './author';

describe('Author', () => {
  it('Parse author JSON data', () => {
    const authorJson: AuthorData = {
      person: [
        {
          name: 'Name',
          orcid_id: 'orcid_id',
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
    
  });
});
