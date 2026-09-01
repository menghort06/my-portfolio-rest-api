import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './entities/home.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Home])
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
