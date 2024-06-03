import { JWT_TYPE } from '@Shared/enum/jwt.enum';

export interface IJwtPayload {
  id: number;
  roles: string[];
  type?: JWT_TYPE;
}
