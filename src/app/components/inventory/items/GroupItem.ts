import { AdvancedMap, IObjectData, IRoomEngine, Nitro } from '@nitrots/nitro-renderer';
import { FurniCategory } from './FurniCategory';
import { FurnitureItem } from './FurnitureItem';
import { IFurnitureItem } from './IFurnitureItem';

export class GroupItem
{
    private static INVENTORY_THUMB_XML: string = 'inventory_thumb_xml';
    private static _Str_4072: number = 0xCCCCCC;
    private static _Str_4169: number = 10275685;

    private _Str_18094: number = 1;
    private _Str_18535: number = 0.2;

    private _type: number;
    private _category: number;
    private _roomEngine: IRoomEngine;
    private _stuffData: IObjectData;
    private _extra: number;
    private _isWallItem: boolean;
    private _iconUrl: string;
    private _name: string;
    private _description: string;
    private _locked: boolean;
    private _selected: boolean;
    private _hasUnseenItems: boolean;
    private _items: AdvancedMap<number, FurnitureItem>;

    constructor(type: number, category: number, roomEngine: IRoomEngine, stuffData: IObjectData, extra: number)
    {
        this._type              = type;
        this._category          = category;
        this._roomEngine        = roomEngine;
        this._stuffData         = stuffData;
        this._extra             = extra;
        this._isWallItem        = false;
        this._iconUrl           = null;
        this._name              = null;
        this._description       = null;
        this._locked            = false;
        this._selected          = false;
        this._hasUnseenItems    = false;
        this._items             = new AdvancedMap();
    }

    public prepareGroup(): void
    {
        this.setIcon();
        this.setName();
        this.setDescription();
    }

    public dispose(): void
    {

    }

    public getItemByIndex(index: number): FurnitureItem
    {
        return this._items.getWithIndex(index);
    }

    public getItemById(id: number): FurnitureItem
    {
        return this._items.getValue(id);
    }

    public getTradeItems(count: number): IFurnitureItem[]
    {
        const items: IFurnitureItem[] = [];

        const furnitureItem = this.getLastItem();

        if(!furnitureItem) return items;

        let found   = 0;
        let i       = 0;

        while(i < this._items.length)
        {
            if(found >= count) break;

            const item = this.getItemByIndex(i);

            if(!item.locked && item.isTradable && (item.type === furnitureItem.type))
            {
                items.push(item);

                found++;
            }

            i++;
        }

        return items;
    }

    public push(item: FurnitureItem, unseen: boolean = false): void
    {
        const existing = this._items.getValue(item.id);

        if(!existing)
        {
            this._items.add(item.id, item);
        }
        else
        {
            existing.locked = false;
        }

        if(this._items.length === 1) this.prepareGroup();
    }

    public pop(): FurnitureItem
    {
        let item: FurnitureItem = null;

        if(this._items.length > 0)
        {
            item = this._items.getWithIndex((this._items.length - 1));

            this._items.remove(item.id);
        }

        return item;
    }

    public remove(k: number): FurnitureItem
    {
        const item = this._items.getValue(k);

        if(item)
        {
            this._items.remove(k);

            return item;
        }

        return null;
    }

    public getTotalCount(): number
    {
        const k = 0;

        if(this._category === FurniCategory._Str_12351)
        {
            let count   = 0;
            let i       = 0;

            while(i < this._items.length)
            {
                const item = this._items.getWithIndex(i);

                count = (count + parseInt(item.stuffData.getLegacyString()));

                i++;
            }

            return count;
        }

        return this._items.length;
    }

    public getUnlockedCount(): number
    {
        if(this.category === FurniCategory._Str_12351) return this.getTotalCount();

        let count = 0;

        let i = 0;

        while(i < this._items.length)
        {
            const item = this._items.getWithIndex(i);

            if(!item.locked) count++;

            i++;
        }

        return count;
    }

    public getLastItem(): FurnitureItem
    {
        if(!this._items.length) return null;

        const item = this._items.getWithIndex((this._items.length - 1));

        return item;
    }

    public unlockAllItems(): void
    {
        const didUnlock = false;

        if(this._items.length)
        {
            for(const item of this._items.getValues())
            {
                if(item && item.locked)
                {
                    item.locked = false;
                }
            }
        }
    }

    public lockItemIds(itemIds: number[]): void
    {
        for(const item of this._items.getValues())
        {
            const locked = (itemIds.indexOf(item.ref) >= 0);

            if(item.locked !== locked) item.locked = locked;
        }
    }

    private setName(): void
    {
        const k = this.getLastItem();

        if(!k)
        {
            this._name = '';

            return;
        }

        let key = '';

        switch(this._category)
        {
            case FurniCategory._Str_5186:
                key = (('poster_' + k.stuffData.getLegacyString()) + '_name');
                break;
            case FurniCategory._Str_9125:
                this._name = 'SONG_NAME';
                return;
            default:
                if(this.isWallItem)
                {
                    key = ('wallItem.name.' + k.type);
                }
                else
                {
                    key = ('roomItem.name.' + k.type);
                }
        }

        this._name = Nitro.instance.getLocalization(key);
    }

    private setDescription(): void
    {
        const k = this.getLastItem();

        if(!k)
        {
            this._description = '';

            return;
        }

        let key = '';

        switch(this._category)
        {
            case FurniCategory._Str_5186:
                key = (('poster_' + k.stuffData.getLegacyString()) + '_desc');
                break;
            case FurniCategory._Str_9125:
                this._description = 'SONG_NAME';
                return;
            default:
                if(this.isWallItem)
                {
                    key = ('wallItem.desc.' + k.type);
                }
                else
                {
                    key = ('roomItem.desc.' + k.type);
                }
        }

        this._description = Nitro.instance.getLocalization(key);
    }

    private setIcon(): void
    {
        if(this._iconUrl) return;

        let url = null;

        if(this.isWallItem)
        {
            url = this._roomEngine.getFurnitureWallIconUrl(this._type, this._stuffData.getLegacyString());
        }
        else
        {
            url = this._roomEngine.getFurnitureFloorIconUrl(this._type);
        }

        if(!url) return;

        this._iconUrl = url;
    }

    public get type(): number
    {
        return this._type;
    }

    public get category(): number
    {
        return this._category;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }

    public get extra(): number
    {
        return this._extra;
    }

    public get iconUrl(): string
    {
        return this._iconUrl;
    }

    public get name(): string
    {
        return this._name;
    }

    public get description(): string
    {
        return this._description;
    }

    public get hasUnseenItems(): boolean
    {
        return this._hasUnseenItems;
    }

    public set hasUnseenItems(flag: boolean)
    {
        this._hasUnseenItems = flag;
    }

    public get locked(): boolean
    {
        return this._locked;
    }

    public set locked(flag: boolean)
    {
        this._locked = flag;
    }

    public get selected(): boolean
    {
        return this._selected;
    }

    public set selected(flag: boolean)
    {
        this._selected = flag;
    }

    public get isWallItem(): boolean
    {
        const item = this.getItemByIndex(0);

        return (item ? item.isWallItem : false);
    }

    public get isGroupable(): boolean
    {
        const item = this.getItemByIndex(0);

        return (item ? item.isGroupable : false);
    }

    public get isSellable(): boolean
    {
        const item = this.getItemByIndex(0);

        return item ? item.sellable : false;
    }

    public get items(): AdvancedMap<number, FurnitureItem>
    {
        return this._items;
    }
}
