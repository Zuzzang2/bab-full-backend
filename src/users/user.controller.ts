import {
  Controller,
  Get,
  UseGuards,
  Req,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserService } from './user.service';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@Controller('user')
@UseGuards(JwtStrategy)
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('/nickname')
  updateNickname(@Req() req, @Body() dto: UpdateNicknameDto) {
    return this.userService.updateNickname(req.user.userId, dto.nickname);
  }

  @Get('/me')
  async getProfile(@Req() req): Promise<UserProfileDto> {
    return this.userService.getProfile(req.user.userId);
  }

  @Delete('/me')
  deleteProfile(@Req() req) {
    return this.userService.deleteProfile(req.user.userId);
  }
}
