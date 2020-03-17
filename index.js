const core = require('@actions/core');
const github = require('@actions/github');

async function action(){
  try{

    console.log("Get Github token")
    const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN")//process.env.GITHUB_TOKEN
    const octokit = new github.GitHub(GITHUB_TOKEN)

    const pr = github.context.payload.pull_request

    if(!pr){
      return // This should not happen if things are set up correctly
    }
    console.log("Get files changed")
    files = await octokit.pulls.listFiles({
      ...github.context.repo,
      pull_number: pr.number
    });

    num_changes = files["data"][0]["changes"] // lines changed
    //console.log(JSON.stringify(files["data"]))
    var label_arr = core.getInput("size-label-colour")

    // Turn the custom input string into a JS array
    label_arr = label_arr.toString().split(" | ")
    label_arr.forEach(function(arr, index){
      label_arr[index] = label_arr[index].split(", ")
      label_arr[index][0] = Number(label_arr[index][0])
    })
    for (sizelabel of label_arr){
    // If a label is already on the PR which is on this label list,
    // remove it, it will be readded
    // Note this will error if the label doesn't exist,
    // that doesn't matter

    var existingLabels = await octokit.issues.removeLabel({
      ...github.context.repo,
      issue_number: pr.number,
      name: sizelabel[1]
    }).catch(err => {
      // It can't delete something which isn't there
    })
  }

    for (sizelabel of label_arr){

      if(num_changes < Number(sizelabel[0])){
        console.log("Added "+sizelabel[1])
        var cl = await octokit.issues.createLabel({
          ...github.context.repo,
          pull_number: pr.number,
          name: sizelabel[1],
          color: sizelabel[2] || "cb7119", // tiger orange default
          // description: //
        }).then(ok => {
          console.log(JSON.stringify(ok))
          console.log("Created Label")
        }).catch(err => {
          // If this is saying it's because the label already existed,
          // that doesn't matter
          console.log(JSON.stringify(err))

          // If the error is that it already exists, then update it

        })

        var cl = await octokit.issues.addLabels({
          ...github.context.repo,
          issue_number: pr.number,
          labels: [sizelabel[1]]
        }).then(ok => {
          console.log("Added Label")
        }).catch(err => {
          console.log(JSON.stringify(err))
        })


        break
      }
    }
  }catch(error){
     //console.log(error.message)
     core.setFailed(error.message)
     //core.setFailed(error.message);
  }
}

action()
