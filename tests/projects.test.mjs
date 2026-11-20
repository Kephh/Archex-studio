import test from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.ts';

test('portfolio contains all 4 curated studio projects', () => {
  assert.equal(projects.length, 4);
  const ids = projects.map((p) => p.id);
  assert.deepEqual(ids, ['aera', 'morrow-cafe', 'baked-and-crust', 'archex-craft']);
  for (const p of projects) {
    assert.equal(p.status, 'live');
    assert.ok(p.summary.length > 20);
    assert.ok(p.disciplines.length >= 3);
  }
});

test('client projects have valid external URLs and no demo mentions', () => {
  const aera = projects.find((p) => p.id === 'aera');
  const morrow = projects.find((p) => p.id === 'morrow-cafe');
  const baked = projects.find((p) => p.id === 'baked-and-crust');

  assert.ok(aera?.externalUrl?.includes('aero-demo-rho.vercel.app'));
  assert.ok(morrow?.externalUrl?.includes('morrow-cafe-iota.vercel.app'));
  assert.ok(baked?.externalUrl?.includes('baked-n-crust.vercel.app'));

  for (const p of projects) {
    assert.ok(!p.title.toLowerCase().includes('demo'));
    assert.ok(!p.subtitle.toLowerCase().includes('demo'));
    assert.ok(!p.summary.toLowerCase().includes('demo'));
  }
});

test('archex-craft case study has valid route and external URL', () => {
  const craft = projects.find((p) => p.id === 'archex-craft');
  assert.ok(craft);
  assert.equal(craft.route, '/archex-craft/');
  assert.ok(craft.externalUrl?.includes('craft.archexweb.in'));
});
