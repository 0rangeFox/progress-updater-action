import fs from 'fs'
import path from 'path'

export async function getAllFiles(dirPath: string, files: string[] = []): Promise<string[]> {
    return new Promise(async resolve => {
        files = files || []

        for (const file of fs.readdirSync(dirPath)) {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                files = await getAllFiles(dirPath + "/" + file, files)
            } else {
                files.push(path.join(__dirname, dirPath, "/", file))
            }
        }

        resolve(files)
    })
}
