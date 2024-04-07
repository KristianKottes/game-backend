import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../guards';

/**
 * Protect endpoint using bearer JWT auth.
 */
export const Authorized = () => {
  const decorators = [UseGuards(JwtAuthGuard), ApiBearerAuth()];

  return applyDecorators(...decorators);
};
