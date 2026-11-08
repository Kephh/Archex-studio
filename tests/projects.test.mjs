import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.ts';

test('portfolio contains exactly one real project and three reserved positions', () => {
  assert.equal(projects.length, 4);
  assert.equal(projects[0].id, 'archex-web');
  assert.equal(
    projects.filter((project) => project.status === 'reserved').length,
    3,
  );
});

test('reserved projects have no routes and no indexability', () => {
  for (const project of projects.filter((item) => item.status === 'reserved')) {
    assert.equal(project.route, null);
    assert.equal(project.indexable, false);
  }
});

test('Archex Web remains evidence-dependent and non-indexable', () => {
  assert.equal(projects[0].indexable, false);
  assert.equal(projects[0].route, '/archex-web/');
});
