import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async signup(dto: SignupDto) {
    const exists = await this.userRepo.findOne({
      where: [{ email: dto.email }, { nickname: dto.nickname }],
    });
    if (exists)
      if (exists.email === dto.email) {
        throw new ConflictException('이미 가입된 이메일입니다.');
      }
    if (exists?.nickname === dto.nickname) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashed });
    await this.userRepo.save(user);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken: accessToken, message: '회원가입이 완료되었습니다.' };
  }

  // 로그인
  async signin(dto: SigninDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, message: '로그인이 완료되었습니다.' };
  }
}
