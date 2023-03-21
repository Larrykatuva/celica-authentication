import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GrantCode } from '../entities/grantCode.entity';
import { Repository } from 'typeorm';
import { App } from '../entities/app.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class GrantCodeService {
  constructor(
    @InjectRepository(GrantCode)
    private grantCodeRepository: Repository<GrantCode>,
  ) {}

  /**
   * Generate random code.
   * @private
   */
  generateString(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Create grant code record and save it to cache.
   * @param app
   * @param user
   * @param optionals
   */
  async registerGrantCode(
    app: App,
    user: User,
    optionals?: any,
  ): Promise<GrantCode> {
    //Save to cache
    await this.grantCodeRepository.delete({ app: app, user: user });
    return await this.grantCodeRepository.save({
      code: this.generateString(40),
      app: app,
      user: user,
      ...optionals,
    });
  }

  /**
   * Redeem grant code.
   * Check from cache else check from db.
   * If already redeemed grant code raise error and revoke all access token given using the grant code.
   * Check if grant code has lasted more than 1 minute revoke it.
   * @param filterOption
   */
  async redeemGrantCode(filterOption: any): Promise<GrantCode> {
    //Check from cache else check from db.
    const grantCode = await this.grantCodeRepository.findOne({
      where: { ...filterOption },
      relations: ['app', 'user'],
    });
    if (!grantCode) throw new BadRequestException('Invalid grant code.');
    if (grantCode.redeemed) {
      //Raise error and revoke all access token given using the grant code.
    }
    //Check if grant code has lasted more than 1 minute revoke it.
    await this.grantCodeRepository.delete({ id: grantCode.id });
    return grantCode;
  }
}
