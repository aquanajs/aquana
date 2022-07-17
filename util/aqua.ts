import { Duration } from "../deps/parser.ts";
import { serve } from "../deps/http.ts";

import { Router } from "./router.ts";
export class Aqua {
  port: number;
  router: Router;
  startedAt: number;
  constructor() {
    this.startedAt = Date.now();
    this.router = new Router();
    this.port = 8080;
  }
  get uptime(): Duration {
    return Duration.between(this.startedAt, Date.now());
  }
  enableTestRoute() {
    this.router.addRoute("/__test", "GET", async () => new Response(await JSON.stringify({
        uptime: this.uptime
    })))
  }
  setPort(port: number): Aqua {
    if (!port) {
      throw new ReferenceError("Cannot set port without providing one");
    }
    const validPort = Number(port);
    if (!validPort || isNaN(validPort)) {
      throw new TypeError("Port must be a number");
    }
    this.port = validPort;
    return this;
  }
  async handler(req: Request): Promise<Response> {
    this.router.middleware.forEach((fn) => fn(req));

    const reqURL = new URL(req.url);
    return await this.router.handle(reqURL.pathname, req.method, req);
  }
  async start() {
    return await serve(this.handler.bind(this), { port: this.port });
    /*
    console.log(
      `Aqua app started at localhost on port ${this.port} <http://localhost:${this.port}>`,
    );
    */
  }
}
