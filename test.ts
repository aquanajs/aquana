import { Aqua } from "./util/aqua.ts"

const aqua = new Aqua();

aqua.enableTestRoute()

await aqua.start()

console.log(
    `Aqua app started at localhost on port ${aqua.port} <http://localhost:${aqua.port}>`,
  );
