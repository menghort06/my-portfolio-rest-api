## Architecture Overview ONE TO ONE Relationship
You have a NestJS + TypeORM + PostgreSQL application with:

Two database entities (User and Address) with a One-to-One relationship

Two DTOs for validation (CreateUserDto and CreateAddressDto)

Cascading saves enabled for automatic relationship management

## 1. Database Entities (TypeORM)

# Entity Address
@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn()
    address_id: number;

    @Column()
    village: string;

    @Column()
    district: string;

    @Column()
    commune: string;

    @Column()
    province: string;

    @OneToOne(() => User, user => user.address)
    user: User;  // Reverse side of the relationship
}

Table name: addresses in PostgreSQL
Primary key: address_id (auto-incrementing)
Fields: Village, district, commune, province (all required strings)
Relationship: One-to-One with User (this is the inverse side)

# Entity User
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;
    
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    address_id: number;  // Foreign key column

    @OneToOne(() => Address, address => address.user, {
        cascade: true  // 🔥 CRITICAL: Auto-saves related Address
    })
    @JoinColumn({ name: "address_id" })  // 👈 This table owns the relationship
    address: Address;
}

Table name: users
Primary key: user_id
Fields: Name, email, address_id (foreign key)
Relationship:
Owner side: User (because it has @JoinColumn)
Foreign key: address_id references addresses.address_id
Cascade: true means when you save a User, the Address is automatically saved first, and the address_id is set

## 2. DTOs with Validation (class-validator)
export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    village: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsNotEmpty()
    @IsString()
    commune: string;

    @IsNotEmpty()
    @IsString()
    province: string;
}
All fields are required and must be non-empty strings

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ValidateNested()
    @Type(() => CreateAddressDto)
    @IsNotEmpty()
    address: CreateAddressDto;
}

name: Required string
email: Must be a valid email format (e.g., user@example.com) and required
address:
Must exist (@IsNotEmpty())
Nested validation (@ValidateNested()) - validates all fields inside CreateAddressDto
Type transformation (@Type(() => CreateAddressDto)) - converts plain object to DTO instance

## 3. Data Flow: From HTTP Request to Database
# Step 1: Client Sends Request
POST /users
{
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
        "village": "Sangkat Tonle Bassac",
        "district": "Khan Chamkar Mon",
        "commune": "Phnom Penh",
        "province": "Phnom Penh"
    }
}

# Step 2: Validation Pipeline (NestJS)

@Post()
createUser(@Body() createUserDto: CreateUserDto) {
    // Validation happens automatically before this line
    // If invalid, throws 400 Bad Request
}

The validation checks:

name → is string & not empty ✅
email → is valid email & not empty ✅
address → exists and is an object ✅
Recursively: address.village → string & not empty ✅
Recursively: address.district → string & not empty ✅
Recursively: address.commune → string & not empty ✅
Recursively: address.province → string & not empty ✅

async create(body: CreateUserDto) {
    const user = this.userRepository.create(body); 
    return this.userRepository.save(user);
}
This does work because of how TypeORM's create() and save() methods handle plain objects with cascade: true.

## What Actually Happens Behind the Scenes
# Step 1: this.userRepository.create(body)
When you pass a plain object to create(), TypeORM:
Creates a User entity instance
Recursively processes nested objects - If it finds a property that matches a relation (like address), it:
Checks if the nested object has the required fields for the related entity
Automatically creates an instance of the related entity (Address) from the plain object
Assigns it to the relation

const body = {
    name: "John",
    email: "john@example.com",
    address: {
        village: "Sangkat Tonle Bassac",
        district: "Khan Chamkar Mon",
        commune: "Phnom Penh",
        province: "Phnom Penh"
    }
};

const user = this.userRepository.create(body);
// TypeORM internally does:
// user = new User()
// user.name = "John"
// user.email = "john@example.com"
// 
// 🔥 IMPORTANT: TypeORM sees address is a relation
// const address = new Address()  ← AUTOMATICALLY CREATED!
// address.village = "Sangkat Tonle Bassac"
// address.district = "Khan Chamkar Mon"
// address.commune = "Phnom Penh"
// address.province = "Phnom Penh"
// user.address = address  ← It's now an Address ENTITY

# Step 2: this.userRepository.save(user)
Now user.address is already an Address entity instance (not a DTO), so:
TypeORM sees cascade: true on the @OneToOne relation
It automatically saves the Address first
Gets the address_id from the saved Address
Saves the User with the foreign key

-- TypeORM executes:
INSERT INTO addresses (village, district, commune, province) 
VALUES ('Sangkat Tonle Bassac', 'Khan Chamkar Mon', 'Phnom Penh', 'Phnom Penh')
RETURNING address_id;  -- Returns address_id = 5

INSERT INTO users (name, email, address_id) 
VALUES ('John', 'john@example.com', 5);

## One Caveat: Validation
Your DTO validation still works because:
ValidationPipe validates the incoming request using CreateUserDto
The validated DTO is passed to your service
create() converts the DTO to entities
The validation happens before create() is called, so you get:
✅ Input validation
✅ Entity creation with relations
✅ Cascade save

## Complete Working Flow
HTTP Request (JSON)
    ↓
[ValidationPipe] ← Validates against CreateUserDto
    ↓
Validated DTO (plain object with nested DTO)
    ↓
this.userRepository.create(dto)
    ↓ TypeORM sees relations
    ↓ Automatically creates Address entity from nested object
    ↓
User entity with Address entity
    ↓
this.userRepository.save(user)
    ↓ cascade: true triggers
    ↓ INSERT Address → gets ID
    ↓ INSERT User with address_id
    ↓
Database saved ✅