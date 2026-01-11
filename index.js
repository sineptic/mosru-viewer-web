import { render } from "./libs/preact/";
import { html } from "./libs/htm";
import { useState } from "./libs/preact-hooks/";
import Marks from "./marks.js";
import CurrentHomework from "./homework.js";

function App() {
  const [screen, setScreen] = useState("homework");
  const [token, setToken] = useState(null);
  const invalidateToken = () => {
    setToken(null);
  };
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
