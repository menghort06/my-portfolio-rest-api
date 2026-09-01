
## DTO
DTO = Data coming from outside (Request) for the validation. Represents incoming or outgoing API data.

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

So in professional NestJS projects, DTOs are commonly used for:

✅ Request validation
✅ Type conversion (string → number, string → Date)
✅ Reusing DTOs (PartialType, PickType, OmitType)
✅ Nested object validation
✅ Restricting allowed values
✅ Making APIs predictable and secure

## Entity
Entity = Data stored in database (Table) Represents a database table.

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
## Note:
POST /products
      ↓
CreateProductDto   ← Class for validation
      ↓
ProductsService    ← Class for business logic
      ↓
Product Entity     ← Class for database mapping
      ↓
PostgreSQL