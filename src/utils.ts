import { NextFunction, Request, Response } from "express";
import { IDataStarCreation } from "./types";

export function createDataStarEvent({
  frag,
  selector,
  mergeType,
}: IDataStarCreation): string {
  let responseString = "event: datastar-fragment\n";
  if (selector) responseString += `data: selector ${selector}\n`;
  if (mergeType) responseString += `data: merge ${mergeType}\n`;
  responseString += `data: fragment ${frag}\n\n`;
  return responseString;
}

export function setupDataStarRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  next();
}
