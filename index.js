const core = require('@actions/core');
const github = require('@actions/github');

function action(){

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const octokit = new github.GitHub(GITHUB_TOKEN)

  const pr = github.context.payload.pull_request

  if(!pr){
    return // This should not happen if things are set up correctly
  }

  files = octokit.pulls.listFiles({
    ...github.context.repo,
    pull_number: pr.number
  });

  num_changes = files["changes"]

  for (sizelabel in core.getInput("size-label")){
    if(num_changes < sizelabel[0]){
      octokit.issues.createLabel({
        ...github.context.repo,
        pull_number: pr.number
        name: [sizelabel[1]]
        colour: sizelabel[2] || "cb7119" // tiger orange default
        // description: //
      })

      break
    }
  }
}
