import { IObjectData } from '@nitrots/nitro-renderer';
import { RoomWidgetFurniInfostandUpdateEvent } from '../../events/RoomWidgetFurniInfostandUpdateEvent';

export class InfoStandFurniData
{
    private _id: number = 0;
    private _category: number = 0;
    private _name: string = '';
    private _description: string = '';
    private _imageUrl: string = '';
    private _purchaseOfferId: number = -1;
    private _extraParam: string = '';
    private _stuffData: IObjectData = null;
    private _groupId: number;
    private _ownerId: number = 0;
    private _ownerName: string = '';
    private _rentOfferId: number = -1;
    private _availableForBuildersClub: boolean = false;

    public get id(): number
    {
        return this._id;
    }

    public set id(k: number)
    {
        this._id = k;
    }

    public get category(): number
    {
        return this._category;
    }

    public set category(k: number)
    {
        this._category = k;
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(k: string)
    {
        this._name = k;
    }

    public get description(): string
    {
        return this._description;
    }

    public set description(k: string)
    {
        this._description = k;
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }

    public set imageUrl(url: string)
    {
        this._imageUrl = url;
    }

    public get purchaseOfferId(): number
    {
        return this._purchaseOfferId;
    }

    public set purchaseOfferId(k: number)
    {
        this._purchaseOfferId = k;
    }

    public get extraParam(): string
    {
        return this._extraParam;
    }

    public set extraParam(k: string)
    {
        this._extraParam = k;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }

    public set stuffData(k: IObjectData)
    {
        this._stuffData = k;
    }

    public set groupId(k: number)
    {
        this._groupId = k;
    }

    public get groupId(): number
    {
        return this._groupId;
    }

    public get ownerId(): number
    {
        return this._ownerId;
    }

    public set ownerId(k: number)
    {
        this._ownerId = k;
    }

    public get ownerName(): string
    {
        return this._ownerName;
    }

    public set ownerName(k: string)
    {
        this._ownerName = k;
    }

    public get rentOfferId(): number
    {
        return this._rentOfferId;
    }

    public set rentOfferId(k: number)
    {
        this._rentOfferId = k;
    }

    public get availableForBuildersClub(): boolean
    {
        return this._availableForBuildersClub;
    }

    public set availableForBuildersClub(flag: boolean)
    {
        this._availableForBuildersClub = flag;
    }

    public populate(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        this.id                         = event.id;
        this.category                   = event.category;
        this.name                       = event.name;
        this.description                = event.description;
        this.imageUrl                   = ((event.image && event.image.src) || null);
        this.purchaseOfferId            = event.purchaseOfferId;
        this.extraParam                 = event.extraParam;
        this.stuffData                  = event.stuffData;
        this.groupId                    = event.groupId;
        this.ownerName                  = event.ownerName;
        this.ownerId                    = event.ownerId;
        this.rentOfferId                = event.rentOfferId;
        this.availableForBuildersClub   = event.availableForBuildersClub;
    }
}
