# SCE API v0.2.0

## Set format
```json
{
  "version": 1,
  "name": "Demo",
  "mode": 2,
  "theme": {"preset":"midnight","font":"serif"},
  "display": {"score":true,"progress":true,"variables":false},
  "variables": {"prestigi": 50},
  "cards": [
    {"id":"q1","text":"La pantalla ha d'estar neta.","responses":{
      "left":{"label":"Fals","correct":false,"score":0},
      "right":{"label":"Vertader","correct":true,"score":1,"next":"$end","effects":{"prestigi":5}}
    }}
  ]
}
```

Modes: 2 = left/right; 4 = farLeft/left/right/farRight (short vs long horizontal); "directions" = left/right/up/down; 6 = all actions. Card.mode optionally overrides set.mode. A response missing or enabled:false is disabled. Short horizontal gesture requires 52px, vertical requires 70px and dominance ratio 1.3, strong horizontal defaults to 150px (configurable 110–210). In 2-direction mode a long horizontal gesture still selects its normal side. No diagonal intensity boost.

Required card fields: unique id, nonempty text, responses (at least one enabled). Optional image, imageAlt, character, mode. Each enabled response needs label; correct can be true/false/null; score overrides default +1 for correct, 0 otherwise. feedback is an explanatory string; next omitted means next card in array, null or "$end" finishes, or use a card ID. effects is a map of numeric deltas applied to variables. set.start optionally sets initial card; set.linear:false hides total count for branching; set.endText customizes finish heading. Display flags score/progress default true; variables default false. theme.preset: midnight/paper/graphic/forest; font: serif/sans/mono; overrides bg/card/ink/accent/left/right accept hex #RRGGBB; background is a local relative URL or supported data:image URL and visible on desktop.

## Interaction layout
Primary actions are placed in spatial order: farLeft, left, up, right, farRight; down is placed in the lower toolbar. Only enabled actions are shown. SCE.player.responseLayout(actions) returns primary and secondary arrays. SCE.player.choiceStyle(action) returns side, opposite stamp position, and strong flag. Player.preview(action) synchronizes exact button, banner and card stamp; null clears feedback. These functions are independent of the meaning of the answers.

## Engine
```html
<link rel="stylesheet" href="engine/player.css">
<div id="game"></div>
<script src="engine/model.js"></script>
<script src="engine/gestures.js"></script>
<script src="engine/audio.js"></script>
<script src="engine/player.js"></script>
<script>
const player = new SCE.player.Player(document.getElementById('game'), mySet, {
  sound: true, threshold: 150,
  onAnswer(item, state) { console.log(item, state); },
  onFinish(state) { console.log(state.score); }
});
</script>
```
Player methods: choose(action), undo(), restart(), render(), destroy(). Call destroy before replacing the host or player. player.session exposes Session, state, card, actions. Session methods: answer(action) returns history item or null, undo(), restart(). SCE.model.validate(set) throws on invalid IDs, required properties, scores or next links. SCE.model.classify(dx,dy,allowed,threshold) returns action or null. SCE.gestures.bind(card,{allowed,threshold,onPreview,onAnswer,isBusy}) returns unbind callback (onAnswer receives action, dx, dy). SCE.audio.play(value), setEnabled(boolean). onRender(player) is called on active cards; onFinish on rendering final screen (may fire again if re-rendered). Extend using callbacks and own display instead of modifying core. For more complex logic, use Session or implement custom state on top of gesture API; automatic predicates aren't implemented in v0.1.

## Privacy & safety
All demo assets and edits stay local. Imported SVGs are rendered via img, never injected. JSON import validates required data; images restricted to same-origin/relative or supported data URLs. Keep untrusted sets out of arbitrary custom HTML.
