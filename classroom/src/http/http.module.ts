import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';
import { DatabaseModule } from 'src/database/database.module';
import { StudentResolver } from './graphql/resolvers/students.resolver';
import { EnrollmentResolver } from './graphql/resolvers/enrollments.resolver';
import { CourseResolver } from './graphql/resolvers/courses.resolver';
import { StudentsService } from 'src/services/students.service';
import { EnrollmentsService } from 'src/services/enrollments.service';
import { CoursesService } from 'src/services/courses.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.graphql'),
    }),
  ],
  providers: [
    StudentResolver,
    EnrollmentResolver,
    CourseResolver,
    StudentsService,
    EnrollmentsService,
    CoursesService,
  ],
})
export class HttpModule {}
