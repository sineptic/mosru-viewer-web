Bun.serve({
  port: 3000,
  routes: {
    "/": async () => {
      const html = await Bun.file('./index.html').text();
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }
});

console.log('Server running at http://localhost:3000');
