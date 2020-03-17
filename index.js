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

    num_changes = files["data"][0]["changes"]
    console.log(JSON.stringify(files["data"]))
    var label_arr = core.getInput("size-label-colour")
    //console.log(label_arr)
    console.log(("1, 2, 3, 4, 5".split(", ")).toString())

    label_arr = label_arr.toString().split(" | ")
    console.log(label_arr[0])
    label_arr.forEach(function(arr, index){
      label_arr[index] = label_arr[index].split(", ")
      console.log(label_arr[index][0].toString())
      label_arr[index][0] = Number(label_arr[index][0])
    })

    console.log(label_arr[0][1])
    console.log("Split2")
    for (sizelabel of label_arr){
      console.log(sizelabel[1])
      console.log(num_changes)
      if(num_changes < Number(sizelabel[0])){
        console.log("Added "+sizelabel[1])
        var cl = await octokit.issues.createLabel({
          ...github.context.repo,
          pull_number: pr.number,
          name: sizelabel[1],
          color: sizelabel[2] || "cb7119", // tiger orange default
          // description: //
        }).catch(err => {
          console.log(JSON.stringify(err))
        }).then(ok => {
          console.log(JSON.stringify(cl))
        })
        console.log("Created Label")

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
