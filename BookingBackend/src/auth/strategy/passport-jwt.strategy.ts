import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PayloadInterface } from '../../users/interfaces/payload.interface';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: PayloadInterface) {
    // j'ai récupéré mon user
    const user = await this.userRepository.findOneBy({ email: payload.email });
    // Si le user exste je le retourne et la automatiquement ce que je retourne dans validate
    // est mis dans le request
    if (user) {
      delete user.salt;
      delete user.password;
      return user;
    } else {
      // Si non je déclenche une erreur
      throw new UnauthorizedException();
    }

  }
}