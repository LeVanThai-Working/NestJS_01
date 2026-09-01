import { SetMetadata } from '@nestjs/common';
import { COMMON_CONSTANTS } from '../constants/common.constants.js';

export const Public = () => SetMetadata(COMMON_CONSTANTS.IS_PUBLIC_KEY, true);
