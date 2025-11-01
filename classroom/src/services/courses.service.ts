import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateCourseParams {
  title: string;
  slug?: string;
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async listAllCourses() {
    return await this.prisma.course.findMany();
  }

  async getCourseById(id: string) {
    return await this.prisma.course.findUnique({
      where: {
        id,
      },
    });
  }

  async createCourse({
    title,
    slug = slugify(title, { lower: true }),
  }: CreateCourseParams) {
    const courseAlreadyExists = await this.prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (courseAlreadyExists) {
      throw new BadRequestException('Course already exists');
    }

    return await this.prisma.course.create({
      data: {
        title,
        slug,
      },
    });
  }

  async getCourseBySlug(slug: string) {
    return await this.prisma.course.findUnique({
      where: {
        slug,
      },
    });
  }
}
