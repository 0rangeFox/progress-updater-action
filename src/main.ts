import * as core from '@actions/core'
import { getAllFiles } from './fileUtil'

import fs from 'fs'
import path from 'path'
import util from 'util'

async function run(): Promise<void> {
  try {
    const dirPath = core.getInput('path')
    const fileExtension = core.getInput('extension')
    const verificationMessage = core.getInput('verification')

    core.info(`Directory path: ${dirPath}`)
    core.info(`File extension: ${fileExtension}`)
    core.info(`Verification message: ${verificationMessage}`)

    const readFile = util.promisify(fs.readFile)

    const filesFromPath = await getAllFiles(dirPath)
    const filesWithExtensionChosen = filesFromPath.filter(file => path.extname(file) === fileExtension)
    let filesWithVerificationMessageCounter = 0

    core.info(`Found ${filesFromPath.length} files on directory (recursively) and ${filesWithExtensionChosen.length} files with extension chosen.`)

    for (const filePath of filesWithExtensionChosen) {
      core.info(`Checking the file from path: ${filePath}`)

      const fileContents = await readFile(filePath)

      if (fileContents.includes(verificationMessage)) {
        core.info(`Found the file with the extension and verification chosen.`)
        filesWithVerificationMessageCounter++
      }

    }

    core.info(`Found ${filesWithVerificationMessageCounter} files with extension and verification message.`)

    core.setOutput('totalFiles', filesFromPath.length)
    core.setOutput('totalFilesWithExtension', filesWithExtensionChosen.length)
    core.setOutput('totalFilesWithExtensionAndVerification', filesWithVerificationMessageCounter)
    core.setOutput('progress', Math.round((filesWithVerificationMessageCounter / filesWithExtensionChosen.length) * 100) / 100)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
