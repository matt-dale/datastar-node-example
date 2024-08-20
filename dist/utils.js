"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataStarEvent = createDataStarEvent;
exports.createSessionMiddleware = createSessionMiddleware;
const better_sse_1 = require("better-sse");
function createDataStarEvent({ frag, selector, mergeType, }) {
    let responseString = "event: datastar-fragment\n";
    if (selector)
        responseString += `data: selector ${selector}\n`;
    if (mergeType)
        responseString += `data: merge ${mergeType}\n`;
    return `data: fragment ${frag}\n\n`;
}
function createSessionMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield (0, better_sse_1.createSession)(req, res);
        res.sse = session;
        next();
    });
}
