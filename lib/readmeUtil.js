"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getRepositoryDetails = void 0;
const core = __importStar(require("@actions/core"));
const core_1 = require("@octokit/core");
const octokit = new core_1.Octokit({ auth: process.env.GITHUB_TOKEN }).request;
// @ts-ignore
const githubRepositoryDetails = process.env.GITHUB_REPOSITORY.split("/");
const githubUsername = githubRepositoryDetails[0];
const githubRepository = githubRepositoryDetails[1];
function getRepositoryDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const repositoryDetails = yield octokit('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: githubUsername,
                repo: githubRepository,
                path: core.getInput('readmePath')
            }).catch(error => core.setFailed(`Failed:\n${error.message}`));
            // @ts-ignore
            const sha = repositoryDetails === null || repositoryDetails === void 0 ? void 0 : repositoryDetails.data.sha;
            const contents = core.getInput("readmeContents").replace(/\${{\w*}}/g, match => {
                switch (match) {
                    default:
                        core.info(`Readme contents - Variable ${match} is not recognised.`);
                        return '';
                }
            });
            yield octokit('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: githubUsername,
                repo: githubRepository,
                path: core.getInput('readmePath'),
                message: '(Progress-Updater) Update README.md.',
                content: Buffer.from(contents, 'utf8').toString('base64'),
                sha,
            }).catch(error => core.setFailed(`Failed:\n${error.message}`));
            resolve();
        }));
    });
}
exports.getRepositoryDetails = getRepositoryDetails;