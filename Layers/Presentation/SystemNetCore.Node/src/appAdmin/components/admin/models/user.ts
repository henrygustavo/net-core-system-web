import { BaseEntity } from '../models/base-entity';

export class User extends BaseEntity {

    idRole: number;
    email: string;
    userName: string;
    phoneNumber: number;
    disabled: boolean;
    lockoutEnabled: boolean;
    password: string;
    confirmPassword: string;
    confirmUrl: string;
    role: string;
}
