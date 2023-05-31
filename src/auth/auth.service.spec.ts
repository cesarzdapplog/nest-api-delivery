import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'your_secret_key',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [AuthService, UserService, JwtStrategy],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        password: 'testpassword',
        email: '',
      };

      jest.spyOn(userService, 'findOnebyUsername').mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'testpassword');

      expect(result).toEqual(mockUser);
    });

    it('should return null if credentials are invalid', async () => {
      jest.spyOn(userService, 'findOnebyUsername').mockResolvedValue(null);

      const result = await authService.validateUser('testuser', 'testpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate and return a JWT token', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        password: 'testpassword',
        email: '',
      };

      const jwtToken = 'mocked_jwt_token';

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue(jwtToken);

      const result = await authService.login(mockUser);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'testuser',
        'testpassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: '1',
        username: 'testuser',
      });
      expect(result).toEqual(jwtToken);
    });
  });
});
