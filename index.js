import { render } from "preact";
import { html } from "htm";
import { useState } from "preact-hooks";
import Marks from "./marks.js";
import CurrentHomework from "./homework.js";

function GiveMeToken({ setToken }) {
  const [tmpToken, setTmpToken] = useState("");
  const handleChange = (event) => {
    setTmpToken(event.target.value);
    event.preventDefault();
  };
  return html`
    <div class="give-me-token-outer">
        <div>
            <p>Mosru BEARER token</p>
            <input id="mosru-token" type="text" value=${tmpToken} onInput=${handleChange} class="give-me-token-input"></input>
            <button class="give-me-token-button" onClick=${() => tmpToken && setToken(tmpToken)}>
                Set!
            </button>
        </div>
    </div>
  `;
}

function Sidebar({screens, currentScreen, setScreen}) {
  return html`
    <div class="screen-selection-bar">
      ${screens.map(
        (scr) => { 
        const onClick = () => setScreen(scr[0]);
        let classes = "screen-link-tile";
        if (scr[0]===currentScreen) {
            classes += " active";
        }
        return html`
          <a onClick=${onClick} class=${classes}>
            ${scr[1]}
          </a>
        `;}
      )}
    </div>
  `;
}

function App() {
  const [currentScreen, setScreen] = useState("homework");
  const [token, setToken] = useState(localStorage.getItem("MOSRU_BEARER"));
  const invalidateToken = () => {
    setToken(null);
    localStorage.removeItem("MOSRU_BEARER");
  };
  const updateToken = (tk) => {
    setToken(tk);
    localStorage.setItem("MOSRU_BEARER", tk);
  };
  if (token === null) {
    return html`<${GiveMeToken} setToken=${updateToken} />`;
  }
  const screens = [
    ["marks", "Оценки"],
    ["homework", "Домашние Задания"],
  ];
  return html`
    <div class="main-screen-outer">
        <div class="divider-1"></div>
        <${Sidebar} screens=${screens} currentScreen=${currentScreen} setScreen=${setScreen} />
        <div class="divider-2"></div>
        <div class="main-screen-inner">
            <div class=${currentScreen !== "marks" ? "hidden" : undefined}>
                <${Marks} token=${token} invalidateToken=${invalidateToken} />
            </div>
            <div class=${currentScreen !== "homework" ? "hidden" : undefined}>
                <${CurrentHomework} token=${token} invalidateToken=${invalidateToken}/>
            </div>
        </div>
        <div class="divider-1"></div>
    </div>
  `;
}

render(html`<${App} />`, document.body);
