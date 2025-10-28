import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Course } from '../models/course';
import { CoursesService } from 'src/services/courses.service';
import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/http/authorization/authorization.guard';
import { CreateCourseInput } from '../inputs/create-course-inputs';
import { AuthUser, CurrentUser } from 'src/http/authorization/current-user';
import { StudentsService } from 'src/services/students.service';
import { EnrollmentsService } from 'src/services/enrollments.service';

@Resolver(() => Course)
export class CourseResolver {
  constructor(
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  @Query(() => [Course])
  @UseGuards(AuthorizationGuard)
  async courses() {
    return await this.coursesService.listAllCourses();
  }

  @Query(() => Course)
  @UseGuards(AuthorizationGuard)
  async course(@Args('id') id: string, @CurrentUser() user: AuthUser) {
    const student = await this.studentsService.getStudentByAuthUserId(user.sub);
    if (!student) {
      throw new BadRequestException('Student not found.');
    }
    const enrollment = await this.enrollmentsService.getByCourseAndStudentId(
      id,
      student.id,
    );
    if (enrollment) {
      return await this.coursesService.getCourseById(id);
    }
    throw new UnauthorizedException();
  }

  @Mutation(() => Course)
  @UseGuards(AuthorizationGuard)
  async createCourse(@Args('data') data: CreateCourseInput) {
    return await this.coursesService.createCourse(data);
  }
}
