import { IMessageEvent, INitroCommunicationManager, UnseenItemsEvent } from '@nitrots/nitro-renderer';
import { InventoryService } from '../services/inventory.service';
import { IUnseenItemTracker } from './IUnseenItemTracker';

export class UnseenItemTracker implements IUnseenItemTracker
{
    private _communication: INitroCommunicationManager;
    private _inventoryService: InventoryService;
    private _unseenItems: number[][];
    private _messages: IMessageEvent[];

    constructor(k: INitroCommunicationManager, inventoryService: InventoryService)
    {
        this._communication     = k;
        this._inventoryService  = inventoryService;
        this._unseenItems       = [];
        this._messages          = [];

        this.registerMessages();
    }

    public dispose(): void
    {
        this.unregisterMessages();

        this._communication = null;
        this._unseenItems   = null;
    }

    private registerMessages(): void
    {
        this.unregisterMessages();

        this._messages = [
            new UnseenItemsEvent(this.onUnseenItemsEvent.bind(this))
        ];

        for(const message of this._messages) this._communication.registerMessageEvent(message);
    }

    private unregisterMessages(): void
    {
        for(const message of this._messages) this._communication.removeMessageEvent(message);

        this._messages = [];
    }

    public _Str_8813(k: number): boolean
    {
        if(!this._Str_5621(k)) return false;

        delete this._unseenItems[k];

        this._Str_20981(k);

        return true;
    }

    public _Str_18075(category: number, itemIds: number[]): boolean
    {
        if(!this._Str_5621(category)) return false;

        const existing = this._unseenItems[category];

        for(const itemId of itemIds)
        {
            existing.splice(existing.indexOf(itemId), 1);
        }

        this._Str_23994(category, itemIds);

        return true;
    }

    public _Str_17159(k: number): boolean
    {
        if(this._Str_5621(k)) return false;

        delete this._unseenItems[k];

        this._Str_20981(k);

        return true;
    }

    public _Str_3613(category: number, itemId: number): boolean
    {
        if(!this._unseenItems[category]) return false;

        const items = this._unseenItems[category];

        return (items.indexOf(itemId) >= 0);
    }

    public _Str_16745(category: number, itemId: number): boolean
    {
        if(!this._unseenItems[category]) return false;

        const items = this._unseenItems[category];
        const index = items.indexOf(itemId);

        if(index === -1) return false;

        items.splice(index, 1);

        return true;
    }

    public _Str_11239(category: number): number[]
    {
        if(!this._unseenItems) return [];

        return this._unseenItems[category];
    }

    public _Str_5621(category: number): number
    {
        if(!this._unseenItems[category]) return 0;

        return this._unseenItems[category].length;
    }

    private onUnseenItemsEvent(event: UnseenItemsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        for(const category of parser.categories)
        {
            const itemIds = parser.getItemsByCategory(category);

            this._Str_18112(category, itemIds);
        }

        this._inventoryService.updateUnseenCount();
    }

    private _Str_18112(category: number, itemIds: number[]): void
    {
        if(!itemIds) return;

        let unseenItems = this._unseenItems[category];

        if(!unseenItems)
        {
            unseenItems = [];

            this._unseenItems[category] = unseenItems;
        }

        for(const itemId of itemIds)
        {
            if(unseenItems.indexOf(itemId) === -1) unseenItems.push(itemId);
        }
    }

    private _Str_20981(k: number): void
    {
        //this._communication.connection.send(new _Str_10536(k));
    }

    private _Str_23994(k: number, _arg_2: number[]): void
    {
        //this._communication.connection.send(new _Str_11812(k, _arg_2));
    }
}
