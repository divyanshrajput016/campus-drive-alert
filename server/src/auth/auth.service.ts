import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly Prisma: PrismaService) {}

  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    const existingUser = await this.Prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.Prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        sendNotification: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        sendNotification: true,
      },
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.Prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        sendNotification: user.sendNotification,
      },
    };
  }
}
