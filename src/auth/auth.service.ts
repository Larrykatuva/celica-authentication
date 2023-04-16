import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateResult } from 'typeorm';
import { NodeMailerService } from '../notification/services/nodemailer.service';
import { RegisterUserDto } from './dtos/user.dto';
import { AppService } from '../application/services/app.service';
import { App } from '../application/entities/app.entity';
import { GrantCodeService } from '../application/services/grantCode.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private emailService: NodeMailerService,
    private grantCodeService: GrantCodeService,
    private appService: AppService,
  ) {}

  /**
   * Encrypt user password.
   * @param password
   */
  encryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * Decrypt user password.
   * @private
   */
  generateRandomCode(): string {
    return Math.random().toString(36).slice(2, 7);
  }

  decryptPassword(user: User, password: string): boolean {
    return user && bcrypt.compareSync(password, user.password);
  }

  /**
   * Verify activation code and update user status to activate.
   * @param code
   */
  async verifyUserCode(code: string): Promise<UpdateResult> {
    const codeExists = await this.userService.filterUser({ code: code });
    if (codeExists) throw new BadRequestException('Invalid verification code');
    return await this.userService.updateUser(
      { code: code },
      { code: '', active: true },
    );
  }

  /**
   * Create a new user and send an activation code to email.
   * @param user
   */
  async registerUser(user: RegisterUserDto): Promise<User> {
    const userExists = await this.userService.filterUser({ email: user.email });
    if (userExists)
      throw new BadRequestException('User email already registered');
    user.password = this.encryptPassword(user.password);
    user['code'] = this.generateRandomCode();
    return await this.userService.createUser(user as User);
  }

  async generateGrantCode(
    app: App,
    email: string,
    password: string,
  ): Promise<{ code: string }> {
    const user = await this.userService.filterUser({ email: email });
    if (!user) throw new BadRequestException('Invalid user email');
    if (!this.decryptPassword(user, password))
      throw new BadRequestException('Invalid login credentials');
    const grantCode = await this.grantCodeService.registerGrantCode(app, user);
    return { code: grantCode.code };
  }
}
