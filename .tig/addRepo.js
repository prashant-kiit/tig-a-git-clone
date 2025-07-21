import { retrieveToken, storeRepo } from "./helper.js";
import axios from "axios";

async function addRepoAPI(repoName) {
    try {
        const body = {
            repo: {
                name: repoName,
            }
        }
        const token = await retrieveToken();
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        const response = await axios.post("http://localhost:3000/repo", body, { headers })

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