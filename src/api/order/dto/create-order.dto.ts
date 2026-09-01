import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { CreateOrderDetailDto } from "src/api/order/dto/create-order-detail.dto";

export class CreateOrderDto {
    
    @IsNotEmpty()
    @IsNumber()
    customer_id: number;

    @ValidateNested({ each: true}) //🔥 Validate each item in array
    @Type( () => CreateOrderDetailDto)
    orderDetails: CreateOrderDetailDto[];

}

/**User might create an order with the following payload:
 * {
  "customer_id": 1,
  "products": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 3
    }
  ]
}
 */
