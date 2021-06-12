import * as core from '@actions/core'
import fs from 'fs'
import path from 'path'
import util from 'util'

async function run(): Promise<void> {
  try {
    const folderPath = core.getInput('path')
    const fileExtension = core.getInput('extension')
    const verificationMessage = core.getInput('verification')

    const readFiles = util.promisify(fs.readdir)
    const readFile = util.promisify(fs.readFile)

    const filesFromPath = await readFiles(folderPath)
    const filesWithExtensionChosen = filesFromPath.filter(file => path.extname(file) === fileExtension)
    let filesWithVerificationMessageCounter = 0

    for (const filePath of filesWithExtensionChosen) {
      const fileContents = await readFile(filePath)

      if (fileContents.includes(verificationMessage))
        filesWithVerificationMessageCounter++
    }

    core.setOutput('totalFiles', filesFromPath.length)
    core.setOutput('totalFilesWithExtension', filesWithExtensionChosen.length)
    core.setOutput('totalFilesWithExtensionAndVerification', filesWithVerificationMessageCounter)
    core.setOutput('progress', (filesWithVerificationMessageCounter / filesWithExtensionChosen.length) * 100)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
