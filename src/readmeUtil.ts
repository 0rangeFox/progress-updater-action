import * as core from '@actions/core'
import { Octokit } from '@octokit/core'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN }).request

// @ts-ignore
const githubRepositoryDetails = process.env.GITHUB_REPOSITORY.split("/")
const githubUsername = githubRepositoryDetails[0]
const githubRepository = githubRepositoryDetails[1]

export async function getRepositoryDetails(): Promise<void> {
    return new Promise(async resolve => {
        const repositoryDetails = await octokit('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: githubUsername,
            repo: githubRepository,
            path: core.getInput('readmePath')
        }).catch(error => core.setFailed(`Failed:\n${error.message}`))

        // @ts-ignore
        const sha : string = repositoryDetails?.data.sha

        const contents = core.getInput("readmeContents").replace(/\${{\w*}}/g, match => {
            switch (match) {
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
