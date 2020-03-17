const core = require('@actions/core');
const github = require('@actions/github');

try{

  console.log("Get Github token")
  const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN")//process.env.GITHUB_TOKEN
  const octokit = new github.GitHub(GITHUB_TOKEN)

  const pr = github.context.payload.pull_request

  if(!pr){
    return // This should not happen if things are set up correctly
  }
  console.log("Get files changed")
  files = octokit.pulls.listFiles({
    ...github.context.repo,
    pull_number: pr.number
  });

  num_changes = files["changes"]
  var label_arr = core.getInput("size-label-colour").split(" | ")
  label_arr.foreach(arr => {arr.split(", "); arr[0] = Number(arr[0])})

  console.log(label_arr.toString())
  for (sizelabel of label_arr){
    if(num_changes < Number(sizelabel[0])){
      console.log("Added "+sizelabel[1])
      octokit.issues.createLabel({
        ...github.context.repo,
        pull_number: pr.number,
        name: [sizelabel[1]],
        colour: sizelabel[2] || "cb7119", // tiger orange default
        // description: //
      })

      break
    }
  }
}catch(error){
   core.setFailed(error);
}
