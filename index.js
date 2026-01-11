import { render } from "preact";
import { html } from "htm";
import { useEffect, useState } from "preact-hooks";
import Marks from "./marks.js";
import CurrentHomework from "./homework.js";

function GiveMeToken({ setToken }) {
  const [tmpToken, setTmpToken] = useState("");
  const handleChange = (event) => {
    console.log("hi");
    setTmpToken(event.target.value);
    event.preventDefault();
  };
  return html`
    <div class="flex flex-col items-start">
      <p>set token pls</p>
      <input type="text" value=${tmpToken} onInput=${handleChange} class="border-2 rounded-sm p-1"></input>
      <button class="border-green-600 bg-green-500 hover:border-green-700 border-2 rounded-sm p-1 m-1 overflow-hidden" onClick=${() => {
        if (tmpToken) {
          setToken(tmpToken);
        }
      }}>I finish!</button>
    </div>
  `;
}

function App() {
  const [screen, setScreen] = useState("homework");
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
  return html`<div class="w-full h-full p-1">
    <div class="flex flex-row justify-center">
      <div class="flex flex-col gap-1">
        ${screens.map(
          (scr) => html`
            <a
              class="hover:bg-[#e8e8ef] p-3 rounded-xl cursor-pointer select-none ${scr[0] ===
              screen
                ? "bg-[#e8e8ef] font-semibold"
                : ""}"
              onClick=${() => {
                setScreen(scr[0]);
              }}
            >
              ${scr[1]}
            </a>
          `,
        )}
      </div>
      <div class="w-6 min-w-0 flex-shrink"></div>
      <main class="w-full max-w-[1000px]">
        <div class=${screen === "marks" ? "" : "hidden"}>
          <${Marks} token=${token} invalidateToken=${invalidateToken} />
        </div>
        <div class=${screen === "homework" ? "" : "hidden"}>
          <${CurrentHomework}
            token=${token}
            invalidateToken=${invalidateToken}
          />
        </div>
      </main>
    </div>
  </div>`;
}

render(html`<${App} />`, document.body);
