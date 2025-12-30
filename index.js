import { render, createElement } from "/libs/preact/index.js";
// import { html } from "htm/preact";

function App() {
  return createElement("p", {}, "Hello");
  // return html`
  //   <h1>Hello World</h1>
  //   <p>What you are doing?</p>
  // `;
}

render(App(), document.body);
