import { simpleGit } from 'simple-git';
import fs from 'fs';
// import path from 'path';
import { rimrafSync } from 'rimraf';

const gitOptions = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  // timeout: {
  //   block: 60000
  // }
};
export async function pullOrCloneProjectCode(repoUrl, projectName, options) {
  const git = simpleGit(gitOptions);
  try {
    const resp = await git.clone(repoUrl, projectName, options);
    console.log(resp);
  } catch (err) {
    console.log(err);
  }
}
export async function getProjectBranchList(repoUrl) {
  const tempDir = `temp-repo-${Date.now()}`;
  const git = simpleGit(gitOptions);
  try {
    // 克隆仓库到一个临时目录
    await git.clone(repoUrl, tempDir);
    // 进入克隆的仓库目录
    git.cwd(tempDir);
    // 获取分支列表
    const branches = await git.branch(['-r']);
    const repoInfo = await git.status();
    // 删除临时目录
    rimrafSync(tempDir);
    return {
      all: branches.all,
      current: repoInfo.tracking,
    };
  } catch (err) {
    console.error('获取分支列表失败:', err);
    return [];
  }
}
