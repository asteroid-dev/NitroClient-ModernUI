import { Pipe, PipeTransform } from '@angular/core';
import { RoomObjectItem } from '../../components/room/widgets/events/RoomObjectItem';

@Pipe({ name: 'roomObjectItemSearch' })
export class RoomObjectItemSearchPipe implements PipeTransform
{
    public transform(items: RoomObjectItem[], searchText: string): RoomObjectItem[]
    {
        if(!items) return [] as RoomObjectItem[];
        if(!searchText) return items;

        return items.filter(item => item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
    }
}
