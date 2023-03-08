# Grid.js
Canvas drawing but for text... or something like that... This is an old project of mine to help me draw graphs, tables etc.. using only text and I might or might not write a better/modern version of it in the near future...

## To-do
- Fix strange behavior with autosize option (disabled by default)

## Simple example
```javascript
let grid = new Grid();

let ti = grid.textInfo('Hello\n     beautiful\n               world');
grid.create(ti.width+2, ti.height+2);
grid.write(1, 1, ti.text, true)

console.log(grid.toString());
```
```md
┌────────────────────┐
│Hello               │
│     beautiful      │
│               world│
└────────────────────┘
```
