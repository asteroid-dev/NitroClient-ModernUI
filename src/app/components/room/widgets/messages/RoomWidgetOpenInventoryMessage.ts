import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetOpenInventoryMessage extends RoomWidgetMessage
{
    public static RWGOI_MESSAGE_OPEN_INVENTORY: string = 'RWGOI_MESSAGE_OPEN_INVENTORY';
    public static INVENTORY_EFFECTS: string = 'inventory_effects';
    public static INVENTORY_BADGES: string = 'inventory_badges';
    public static INVENTORY_CLOTHES: string = 'inventory_clothes';
    public static INVENTORY_FURNITURE: string = 'inventory_furniture';

    private _inventoryType: string;

    constructor(k: string)
    {
        super(RoomWidgetOpenInventoryMessage. RWGOI_MESSAGE_OPEN_INVENTORY);

        this._inventoryType = k;
    }

    public get _Str_16732(): string
    {
        return this._inventoryType;
    }
}
