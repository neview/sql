import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [ArticleModule],
  providers: [TasksService]
})
export class TaskModule { }
