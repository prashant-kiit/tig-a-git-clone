import { storeRepo, callServer } from "./helper.js";

async function addRepoAPI(repoName) {
    try {
        const body = {
            repo: {
                name: repoName,
            }
        }
        const response = await callServer("POST", "/repo", body);

        return response.data.body;
    } catch (error) {
        console.error(error.message);
    }
}

async function runAddRepo(repoName) {
    const repo = await addRepoAPI(repoName);
    console.log(repo)
    if (repo)
        storeRepo(repo);
}

export default runAddRepo;