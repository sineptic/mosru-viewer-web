import { html } from "./libs/htm";
import { useEffect, useState } from "./libs/preact-hooks/";
import { apiHeaders, viewTransitionHelper } from "./utils.js";

export function Mark({ id, value, weight, control_form_name, comment, date }) {
  return html`
    <button
      popovertarget=${`mark-info-${id}`}
      class="relative select-none size-12 rounded-xl bg-[#f4f4f8] hover:bg-[#e8e8ef] flex justify-center items-center ${control_form_name ===
        "Контрольная работа" && "border-1 border-[#c92a2a]"}"
    >
      <div class="text-sm font-[700]">${value}</div>
      ${weight > 1 &&
      html`
        <div class="absolute bottom-1 right-1.5 text-[10px] font-[500]">
          ${weight}
        </div>
      `}
    </button>
    <div
      id=${`mark-info-${id}`}
      popover
      class="inset-0 m-auto max-w-[calc(100%-1rem)] backdrop:opacity-90 bg-unset"
    >
      <div class="p-3 pt-5 bg-purple-300 relative">
        <button
          popovertarget=${`mark-info-${id}`}
          popovertargetaction="hide"
          class="absolute top-1 right-3 text-red-600"
        >
          x
        </button>
        <p>date: ${date}</p>
        <p>control form name: ${control_form_name}</p>
        ${comment && html`<p>comment: ${comment}</p>`}
      </div>
    </div>
  `;
}

export default function Marks({ token, invalidateToken }) {
  let [marks, setMarks] = useState({ payload: [] });
  useEffect(async () => {
    let response = await fetch(
      "https://school.mos.ru/api/family/web/v1/subject_marks?student_id=31823383",
      {
        headers: apiHeaders(token),
      },
    );
    if (!response.ok) {
      console.error("can't fetch marks", response.body);
      invalidateToken();
      return;
    }
    let value = await response.json();
    console.log("marks: ", value);
    viewTransitionHelper("loading-marks", () => {
      setMarks(value);
    });
  }, []);
  return html`
    <div class="flex flex-col items-center gap-3">
      ${marks.payload
        .filter((x) => x.periods[0])
        .map((subject_marks) => {
          return html`<div
            class="flex flex-col px-6 bg-white py-5 rounded-2xl gap-5 w-full"
          >
            <div class="flex justify-between flex-wrap">
              <div class="text-size-15 text-wrap">
                ${subject_marks.subject_name}
              </div>
              <div
                class="px-4 py-3 border-1 border-dashed border-[#e8e8ef] rounded-lg flex flex-row flex-nowrap text-nowrap gap-1"
              >
                <span> ${subject_marks.average_by_all} </span>
                ${subject_marks.periods[0].fixed_value &&
                html`<span>→</span>
                  <span class="text-green-600"
                    >${subject_marks.periods[0].fixed_value}</span
                  >`}
              </div>
            </div>
            <div class="flex flex-wrap gap-4">
              ${subject_marks.periods
                .flatMap((x) => x.marks)
                .map((mark) => html`<${Mark} ...${mark} />`)}
            </div>
          </div>`;
        })}
    </div>
  `;
}
