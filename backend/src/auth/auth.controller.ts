import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() body: any) {
        // Check if the email even exists first
        const existingUser = await this.usersService.findOneByEmail(body.email);
        if (!existingUser) {
            throw new UnauthorizedException('Account not found. Please register first.');
        }
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Wrong password. Please try again.');
        }
        return this.authService.login(user);
    }
}
