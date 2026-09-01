import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';

const dataBaseConnectionConfig = {
  type: 'postgres' as 'postgres', // TypeScript might need this hint
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1996',
  database: 'portfolio', // Replace with actual database name
  autoLoadEntities: true,
  synchronize: false,
  logging: true
}

@Module({
  imports: [
    TypeOrmModule.forRoot( //forRoot() creates the database connection once for the whole application
      dataBaseConnectionConfig
    ),
    ApiModule     
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
