"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const posts_router_1 = require("./routes/posts-router");
const blogs_router_1 = require("./routes/blogs-router");
const testing_router_1 = require("./routes/testing-router");
exports.app = (0, express_1.default)();
exports.port = 3001;
const parserMiddleware = (0, body_parser_1.default)({});
exports.app.use(parserMiddleware);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/testing', testing_router_1.testingRouter);
