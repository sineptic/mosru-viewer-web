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
  },
});

console.log("Server running at http://localhost:3000");
