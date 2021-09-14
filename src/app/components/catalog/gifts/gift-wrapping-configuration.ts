import { CatalogGiftConfigurationEvent } from '@nitrots/nitro-renderer';


export class GiftWrappingConfiguration
{
    private readonly _isEnabled: boolean = false;
    private readonly _price: number = null;
    private readonly _stuffTypes: number[] = null;
    private readonly _boxTypes: number[] = null;
    private readonly _ribbonTypes: number[] = null;
    private readonly _defaultStuffTypes: number[] = null;

    constructor(event: CatalogGiftConfigurationEvent)
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._isEnabled = parser.isEnabled;
        this._price = parser.price;
        this._boxTypes = parser.boxTypes;
        this._ribbonTypes = parser.ribbonTypes;
        this._stuffTypes = parser.giftWrappers;
        this._defaultStuffTypes = parser.giftFurnis;
    }

    // see _Str_5065
    public get isEnabled(): boolean
    {
        return this._isEnabled;
    }

    public get price(): number
    {
        return this._price;
    }

    // see _Str_17761
    public get stuffTypes(): number[]
    {
        return this._stuffTypes;
    }

    // see _Str_17162
    public get boxTypes(): number[]
    {
        return this._boxTypes;
    }

    // see _Str_17780
    public get ribbonTypes(): number[]
    {
        return this._ribbonTypes;
    }

    public get defaultStuffTypes(): number[]
    {
        return this._defaultStuffTypes;
    }
}
