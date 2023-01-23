console.log(chalk.blue("validating branch name"));
let localBranchName = (await $`git branch --show-current`).stdout.trim();

let allowedCategories = ["bugfix", "hotfix", "feature", "test", "release"];
let branchCategoriesRegex = `^(${allowedCategories.reduce((prev, current, index) => {
  let suffix = index === allowedCategories.length ? "" : "|";
  return prev + current + suffix;
}, "")})`;

let referenceRegex = "(#|issue-)[1-9]+";
let kebabCaseRegex = "([a-z][a-z0-9]*)(-[a-z0-9]+)*";

let validBranchRegex = new RegExp(`^${branchCategoriesRegex}\/${referenceRegex}\/${kebabCaseRegex}$`);

let errorMessage = "There is something wrong with your branch name. Branch name should satisfy contract category/issue-reference/description-in-kebab-case";

//TODO: check why during interactive rebase local_branch_name is not presented
//anyways its not a big hole and can stay like this for now
if (localBranchName && !validBranchRegex.test(localBranchName)) {
  console.log(chalk.red("x   "), errorMessage);
  console.log("Available categories: ", allowedCategories);
  console.log("Reference has to be of the form issue-{issueNumber} or #{issueNumber}");
  await $`exit 1`;
} else {
  await $`exit 0`;
}
