import { html } from "htm";
import { useEffect, useState } from "preact-hooks";
import { apiHeaders } from "./utils.js";

export function Mark({ id, value, weight, control_form_name, comment, date }) {
  const popoverId = `mark-info-${id}`;
  return html`
    <button
      popovertarget=${popoverId}
      class=${control_form_name === "Контрольная работа" ? "mark-tile-important": "mark-tile"}
    >
        ${value}
        <div class=${weight > 1 ? "mark-weight" : "mark-weight hidden"}>
          ${weight}
        </div>
    </button>
    <div popover class="mark-info-popover" id=${popoverId}>
        <button
          popovertarget=${popoverId}
          popovertargetaction="hide"
          class="popover-closer"
        >
          x
        </button>
        <p>date: ${date}</p>
        <p>control form name: ${control_form_name}</p>
        ${comment && html`<p>comment: ${comment}</p>`}
    </div>
  `;
}

function PeriodMark({average, final}) {
  return html`
    <div class="period-mark">
      <span> ${average} </span>
      ${final && html`<span>→</span><span class="period-mark-final">${final}</span>`}
    </div>
  `;
}
function SubjectMarks({subject_name, average_by_all, year_mark, periods}) {
  return html`
    <div class="subject_marks">
        <div class="subject_marks-header">
            ${subject_name}
            <${PeriodMark} average=${average_by_all} final=${year_mark}/>
        </div>
        ${periods.reverse().map((period) => html`
            <div class="marks-section">
                <${PeriodMark} average=${period.value} final=${period.fixed_value} />
                <div class="marks-section-marks">
                    ${period.marks.map((mark) => html`<${Mark} ...${mark} />`)}
                </div>
            </div>
        `)}
    </div>
  `;
}

export default function Marks({ token, invalidateToken }) {
  let [marksBySubject, setMarks] = useState([]);
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
    value = value.payload
    console.log("marks: ", value);
    setMarks(value);
  }, []);
  return html`
    <div class="marks-page">
      ${marksBySubject
        .filter((x) => x.periods.length > 0)
        .map((subject_marks) => html`<${SubjectMarks} ...${subject_marks}/>`)}
    </div>
  `;
}
