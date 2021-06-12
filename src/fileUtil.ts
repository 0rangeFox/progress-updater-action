import fs from 'fs'
import path from 'path'

function getAllFiles(dirPath: string, files: string[] = []): string[] {
    files = files || []

    for (const filePath of fs.readdirSync(dirPath)) {
        if (fs.statSync(dirPath + "/" + filePath).isDirectory()) {
            files = getAllFiles(dirPath + "/" + filePath, files)
        } else {
            files.push(path.join(dirPath, "/", filePath))
        }
    }

    return files
}

export async function getAllFilesFromDirectory(path: string): Promise<string[]> {
    return new Promise(resolve => resolve(getAllFiles(path)))
}
