import { Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IGetImageListener, ImageResult, MarketplaceOffer, Nitro, NitroRenderTexture, NitroToolbarAnimateIconEvent, TextureUtils, ToolbarIconEnum, Vector3d } from '@nitrots/nitro-renderer';
import { InventoryFurnitureService } from '../../../inventory/services/furniture.service';
import { CatalogService } from '../../services/catalog.service';
import { MarketplaceService } from '../../services/marketplace.service';

@Component({
    selector: 'nitro-catalog-confirm-marketplace-purchase-component',
    templateUrl: './confirm-marketplace-purchase.template.html'
})
export class CatalogConfirmMarketplacePurchaseComponent implements OnChanges, IGetImageListener
{

    @ViewChild('imageElement')
    public imageElement: ElementRef<HTMLDivElement>;

    @Input()
    public offer: MarketplaceOffer;

    private _imageUrl: string = '';

    constructor(
        private _catalogService: CatalogService,
        private _marketplaceService: MarketplaceService,
        private _inventoryFurniService: InventoryFurnitureService,
        private _ngZone: NgZone
    )
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.offer.previousValue;
        const next = changes.offer.currentValue;

        if(next && (prev !== next)) this.refresh();
    }

    public hide(): void
    {
        this._marketplaceService.buyOffer(null);
    }

    public refresh(): void
    {
        this.refreshImage();
    }

    private refreshImage(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._imageUrl = '';

            const item = this.offer;

            let object: ImageResult;

            if(this.offer.furniType === 1)
            {
                object = Nitro.instance.roomEngine.getFurnitureFloorImage(item.furniId, new Vector3d(90,0,0), 64, this, 4293848814, this.offer.extraData?.toString());
            }
            else
            {
                object = Nitro.instance.roomEngine.getFurnitureWallImage(item.furniType, new Vector3d(90,0,0), 64, this, 4293848814, this.offer.extraData?.toString());
            }

            if(object)
            {
                const image = object.getImage();

                if(image) this._ngZone.run(() => (this._imageUrl = image.src));
            }
        });
    }

    public purchase(): void
    {

    }

    private completePurchase(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            const element = new HTMLImageElement();

            element.className           = 'toolbar-icon-animation';
            element.src                 = this._imageUrl;
            element.style.visibility    = 'hidden';

            if(this.imageElement)
            {
                this.imageElement.nativeElement.appendChild(element);
            }

            const bounds = element.getBoundingClientRect();

            const event = new NitroToolbarAnimateIconEvent(element, bounds.x, bounds.y);

            event.iconName = ToolbarIconEnum.INVENTORY;

            Nitro.instance.roomEngine.events.dispatchEvent(event);
        });
    }

    public imageReady(id: number, texture: NitroRenderTexture, image: HTMLImageElement): void
    {
        if(!texture) return;

        if(image)
        {
            this._ngZone.run(() => (this._imageUrl = image.src));

            return;
        }

        if(texture)
        {
            const imageUrl = TextureUtils.generateImageUrl(texture);

            if(imageUrl) this._ngZone.run(() => (this._imageUrl = imageUrl));
        }
    }

    public get costCredits(): number
    {
        return this.offer.price;
    }

    public imageFailed(id: number): void
    {
        return;
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }


    public getFurniTitle(): string
    {
        const item = this.offer;

        const localizationKey = item.furniType == 2 ? 'wallItem.name.' + item.furniId : 'roomItem.name.' + item.furniId;

        return Nitro.instance.localization.getValue(localizationKey);
    }

    public getFurniDescription(): string
    {
        const item = this.offer;

        const localizationKey = item.furniType == 2 ? 'wallItem.desc.' + item.furniId : 'roomItem.desc.' + item.furniId;

        return Nitro.instance.localization.getValue(localizationKey);
    }

    public getAveragePrice(): string
    {
        let text = Nitro.instance.localization.getValue('catalog.marketplace.offer_details.average_price');

        const average = this.offer.averagePrice == 0 ? ' - ' : this.offer.averagePrice.toString();

        text = text.replace('%days%', this._inventoryFurniService.marketPlaceConfig.displayTime.toString());
        text = text.replace('%average%', average);

        return text;
    }

    public getOfferCount(): string
    {
        return Nitro.instance.localization.getValueWithParameter('catalog.marketplace.offer_details.offer_count', 'count', this.offer.offerCount.toString());
    }

    public buy(): void
    {
        this._marketplaceService.buyMarketplaceOffer(this.offer.offerId);
    }


}
