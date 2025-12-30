Bun.serve({
  port: 3000,
  routes: {
    "/": async () => {
      const html = await Bun.file('./index.html').text();
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    },
    "/index.js": async () => {
      const js = await Bun.file('./index.js').text();
      return new Response(js, {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
  }
});

console.log('Server running at http://localhost:3000');
