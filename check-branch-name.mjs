console.log(chalk.blue("validating branch name"));
let local_branch_name = (await $`git branch --show-current`).stdout.trim();
let allowedCategories = ["bugfix", "hotfix", "feature", "test"];
let branch_categories_regex = `^(${allowedCategories.reduce((prev, current, index) => {
  let suffix = index === allowedCategories.length ? "" : "|";
  return prev + current + suffix;
}, "")})`;

let reference_regex = "(#|issue-)[1-9]+";
let kebab_case_regex = "([a-z][a-z0-9]*)(-[a-z0-9]+)*";

let valid_branch_regex = new RegExp(`^${branch_categories_regex}\/${reference_regex}\/${kebab_case_regex}$`);

let errorMessage = "There is something wrong with your branch name. Branch name should satisfy contract category/issue-reference/description-in-kebab-case";

//TODO: check why during interactive rebase local_branch_name is not presented
//anyways its not a big hole and cant stay like this for now
if (local_branch_name && !valid_branch_regex.test(local_branch_name)) {
  console.log(chalk.red("x   "), errorMessage);
  console.log("Available categories: ", allowedCategories);
  console.log("Reference has to be of the form issue-{issueNumber} or #{issueNumber}");
  await $`exit 1`;
} else {
  await $`exit 0`;
}
