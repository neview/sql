import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { AaaService } from './aaa/aaa.service';

@Injectable()
export class TaskService {

    @Inject(AaaService)
    private aaaService: AaaService;

    // '*/5 * * * * ?' 每隔5秒触发一次
    // '0 0 5-15 * * ?' 每天 5-15 点整点触发
    // '0 0 10,14,16 * * ?' 每天 10,14,16 点整点触发
    // '0 0 12 ? * WED' 每周三的12点触发
    // '0 0 17 ? * TUES,THUR,SAT' 每周二、周四、周六的17点触发
    // @Cron(CronExpression.EVERY_5_SECONDS, {
    //     name: 'testCron',
    //     timeZone: 'Asia/Shanghai'
    // })
    // handleCron() {
    //     // console.log('task execute');
    // }

    // // 任务间隔
    // @Interval('task2', 500)
    // task2() {
    //     // console.log('task2 execute');
    // }

    // // 任务延迟
    // @Timeout('task3', 3000)
    // task3() {
    //     // console.log('task3 execute');
    // }

}
