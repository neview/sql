import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleService } from '../article/article.service';

@Injectable()
export class TasksService {

    @Inject(ArticleService)
    private articleService: ArticleService;

    @Cron(CronExpression.EVERY_DAY_AT_4AM)
    async handleCron() {
        // console.log('task execute')
        await this.articleService.flushRedisToDB()
    }
}
