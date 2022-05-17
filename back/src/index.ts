import { createServer } from "./server";

const server = createServer();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
