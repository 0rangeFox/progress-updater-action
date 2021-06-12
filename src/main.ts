import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import util from 'util'

import { getAllFilesFromDirectory } from './fileUtil'
import { updateReadme } from "./readmeUtil";

async function run(): Promise<void> {
  try {
    const dirPath = core.getInput('path')
    const fileExtension = core.getInput('extension')
    const verificationMessage = core.getInput('verification')

    core.info(`Directory path: ${dirPath}`)
    core.info(`File extension: ${fileExtension}`)
    core.info(`Verification message: ${verificationMessage}`)

    const readFile = util.promisify(fs.readFile)

    const filesFromPath = await getAllFilesFromDirectory(dirPath)
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

    const progress = (filesWithVerificationMessageCounter / filesWithExtensionChosen.length) * 100;
    const results : any[6] = [
      filesFromPath.length,
      filesWithExtensionChosen.length,
      filesWithVerificationMessageCounter,
      progress,
      Math.round(progress) / 100,
      Math.floor(progress)
    ]

    core.info(`Found ${results[2]} files with extension and verification message.`)

    if ((/true/i).test(core.getInput('readmeUpdate')))
      await updateReadme(results)

    core.setOutput('totalFiles', results[0])
    core.setOutput('totalFilesWithExtension', results[1])
    core.setOutput('totalFilesWithExtensionAndVerification', results[2])
    core.setOutput('progress', results[3])
    core.setOutput('progressRounded', results[4])
    core.setOutput('progressInteger', results[5])
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
