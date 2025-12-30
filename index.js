import { render } from "./libs/preact/";
import { html } from "./libs/htm";
import { useState } from "./libs/preact-hooks/";

function Counter() {
  let [value, setValue] = useState(0);

  return html`
    <button onClick=${() => setValue(value + 1)}>value is ${value}</button>
  `;
}

function App() {
  return html`
    <h1>Hello World</h1>
    <p>What you are doing?</p>
    <${Counter} />
  `;
}

render(html`<${App} />`, document.body);
