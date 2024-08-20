import { Session } from "better-sse";
import { IncomingMessage, ServerResponse } from "http";

enum DataStarMergeType {
  MORPH_ELEMENT = "MORPH_ELEMENT",
  INNER_HTML = "INNER_HTML",
  OUTER_HTML = "OUTER_HTML",
  PREPEND_ELEMENT = "PREPEND_ELEMENT",
  APPEND_ELEMENT = "APPEND_ELEMENT",
  BEFORE_ELEMENT = "BEFORE_ELEMENT",
  AFTER_ELEMENT = "AFTER_ELEMENT",
  DELETE_ELEMENT = "DELETE_ELEMENT",
  UPSERT_ATTRIBUTES = "UPSERT_ATTRIBUTES",
}

interface IDataStarCreation {
  frag: string;
  selector?: string;
  merge?: string;
  mergeType?: DataStarMergeType;
}

declare module "express-serve-static-core" {
  interface Response {
    sse: Session;
  }
}

export { DataStarMergeType, IDataStarCreation };
