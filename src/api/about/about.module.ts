import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { AboutExpertise } from './entities/about-expertise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([About, AboutExpertise])],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
