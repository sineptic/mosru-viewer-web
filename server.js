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
    "/utils.js": async () => serveFile("./utils.js"),
    "/marks.js": async () => serveFile("./marks.js"),
    "/homework.js": async () => serveFile("./homework.js"),

    "/libs/htm": Response.redirect("/libs/htm/import.js", 307),
    "/libs/htm/import.js": async () => serveFile("./libs/htm/import.js"),
    "/libs/htm/index.js": async () => serveFile("./libs/htm/index.js"),

    "/libs/preact-hooks.js": async () => serveFile("./libs/preact-hooks.js"),
    "/libs/preact.js": async () => serveFile("./libs/preact.js"),
  },
});

console.log("Server running at http://localhost:3000");
