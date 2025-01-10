import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  pullOrCloneProjectCode,
  getProjectBranchList,
} from './utils/git-clone';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/get-card-list')
  async getProjectList(): Promise<any> {
    const repoUrl =
      'https://gitee.com/zgkaaa/gk-frontend-vuecli-outputconfig.git';
    const result = await getProjectBranchList(repoUrl);
    return result || null;
  }

  @Post('/pull-or-clone')
  pullOrClone(): boolean {
    const repoUrl =
      'https://gitee.com/zgkaaa/gk-frontend-vuecli-outputconfig.git';
    const projectName = 'testaaa';
    const branch = 'main';
    pullOrCloneProjectCode(repoUrl, `../app-code-repo/${projectName}`, [
      '-b',
      branch,
    ]);
    return true;
  }
}
