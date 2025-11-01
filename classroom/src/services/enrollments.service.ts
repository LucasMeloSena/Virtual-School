import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async listAllEnrollments() {
    return await this.prisma.enrollment.findMany({
      where: {
        canceledAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async listAllEnrollmentsByStudent(studentId: string) {
    return await this.prisma.enrollment.findMany({
      where: {
        studentId,
        canceledAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getByCourseAndStudentId(courseId: string, studentId: string) {
    return await this.prisma.enrollment.findFirst({
      where: {
        courseId,
        studentId,
        canceledAt: null,
      },
    });
  }

  async createEnrollent(courseId: string, studentId: string) {
    return await this.prisma.enrollment.create({
      data: {
        courseId,
        studentId,
      },
    });
  }
}
