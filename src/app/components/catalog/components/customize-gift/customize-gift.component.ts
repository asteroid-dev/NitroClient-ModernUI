import { Component, Input, NgZone, OnDestroy } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: 'nitro-catalog-customize-gift-component',
    templateUrl: './customize-gift.template.html'
})
export class CatalogCustomizeGiftComponent implements OnDestroy
{
    @Input()
    public visible: boolean = false;

    public showUsernameErrorDialog: boolean = false;

    public receiverName: string = '';
    public message: string = '';
    public showFace: boolean = true;

    public habboFace: string = '';
    public hasColors: boolean = false;
    public boxText: string;
    public priceText: string;
    public ribbonText: string;
    public boxSpriteId: number = -1;
    public extras: string = '';

    private readonly _stuffTypes: number[];
    private readonly _defaultStuffType: number;
    private readonly _boxTypes: number[];
    private readonly _ribbonTypes: number[];
    private readonly _boxPrice: number;

    private _ribbonIndex: number;
    private _boxIndex: number;
    private _selectedTypeId: number;
    private _stuffColors: Map<number, number> = new Map<number, number>();

    constructor(
        private _catalogService: CatalogService,
        private _ngZone: NgZone
    )
    {
        _catalogService.giftConfiguratorComponent = this;

        const configuration = this._catalogService.giftWrapperConfiguration;
        const defaultStuffTypes = configuration.defaultStuffTypes;

        if(defaultStuffTypes.length > 0)
        {
            const randomIndex = Math.floor((Math.random() * defaultStuffTypes.length));
            this._defaultStuffType = defaultStuffTypes[randomIndex];
        }

        this._stuffTypes = configuration.stuffTypes;
        this._boxTypes = configuration.boxTypes;
        this._boxTypes.push(this._defaultStuffType);
        this._ribbonTypes = configuration.ribbonTypes;
        this._boxPrice = configuration.price;
        this._selectedTypeId = this._stuffTypes[2];
        this._ribbonIndex = this._ribbonTypes[0];
        this._boxIndex = 0;

        this.updateIndexesAndSetUI();
        this.loadColors();
    }

    public get colors(): number[]
    {
        return this._stuffTypes;
    }


    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'previous_box':
                this._boxIndex--;
                this.updateIndexesAndSetUI();
                break;
            case 'next_box':
                this._boxIndex++;
                this.updateIndexesAndSetUI();
                break;
            case 'previous_ribbon':
                this._ribbonIndex--;
                this.updateIndexesAndSetUI();
                break;
            case 'next_ribbon':
                this._ribbonIndex++;
                this.updateIndexesAndSetUI();
                break;
            case 'give_gift':
                this.giveGift();
                break;
        }
    }

    public changeCheckbox(event: InputEvent): void
    {
        this.updateIndexesAndSetUI();
    }

    public get isDefaultBox(): boolean
    {
        return this._isDefaultBox();
    }

    public hide(): void
    {
        this._catalogService.component && this._catalogService.component.hidePurchaseConfirmation();
    }

    public getColor(stuffType: number): string
    {
        const color = this._stuffColors.get(stuffType).toString(16);
        return `#${color}`;
    }

    public typeHasColors(stuffType: number): boolean
    {
        return this._stuffColors.has(stuffType);
    }

    public selectTypeId(stuffType: number): void
    {
        this._selectedTypeId = stuffType;
        this.updateIndexesAndSetUI();
    }

    public hideUsernameDialog(): void
    {
        this.showUsernameErrorDialog = false;
    }
    public showUsernameNotFoundDialog(): void
    {
        this._ngZone.run(() => this.showUsernameErrorDialog = true);
    }

    private loadColors(): void
    {
        for(const stuffType of this._stuffTypes)
        {
            const giftData = Nitro.instance.sessionDataManager.getFloorItemData(stuffType);

            if(!giftData) continue;

            if(giftData.colors && giftData.colors.length >0)
            {
                this._stuffColors.set(stuffType, giftData.colors[0]);
            }
        }
    }

    // see _Str_3190
    private updateIndexesAndSetUI(): void
    {
        if(this._ribbonIndex < 0)
        {
            this._ribbonIndex = (this._ribbonTypes.length - 1);
        }

        if(this._ribbonIndex > (this._ribbonTypes.length - 1))
        {
            this._ribbonIndex = 0;
        }

        if(this._boxIndex < 0)
        {
            this._boxIndex = (this._boxTypes.length - 1);
        }

        if(this._boxIndex > (this._boxTypes.length - 1))
        {
            this._boxIndex = 0;
        }

        const currentBoxType = this._boxTypes[this._boxIndex];
        if(currentBoxType == 8)
        {
            // see _Str_13980
            this._ribbonIndex = 10;

            if(this._ribbonIndex > (this._ribbonTypes.length - 1))
            {
                this._ribbonIndex = 0;
            }
        }

        let extras = ((currentBoxType * 1000) + this._ribbonTypes[this._ribbonIndex]).toString();
        let boxSpriteId = this._selectedTypeId;
        const isDefaultBox = this._isDefaultBox();
        if(isDefaultBox)
        {
            this.setHasColors(false);
            boxSpriteId = this._defaultStuffType;
            extras = '';
        }
        else
        {
            if(currentBoxType == 8)
            {
                this.setHasColors(false);
            }
            else
            {
                this.setHasColors(true);
                if(currentBoxType >= 3 && currentBoxType <=6)
                {
                    this.setHasColors(false);
                }
            }
        }

        this.extras = extras;
        this.boxSpriteId = boxSpriteId;
        this.setBoxTitles();

        this.habboFace = Nitro.instance.sessionDataManager.figure;
    }

    private setHasColors(k:boolean):void
    {
        this.hasColors = k;
    }

    private setBoxTitles(): void
    {
        const k = this._isDefaultBox();

        const boxKey = k ? 'catalog.gift_wrapping_new.box.default' : ('catalog.gift_wrapping_new.box.' + this._boxTypes[this._boxIndex]);
        const priceKey = k ? 'catalog.gift_wrapping_new.freeprice' : 'catalog.gift_wrapping_new.price';
        const ribbonKey = 'catalog.gift_wrapping_new.ribbon.' + this._ribbonIndex;

        this.boxText = Nitro.instance.localization.getValue(boxKey);
        this.priceText = Nitro.instance.localization.getValueWithParameter(priceKey, 'price', this._boxPrice.toString());
        this.ribbonText = Nitro.instance.localization.getValue(ribbonKey);

    }

    private giveGift(): void
    {
        if(!this.receiverName || this.receiverName.trim().length == 0) return;

        const receiverName = this.receiverName;
        const giftMessage = this.message;
        const isDefaultBox = this._isDefaultBox();
        const spriteId = isDefaultBox ? this._defaultStuffType : this._selectedTypeId;
        const color = isDefaultBox ? 0 : this._boxTypes[this._boxIndex];
        const ribbonId = isDefaultBox ? 0 : this._ribbonTypes[this._ribbonIndex];
        const anonymousGift = this.showFace;

        const activeOffer = this._catalogService.component.activeOffer;
        const activePage = this._catalogService.component.activePage;
        const extraData = this._catalogService.component.purchaseOfferExtra;

        this._catalogService.purchaseGiftOffer(activePage,activeOffer, extraData, receiverName, giftMessage, spriteId, color, ribbonId, anonymousGift);
    }

    // see _Str_18066
    private _isDefaultBox(): boolean
    {
        return this._boxTypes[this._boxIndex] == this._defaultStuffType;
    }

    ngOnDestroy(): void
    {
        this._catalogService.giftConfiguratorComponent = null;
    }

}
