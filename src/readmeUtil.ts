import * as core from '@actions/core'
import { Octokit } from '@octokit/core'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN }).request

// @ts-ignore
const githubRepositoryDetails = process.env.GITHUB_REPOSITORY.split("/")
const githubUsername = githubRepositoryDetails[0]
const githubRepository = githubRepositoryDetails[1]

export async function getRepositoryDetails(results : any[]): Promise<void> {
    return new Promise(async resolve => {
        const repositoryDetails = await octokit('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: githubUsername,
            repo: githubRepository,
            path: core.getInput('readmePath')
        }).catch(error => core.setFailed(`Failed:\n${error.message}`))

        // @ts-ignore
        const sha : string = repositoryDetails?.data.sha

        const contents = core.getInput("readmeContents").replace(/\${\w*}/g, match => {
            switch (match.toLowerCase()) {
                case "${Repository}".toLowerCase(): return githubRepository
                case "${Branch}".toLowerCase(): return githubRepository
                case "${Path}".toLowerCase(): return core.getInput('path')
                case "${Extension}".toLowerCase(): return core.getInput('extension')
                case "${Verification}".toLowerCase(): return core.getInput('verification')
                case "${TotalFiles}".toLowerCase(): return results[0]
                case "${TotalFilesWithExtension}".toLowerCase(): return results[1]
                case "${TotalFilesWithExtensionAndVerification}".toLowerCase(): return results[2]
                case "${Progress}".toLowerCase(): return results[3]
                case "${ProgressRounded}".toLowerCase(): return results[4]
                case "${ProgressInteger}".toLowerCase(): return results[5]
                default:
                    core.info(`Readme contents - Variable ${match} is not recognised.`)
                    return ''
            }
        })

        await octokit('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: githubUsername,
            repo: githubRepository,
            path: core.getInput('readmePath'),
            message: '(Progress-Updater) Update README.md.',
            content: Buffer.from(contents, 'utf8').toString('base64'),
            sha,
        }).catch(error => core.setFailed(`Failed:\n${error.message}`))

        resolve()
    })
}
