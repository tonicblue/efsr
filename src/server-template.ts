import Fs from 'fs';
import Path from 'path';
import Express, { type Request, type Response, type RequestHandler, type NextFunction, type Application } from 'express';

// ROUTE IMPORTS
/* imports */

export type HandlerThisArg = {
  handler: RequestHandler,
}
export type HttpVerb = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'options' | 'head' | 'all';
export type Route = {
  verb: HttpVerb,
  routePath: string | RegExp,
  handler: RequestHandler,
};

const httpVerbs: HttpVerb[] = ['get', 'post', 'delete', 'put', 'patch', 'options', 'head', 'all'];
const routes: Route[] = [];

// LOAD ROUTES
/* routes */

/* @ts-ignore */
function loadRoute (routePath: string | RegExp, routeHandler: any) {
  for (const verb of httpVerbs)
    if (verb in routeHandler) routes.push({ verb, routePath, handler: routeHandler[verb] });
}

async function middleware (this: HandlerThisArg, req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    await this.handler(req, res, next);
  } catch (err: any) {
    res
      .status(err?.status ?? 500)
      .send(err?.message ?? 'Something bad happened');
  }
}

export function addRoutesToApp (app: Application) {
  for (const { verb, routePath, handler } of routes) {
    console.log(`Adding route ${verb.toUpperCase()} ${routePath}`);
    app[verb](routePath, middleware.bind({ handler }));
  }
}

// DEV SERVER
/* devServer */