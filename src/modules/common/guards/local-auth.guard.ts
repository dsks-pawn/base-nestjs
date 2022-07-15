import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_LOCAL } from 'src/modules/auth/constants';

@Injectable()
export class LocalJwtAuthGuard extends AuthGuard(STRATEGY_LOCAL) {}
