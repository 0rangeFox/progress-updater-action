import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'

export async function getAllFiles(dirPath: string, files: string[] = []): Promise<string[]> {
    core.info(`Dir Path: ${dirPath}`)

    return new Promise(async resolve => {
        files = files || []

        for (const filePath of fs.readdirSync(dirPath)) {
            if (fs.statSync(dirPath + "/" + filePath).isDirectory()) {
                files = await getAllFiles(dirPath + "/" + filePath, files)
            } else {
                files.push(path.join(dirPath, "/", filePath))
                core.info(`File Path: ${filePath}`)
            }
        }

        resolve(files)
    })
}
