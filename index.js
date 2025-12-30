import { render } from "./libs/preact/";
import { html } from "./libs/htm";
import { useEffect, useState } from "./libs/preact-hooks/";

const headers = new Headers();
headers.append("Authorization", `Bearer ${MOSRU_BEARER}`);
headers.append("x-mes-subsystem", "familyweb");

function Mark({ value, weight, control_form_name }) {
  return html`<div
    class="relative select-none size-12 rounded-xl bg-[#f4f4f8] hover:bg-[#e8e8ef] flex justify-center items-center cursor-pointer ${control_form_name ===
      "Контрольная работа" && "border-1 border-[#c92a2a]"}"
  >
    <div class="text-sm font-[700]">${value}</div>
    ${weight > 1 &&
    html`<div class="absolute bottom-1 right-1.5 text-[10px] font-[500]">
      ${weight}
    </div>`}
  </div>`;
}

function Marks() {
  let [marks, setMarks] = useState({ payload: [] });
  useEffect(async () => {
    let response = await fetch(
      "https://school.mos.ru/api/family/web/v1/subject_marks?student_id=31823383",
      {
        headers: headers,
      },
    );
    if (!response.ok) return;
    let value = await response.json();
    setMarks(value);
  }, []);
  return html`
    <div class="flex flex-col w-full items-center gap-3">
      ${marks.payload.map(
        (subject_marks) =>
          html`<div
            class="flex flex-col px-6 bg-white py-5 rounded-2xl gap-5 w-full max-w-[1000px]"
          >
            <div class="flex justify-between w-full">
              <div class="text-size-15 w-full">
                ${subject_marks.subject_name}
              </div>
              <div
                class="px-4 py-3 border-1 border-dashed border-[#e8e8ef] rounded-lg"
              >
                ${subject_marks.average_by_all}
              </div>
            </div>
            <div class="flex flex-wrap gap-4">
              ${subject_marks.periods
                .flatMap((x) => x.marks)
                .map((mark) => html`<${Mark} ...${mark} />`)}
            </div>
          </div>`,
      )}
    </div>
  `;
}

function App() {
  return html`<div class="w-full h-full p-1 bg-[#f4f4f8]">
    <${Marks} />
  </div>`;
}

render(html`<${App} />`, document.body);
