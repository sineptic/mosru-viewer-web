import { html } from "htm";
import { useState, useEffect } from "preact-hooks";
import { apiHeaders } from "./utils.js";

function HomeworkMaterial({ hw, material, token }) {
  const navigateToMESHLibrary = async () => {
    let res = await fetch(
      `https://school.mos.ru/api/ej/partners/v1/homeworks/launch?homework_entry_id=${hw.homework_entry_id}&material_id=${material.uuid}`,
      {
        headers: apiHeaders(token),
      },
    );
    // NOTE: it answers with not ok somewhy
    let url = await res.text();
    console.info(`opening ${url}`);
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const navigateToAttachment = async () => {
    console.assert(material.urls.length === 1, [
      "more than one url is provided for attachment",
      material.urls,
    ]);
    const url = material.urls[0].url;
    console.info(`opening ${url}`);
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const handleClick = async () => {
    if (material.type === "attachments") {
      await navigateToAttachment();
    } else {
      await navigateToMESHLibrary();
    }
  };
  return html`
    <button class="button-resource-homeworkmaterial" onClick=${handleClick}>
        ${material.action_name}: ${material.title}
    </button>
  `;
}

function HomeworkTile({ hw, token }) {
  const transitionId = `hw-${hw.homework_id}`;
  let title = `created: ${hw.homework_created_at}`;
  if (hw.homework_created_at !== hw.homework_updated_at) {
    title += `\nmodified: ${hw.homework_updated_at}`;
  }
  return html`
    <div class="homework-tile">
        <div class="homework-subjectname">${hw.subject_name}</div>
        <div class="homework-text" title="${title}">
            <p>${hw.homework}</p>
            ${hw.materials.map((material) => html`
            <${HomeworkMaterial}
                hw=${hw}
                material=${material}
                token=${token}
            />
            `)}
        </div>
    </div>
  `;
}

function HomeworkGroup({ items, order, token }) {
  let grouped = Array.from(Map.groupBy(items, (item) => item.date).values());
  switch (order) {
    case "asc":
      grouped.sort((a, b) => a[0].date.localeCompare(b[0].date));
      break;
    case "desc":
      grouped.sort((a, b) => -a[0].date.localeCompare(b[0].date));
      break;
    default:
      throw `order must be 'asc' or 'desc', but it is ${order}`;
  }
  return html`<div>
    ${grouped.map((byDay) => {
      const date = new Date(byDay[0].date);
      byDay.sort((a, b) => a.subject_name.localeCompare(b.subject_name));
      return html`
        <div class="homework-daygroup">
            <h5 class="homework-date">
                ${datePretty(date)}
            </h5>
            ${byDay.map((item) => html`<${HomeworkTile} hw=${item} token=${token} />`)}
        </div>
      `;
    })}
  </div>`;
}

function _dateId(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
function datePretty(date) {
  let formattedDate = date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  formattedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  return formattedDate;
}

export default function CurrentHomework({ token, invalidateToken }) {
  let [homework, setHomework] = useState([]);
  useEffect(async () => {
    // TODO: split this query into 2: all after today(including) and all before today.
    // after today is more important and smaller
    let res = await fetch(
      "https://school.mos.ru/api/family/web/v1/homeworks?from=2025-09-01&to=2026-05-30&student_id=31823383",
      {
        headers: apiHeaders(token),
      },
    );
    if (!res.ok) {
      console.error("can't fetch homework.", res.body);
      invalidateToken();
      return;
    }
    let value = await res.json();
    console.log(value);
    setHomework(value.payload);
  }, []);

  let today = new Date();
  // so homeworks for today wouldn't be filtered
  today.setHours(0, 0, 0, 0);

  const [selectedSubject, setSubject] = useState("none");
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };
  const filtered = homework.filter((hw) => {
    if (selectedSubject === "none") return true;
    return hw.subject_name === selectedSubject;
  });

  const upcoming = filtered.filter((hw) => new Date(hw.date) >= today);
  const previous = filtered.filter((hw) => new Date(hw.date) < today);

  const subjectNames = Array.from(
    new Set(homework.map((hw) => hw.subject_name)),
  ).toSorted();

  return html`
    <div class="homework-filtering-bar">
       <select value=${selectedSubject} onChange=${handleSubjectChange}>
         <option value="none">без фильтра</option>
         ${subjectNames.map((name) => html`<option value=${name}>${name}</option>`)}
       </select>
    </div>
    <div>
        <${HomeworkGroup} items=${upcoming} order="desc" token=${token}/>
        <div class="homework-now-separator">
          <hr class="homework-now-hr"></hr>
          СЕЙЧАС
        </div>
        <${HomeworkGroup} items=${previous} order="desc" token=${token}/>
    </div>
  `;
}
