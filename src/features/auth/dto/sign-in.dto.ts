import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  username: string;

  @ApiProperty({ example: 'Test1234' })
  password: string;
}
