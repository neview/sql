import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm"
import { User } from "./User"

@Entity({
    name: 'id_card'
})
export class IdCard {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50,
        comment: '身份证号'
    })
    cardName: string

    // 在 IdCard 的 Entity 添加一个 user 列，指定它和 User 是 @OneToTone 一对一的关系。
    // 还要指定 @JoinColum 也就是外键列在 IdCard 对应的表里维护
    @JoinColumn()
    @OneToOne(() => User)
    user: User
}
