/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Scope to the package's own nodes/ — anchored at <rootDir> so the assembled
  // build context under .axiom/image/nodes/ (a copy) is never double-collected.
  testMatch: ['<rootDir>/nodes/**/*_test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.axiom/', '/dist/'],
  // The assembled build context under .axiom/ duplicates the root package.json;
  // ignore it for module/haste resolution to avoid a naming collision warning.
  modulePathIgnorePatterns: ['<rootDir>/.axiom/'],
};
