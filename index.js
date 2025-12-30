import { render } from "/libs/preact/index.js";
import { html } from "/libs/htm/import.js";

function App() {
  return html`
    <h1>Hello World</h1>
    <p>What you are doing?</p>
  `;
}

render(App(), document.body);
