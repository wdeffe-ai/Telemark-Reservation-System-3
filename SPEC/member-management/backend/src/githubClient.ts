import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.GITHUB_TOKEN;
const owner = process.env.REPO_OWNER!;
const repo = process.env.REPO_NAME!;
const path = process.env.FILE_PATH!;

if (!token || !owner || !repo || !path) {
  throw new Error("GITHUB_TOKEN, REPO_OWNER, REPO_NAME, FILE_PATH must be set in env");
}

const octokit = new Octokit({ auth: token });

export async function getMembersFile() {
  const resp = await octokit.repos.getContent({
    owner,
    repo,
    path
  });

  // content may be returned as string or object; Octokit returns data.content and data.sha
  // @ts-ignore
  const data = resp.data as any;
  if (!data.content) throw new Error("No content found");
  const contentBase64 = data.content;
  const json = Buffer.from(contentBase64, "base64").toString("utf8");
  const parsed = JSON.parse(json);
  return { parsed, sha: data.sha };
}

export async function updateMembersFile(newMembers: any[], commitMessage: string, sha: string) {
  const content = Buffer.from(JSON.stringify(newMembers, null, 2)).toString("base64");
  const resp = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: commitMessage,
    content,
    sha
  });
  return resp.data;
}
