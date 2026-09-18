import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    register(@Body() body: {name: string; email: string; password: string}) {
        const { name, email, password } = body;
        return this.authService.register(name, email, password);
    }

    @Post("login")
    login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        return this.authService.login(email , password);
    }

    @Get("user/:id")
    getUser(@Param('id') id: string) {
        return this.authService.getUserById(Number(id));
    }

    @Patch("user/:id/notification")
    updateNotification(
        @Param('id') id: string,
        @Body() body: { sendNotification: boolean }
    ) {
        return this.authService.updateNotification(Number(id), body.sendNotification);
    }
}

