import { BetterMap } from "../deps/utils.ts";

type ReqCallback = (req: Request) => Promise<Response>;

type Middleware = (req: Request) => Promise<Response | void>;
export class Router {
    routes: BetterMap<string, ReqCallback>;
    middleware: Middleware[];
    constructor() {
      this.routes = new BetterMap<string, ReqCallback>(
        "Allowed Routes",
      );
      this.middleware = [];
    }
    use(callback: Middleware): void {
      this.middleware.push(callback);
    }
    addRoute(
      route: string,
      method: string,
      callback: ReqCallback,
    ): void {
      const exists = this.routes.get(route);
      if (exists) {
        console.warn(
          `Handler for ${route} already defined. It will be overwritten by your new handler.`,
        );
      }
      this.routes.set(`${method}_${route}`, callback);
    }
    async handle(route: string, method: string, req: Request): Promise<Response> {
      const handler = this.routes.find((_v, k) => Boolean(new RegExp(`${k.split("_")[1]}/*`).exec(route)) && k.split("_")[0] === method);
      if (!handler) {
        return new Response(JSON.stringify({ message: "Route not found!" }), {
          status: 404,
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        });
      }
      return await handler(req);
    }
  }
  