import { createServer } from "./server";

const server = createServer();

const PORT = process.env.PORT || 7070;
server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
