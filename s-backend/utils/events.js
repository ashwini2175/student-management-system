// Single-process SSE hub. Events carry invalidation signals, never private records.
const clients = new Set();
exports.stream = (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();
  const client = {
    res,
    id: req.user.id,
    role: req.user.role,
    prn: req.user.prn,
  };
  clients.add(client);
  res.write('data: {"type":"connected"}\n\n');
  const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 20000);
  const expiry = setTimeout(
    () => res.end(),
    Math.max(1, req.user.exp * 1000 - Date.now()),
  );
  req.on("close", () => {
    clearInterval(heartbeat);
    clearTimeout(expiry);
    clients.delete(client);
  });
};
exports.publish = (type, prn) => {
  for (const c of clients)
    if (!prn || c.role === "Teacher" || c.prn === prn)
      c.res.write(`data: ${JSON.stringify({ type })}\n\n`);
};
exports.close = () => {
  for (const c of clients) c.res.end();
  clients.clear();
};

exports.disconnect = (id) => {
  for (const c of clients) if (c.id === id) c.res.end();
};
