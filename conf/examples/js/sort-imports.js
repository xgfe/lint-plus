//sort-imports
// Bad 
import b from 'foo.js';
import a from 'bar.js';

// Good 
import * as foo from 'foo.js';
import * as bar from 'bar.js';