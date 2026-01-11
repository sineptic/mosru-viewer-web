import { html } from "htm";
import { useState, useEffect } from "preact-hooks";
import { apiHeaders, viewTransitionHelper } from "./utils.js";

function HomeworkMaterial({ hw, material, token }) {
  const navigateToMESHLibrary = async () => {
    let res = await fetch(
      `https://school.mos.ru/api/ej/partners/v1/homeworks/launch?homework_entry_id=${hw.homework_entry_id}&material_id=${material.uuid}`,
      {
        headers: apiHeaders(token),
      },
    );
    // NOTE: it answers with not ok somewhy
    // if (!res.ok) {
    //   console.error("failed getting material url");
    //   return;
    // }
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
  return html`<button
    class="bg-blue-200 my-1 p-1 rounded-md hover:bg-blue-300"
    onClick=${handleClick}
  >
    ${material.action_name}: ${material.title}
  </button>`;
}

function HomeworkTile({ hw, token }) {
  const transitionId = `hw-${hw.homework_id}`;
  let title = `created: ${hw.homework_created_at}`;
  if (hw.homework_created_at !== hw.homework_updated_at) {
    title += `\nmodified: ${hw.homework_updated_at}`;
  }
  return html`<div
    style="view-transition-name: ${transitionId}"
    class="bg-white px-4 py-3 rounded-2xl flex flex-row"
  >
    <div class="mt-3 font-semibold w-[180px]">${hw.subject_name}</div>
    <div
      class="bg-transparent w-4 min-w-0 flex-shrink transition-all duration-200"
    ></div>
    <div
      class="hover:bg-[rgb(244,244,248)] rounded-2xl pl-3 pr-2 py-4 w-full flex flex-col items-start"
      title="${title}"
    >
      <div>${hw.homework}</div>
      ${hw.materials
        // .filter((material) => material.action_name === "Пройти")
        .map(
          (material) =>
            html`<${HomeworkMaterial}
              hw=${hw}
              material=${material}
              token=${token}
            />`,
        )}
    </div>
  </div>`;
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
  return html`<div class="flex flex-col gap-6">
    ${grouped.map((byDay) => {
      let formattedDate = new Date(byDay[0].date).toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      formattedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      let groupId = `hw-day-group-${formatDate(new Date(byDay[0].date))}`;
      return html`<div class="flex flex-col gap-4">
        <h5 style="view-transition-name: ${groupId}" class="font-bold">
          ${formattedDate}
        </h5>
        ${byDay.map(
          (item) => html`<${HomeworkTile} hw=${item} token=${token} />`,
        )}
      </div>`;
    })}
  </div>`;
}

function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export default function CurrentHomework({ token, invalidateToken }) {
  let [homework, setHomework] = useState([]);
  useEffect(async () => {
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
    viewTransitionHelper("loading-homework", () => {
      setHomework(value.payload);
    });
  }, []);

  const today = new Date();

  const [selectedSubject, setSubject] = useState("none");
  const handleSubjectChange = (e) => {
    viewTransitionHelper("filtering-homework", () => {
      setSubject(e.target.value);
    });
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

  // NOTE: z index needed because elements with view transition name are on top by default
  return html`
    <div style="view-transition-name: filtering-topbar" class="sticky top-0 left-0 bg-green-500 z-10">
    <select id="homework-filtering-select" value=${selectedSubject} onChange=${handleSubjectChange}>
      <option value="none">без фильтра</option>
      ${subjectNames.map((name) => html`<option value=${name}>${name}</option>`)}
    </select>
    </div>
    <div>
      <${HomeworkGroup}
        items=${upcoming}
        order="desc"
        token=${token}
      />
      <div
      style="view-transition-name: horizontal-line"
      class="my-6 flex flex-col gap-0.5 items-center font-mono text-red-600 w-full">
        <hr class="border-red-500 w-full border-1"></hr>
        СЕЙЧАС
      </div>
      <${HomeworkGroup}
        items=${previous}
        order="desc"
        token=${token}
      />
    </div>`;
}
