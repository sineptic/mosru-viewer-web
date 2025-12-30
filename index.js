import { render } from "preact";
import { html } from "htm/preact";

function App() {
  return html`
    <h1>Hello World</h1>
    <p>What you are doing?</p>
  `;
}

render(html`<${App} />`, document.getElementById("app"));
