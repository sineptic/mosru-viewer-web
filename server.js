async function serveFile(path) {
  let content_type;
  switch (path.split(".").pop()) {
    case "js":
      content_type = "application/javascript";
      break;
    case "html":
      content_type = "text/html";
      break;
    default:
      throw `unknown type ${type}`;
  }
  const content = await Bun.file(path).text();
  return new Response(content, {
    headers: { "Content-Type": content_type },
  });
}

Bun.serve({
  port: 3000,
  routes: {
    "/": async () => serveFile("index.html"),
    "/index.js": async () => serveFile("./index.js"),
    "/networking.js": async () => {
      let content = await Bun.file("./networking.js").text();
      const secrets = await Bun.file("./secrets.json").json();
      return new Response(
        content.replaceAll("${MOSRU_BEARER}", secrets.MOSRU_BEARER),
        {
          headers: { "Content-Type": "application/javascript" },
        },
      );
    },
    "/marks.js": async () => serveFile("./marks.js"),
    "/homework.js": async () => serveFile("./homework.js"),

    "/libs/htm": Response.redirect("/libs/htm/import.js", 307),
    "/libs/htm/import.js": async () => serveFile("./libs/htm/import.js"),
    "/libs/htm/index.js": async () => serveFile("./libs/htm/index.js"),

    "/libs/preact-hooks/": Response.redirect(
      "/libs/preact-hooks/index.js",
      307,
    ),
    "/libs/preact-hooks/index.js": async () =>
      serveFile("./libs/preact-hooks/index.js"),

    "/libs/preact/": Response.redirect("/libs/preact/index.js", 307),
    "/libs/preact/index.js": async () => serveFile("./libs/preact/index.js"),
    "/libs/preact/render": async () => serveFile("./libs/preact/render.js"),
    "/libs/preact/create-element": async () =>
      serveFile("./libs/preact/create-element.js"),
    "/libs/preact/component": async () =>
      serveFile("./libs/preact/component.js"),
    "/libs/preact/clone-element": async () =>
      serveFile("./libs/preact/clone-element.js"),
    "/libs/preact/diff/children": async () =>
      serveFile("./libs/preact/diff/children.js"),
    "/libs/preact/create-context": async () =>
      serveFile("./libs/preact/create-context.js"),
    "/libs/preact/options": async () => serveFile("./libs/preact/options.js"),
    "/libs/preact/constants": async () =>
      serveFile("./libs/preact/constants.js"),
    "/libs/preact/diff/index": async () =>
      serveFile("./libs/preact/diff/index.js"),
    "/libs/preact/util": async () => serveFile("./libs/preact/util.js"),
    "/libs/preact/diff/catch-error": async () =>
      serveFile("./libs/preact/diff/catch-error.js"),
    "/libs/preact/diff/props": async () =>
      serveFile("./libs/preact/diff/props.js"),
  },
});

console.log("Server running at http://localhost:3000");
