import fs from 'fs'
import path from 'path'

export async function getAllFiles(dirPath: string, files: string[] = []): Promise<string[]> {
    return new Promise(async resolve => {
        files = files || []

        for (const filePath of fs.readdirSync(dirPath)) {
            if (fs.statSync(dirPath + "/" + filePath).isDirectory()) {
                files = await getAllFiles(dirPath + "/" + filePath, files)
            } else {
                files.push(path.join(dirPath, "/", filePath))
            }
        }

        resolve(files)
    })
}
