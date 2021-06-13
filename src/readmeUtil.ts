import * as core from '@actions/core'
import { Octokit } from '@octokit/core'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN }).request

const githubRepositoryDetails = process!.env!.GITHUB_REPOSITORY!.split("/")
const githubUsername = githubRepositoryDetails[0]
const githubRepository = githubRepositoryDetails[1]
const githubBranch = process!.env!.GITHUB_REF!.split("/")[2];

async function getRepositorySHA(): Promise<string> {
    const repositoryDetails = await octokit('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: githubUsername,
        repo: githubRepository,
        path: core.getInput('readmePath')
    }).catch(error => core.setFailed(`Failed:\n${error.message}`))

    // @ts-ignore
    return repositoryDetails!.data.sha
}

function generateReadmeContents(results : any[]) : string {
    return Buffer.from(core.getInput("readmeContents").replace(/\${\w*}/g, match => {
        switch (match.toLowerCase()) {
            case "${Repository}".toLowerCase(): return githubRepository
            case "${Branch}".toLowerCase(): return githubBranch
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
    }), 'utf8').toString('base64')
}

export async function updateReadme(results : any[]): Promise<void> {
    return new Promise(async resolve => {
        const githubRepositorySHA = await getRepositorySHA()

        await octokit('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: githubUsername,
            repo: githubRepository,
            path: core.getInput('readmePath'),
            sha: githubRepositorySHA,
            message: '(Progress-Updater) Update README.md.',
            content: generateReadmeContents(results),
        }).catch(error => core.setFailed(`Failed:\n${error.message}`))

        resolve()
    })
}
