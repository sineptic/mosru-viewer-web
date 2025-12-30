import { render } from "./libs/preact/";
import { html } from "./libs/htm";
import { useEffect, useState } from "./libs/preact-hooks/";

const headers = new Headers();
headers.append("Authorization", `Bearer ${MOSRU_BEARER}`);
headers.append("x-mes-subsystem", "familyweb");

function Marks() {
    console.log("rendering marks");
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
        <ul>
            ${marks.payload.map(
                (subject_marks) =>
                    html`<li>subject: ${subject_marks.subject_name}</li>`,
            )}
        </ul>
    `;
}

function App() {
    return html`<${Marks} />`;
}

render(html`<${App} />`, document.body);
