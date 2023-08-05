import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config/dist';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { ReviewsModule } from './reviews/reviews.module';
@Module({
  imports: [AuthModule,ConfigModule.forRoot({isGlobal: true}), UsersModule, CommentsModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
