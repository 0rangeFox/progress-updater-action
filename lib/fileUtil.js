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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFilesFromDirectory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getAllFiles(dirPath, files = []) {
    for (const filePath of fs_1.default.readdirSync(dirPath)) {
        if (fs_1.default.statSync(dirPath + "/" + filePath).isDirectory()) {
            files = getAllFiles(dirPath + "/" + filePath, files);
        }
        else {
            files.push(path_1.default.join(dirPath, "/", filePath));
        }
    }
    return files;
}
function getAllFilesFromDirectory(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => resolve(getAllFiles(path)));
    });
}
exports.getAllFilesFromDirectory = getAllFilesFromDirectory;
