import * as core from '@actions/core'
import {getAllFiles} from './fileUtil'

import fs from 'fs'
import path from 'path'
import util from 'util'

async function run(): Promise<void> {
  try {
    const folderPath = core.getInput('path')
    const fileExtension = core.getInput('extension')
    const verificationMessage = core.getInput('verification')

    core.info(`Folder path: ${folderPath}`)
    core.info(`File extension: ${fileExtension}`)
    core.info(`Verification message: ${verificationMessage}`)

    const readFile = util.promisify(fs.readFile)

    const filesFromPath = await getAllFiles(folderPath)
    const filesWithExtensionChosen = filesFromPath.filter(file => path.extname(file) === fileExtension)
    let filesWithVerificationMessageCounter = 0

    core.info(`Found ${filesFromPath.length} files on directory (recursively) and ${filesWithExtensionChosen.length} files with extension chosen.`)

    for (const filePath of filesWithExtensionChosen) {
      const fileContents = await readFile(filePath)

      if (fileContents.includes(verificationMessage))
        filesWithVerificationMessageCounter++
    }

    core.info(`Found ${filesWithVerificationMessageCounter} files with extension and verification message.`)

    core.setOutput('totalFiles', filesFromPath.length)
    core.setOutput('totalFilesWithExtension', filesWithExtensionChosen.length)
    core.setOutput('totalFilesWithExtensionAndVerification', filesWithVerificationMessageCounter)
    core.setOutput('progress', (filesWithVerificationMessageCounter / filesWithExtensionChosen.length) * 100)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
