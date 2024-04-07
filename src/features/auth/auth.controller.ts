import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Authorized } from './decorators';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto';
import { LocalAuthGuard } from './guards';
import { IRequestWithUser } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  // _signInDto parameter is declared here to allow Swagger plugin
  // parse endpoint body signature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signIn(@Req() req: IRequestWithUser, @Body() _signInDto: SignInDto) {
    return this.authService.signIn(req.user);
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('refresh')
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @Authorized()
  @Get('profile')
  async getUserProfile(@Req() req: IRequestWithUser) {
    return this.authService.getUserProfile(req.user.id);
  }
}
