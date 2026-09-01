import { Injectable } from '@nestjs/common';
import { Item } from './interface/item.interface';

@Injectable()
export class ItemsService {

    private readonly items: Item[] = [
        {
            id: '1',
            name: 'Item One',
            description: 'This is item one',
            qty: 100
        },
        {
            id: '2',
            name: 'Item Two',
            description: 'This is item two',
            qty: 200
        }
    ];

    findAll(): Item[] {
        return this.items;
    }

    findOne(id: string) {
        const item =  this.items.find((item) => item.id === id);
        const data = item || 'Data Not Found';
        console.log('data: ', data)
        return data;
    }
    
}
