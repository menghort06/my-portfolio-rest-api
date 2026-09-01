import { RouterModule } from "@nestjs/core";
import { UsersModule } from "./users/users.module";
import { Module } from '@nestjs/common';
import { ItemsModule } from "./items/items.module";
import { CategoriesModule } from './categories/categories.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
import { UploadsModule } from './uploads/uploads.module';
import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { ContactModule } from './contact/contact.module';
import { SkillModule } from './skill/skill.module';
import { ProjectTypeModule } from './project-type/project-type.module';
import { ProjectsModule } from './projects/projects.module';

// api.module.ts  (a "grouping" module, not the root)
@Module({
  imports: [
    ItemsModule,
    UsersModule,
    CategoriesModule,
    CustomersModule,
    RouterModule.register([
      {
        path: 'api/v1',
        children: [
          {
            path: 'items', module: ItemsModule
          },
          { 
            path: 'users', module: UsersModule 
          },
          {
            path: 'categories', module: CategoriesModule
          },
          {
            path: 'customers', module: CustomersModule
          },
          {
            path: 'products', module: ProductsModule
          },
          {
            path: 'orders', module: OrderModule
          },
          {
            path: 'uploads', module: UploadsModule
          },
          {
            path: 'home', module: HomeModule
          },
          {
            path: 'about', module: AboutModule
          },
          {
            path: 'contact', module: ContactModule
          },
          {
            path: 'skill', module: SkillModule
          },
          {
            path: 'project-type', module: ProjectTypeModule
          },
          {
            path: 'project', module: ProjectsModule
          }
        ],
      },
    ]),
    ProductsModule,
    OrderModule,
    UploadsModule,
    HomeModule,
    AboutModule,
    ContactModule,
    SkillModule,
    ProjectTypeModule,
    ProjectsModule,
  ],
})
export class ApiModule {}