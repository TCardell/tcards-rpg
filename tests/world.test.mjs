import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import {
  start,
  restore,
  resolve,
  choices,
  validateContent,
  region,
} from '../packages/engine/world.ts';
function act(s, id) {
  return resolve(s, {
    commandId: crypto.randomUUID(),
    scopeId: s.id,
    expectedRevision: s.revision,
    cardInstanceId: s.cardInstanceId,
    actionId: id,
  });
}
test('catálogo SQL idéntico, destinos y gestos sin ambigüedad', () => {
  const file = readdirSync('supabase/migrations').find((f) => f.endsWith('_content.sql'));
  assert.deepEqual(
    JSON.parse(readFileSync('supabase/migrations/' + file, 'utf8').split('$region$')[1]),
    region,
  );
  for (const mutate of [
    (c) => (c.cards.square.actions[0].to = 'missing'),
    (c) => (c.cards.square.actions[0].slot = 'up'),
    (c) => (c.cards.square.actions[0].when = { missing: [0, 1] }),
  ]) {
    const copy = structuredClone(region);
    mutate(copy);
    assert.throws(() => validateContent(copy));
  }
});
test('encargo completo, regreso libre, consumo, equipo y premio único', () => {
  let s = start('aventura');
  for (const id of [
    'visit_inn',
    'speak',
    'ask',
    'defer',
    'speak',
    'ask',
    'accept',
    'return',
    'follow_road',
    'investigate',
    'strike',
    'guard',
    'riposte',
    'assist',
    'take',
    'equip',
    'drink',
    'return',
    'visit_inn',
    'speak',
    'report',
  ])
    s = act(s, id);
  assert.equal(s.state.quest, 3);
  assert.equal(s.state.gold, 12);
  assert.equal(s.state.equipped, 1);
  assert.equal(s.state.hp, 10);
  assert.throws(() => act(act(s, 'speak'), 'report'));
  assert.deepEqual(restore(JSON.parse(JSON.stringify(s))), s);
});
test('capacidad y coste, recoger o dejar; una consulta conserva la carta', () => {
  const s = start('a'),
    market = act(s, 'visit_market'),
    full = act(act(market, 'buy'), 'buy');
  assert.equal(full.state.gold, 0);
  assert.throws(() => act(full, 'buy'));
  const loot = { ...full, state: { ...full.state, node: 'loot', quest: 2 } };
  assert.throws(() => act(loot, 'take'));
  assert.equal(act(loot, 'leave').state.blade, 0);
  assert.equal(choices(s.state).length, 6);
  assert.equal(s.revision, 0);
  assert.throws(() =>
    resolve(s, {
      scopeId: s.id,
      commandId: 'c',
      cardInstanceId: s.cardInstanceId,
      actionId: 'visit_gate',
      expectedRevision: 1,
    }),
  );
  assert.throws(() => restore({ ...s, version: 2 }));
  assert.throws(() => restore({ ...s, state: { ...s.state, gold: -1 } }));
});
