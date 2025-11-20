import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getProfile(userId: number): Promise<UserProfileDto> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'nickname', 'profileImageUrl'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async updateNickname(userId: number, newNickname: string) {
    const exists = await this.userRepo.findOne({
      where: { nickname: newNickname },
    });
    if (exists) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    await this.userRepo.update(userId, { nickname: newNickname });

    return { message: '닉네임이 성공적으로 변경되었습니다.' };
  }

  async deleteProfile(userId: number) {
    const result = await this.userRepo.delete(userId);

    if (result.affected === 0) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
