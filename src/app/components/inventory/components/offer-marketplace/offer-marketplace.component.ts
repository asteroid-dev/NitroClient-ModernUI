import { Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IGetImageListener, ImageResult, MarketplaceSellItemComposer, Nitro, NitroRenderTexture, NitroToolbarAnimateIconEvent, TextureUtils, ToolbarIconEnum, Vector3d } from '@nitrots/nitro-renderer';
import { CatalogService } from '../../../catalog/services/catalog.service';
import { FurnitureItem } from '../../items/FurnitureItem';
import { InventoryFurnitureService } from '../../services/furniture.service';
import { InventoryService } from '../../services/inventory.service';


@Component({
    selector: '[nitro-inventory-offer-marketplace-component]',
    templateUrl: './offer-marketplace.template.html'
})
export class OfferMarketplaceComponent implements OnChanges, IGetImageListener
{
    @Input()
    public item: FurnitureItem;

    @Input()
    public showMainWindow: boolean = false;

    @ViewChild('imageElement')
    public imageElement: ElementRef<HTMLDivElement>;

    public askingPrice: number = null;

    public showConfirmDialog: boolean = false;

    private _imageUrl: string = '';

    constructor(
        private _catalogService: CatalogService,
        private _inventoryFurniService: InventoryFurnitureService,
        private _inventoryService: InventoryService,
        private _ngZone: NgZone
    )
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        if(!changes.item) return;

        const prev = changes.item.previousValue;
        const next = changes.item.currentValue;

        if(next && (prev !== next)) this.refresh();
    }

    public hide(): void
    {
        this.closeMainWindow();
    }

    public refresh(): void
    {
        this.updateInterface(null);
        this.refreshImage();
    }

    private refreshImage(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._imageUrl = '';

            const item = this.item;

            let object: ImageResult;

            if(!this.item.isWallItem)
            {
                object = Nitro.instance.roomEngine.getFurnitureFloorImage(item.type, new Vector3d(90,0,0), 64, this, 4293848814, this.item.extra.toString());
            }
            else
            {
                object = Nitro.instance.roomEngine.getFurnitureWallImage(item.type, new Vector3d(90,0,0), 64, this, 4293848814, this.item.extra.toString());
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


    public get imageUrl(): string
    {
        return this._imageUrl;
    }

    public getFurniTitle(): string
    {
        const item = this.item;

        const localizationKey = item.isWallItem ? 'wallItem.name.' + item.type : 'roomItem.name.' + item.type;

        return Nitro.instance.localization.getValue(localizationKey);
    }

    public getFurniDescription(): string
    {
        const item = this.item;

        const localizationKey = item.isWallItem ? 'wallItem.desc.' + item.type : 'roomItem.desc.' + item.type;

        return Nitro.instance.localization.getValue(localizationKey);
    }

    public confirmationText(): string
    {
        const item = this.item;

        const furniKey = item.isWallItem ? 'wallItem.name.' + item.type : 'roomItem.name.' + item.type;
        const furniName = Nitro.instance.localization.getValue(furniKey);
        const text = Nitro.instance.localization.getValueWithParameters('inventory.marketplace.confirm_offer.info', [
            'furniname',
            'price'
        ],
        [
            furniName,
            this.askingPrice.toString()
        ]);
        return text;
    }

    public getAveragePrice(): string
    {
        let text =  Nitro.instance.localization.getValue('inventory.marketplace.make_offer.average_price');
        const commission = this._inventoryFurniService.marketPlaceConfig.commission;

        const days = this._inventoryFurniService.marketPlaceConfig.displayTime;
        text = text.replace('%days%', days.toString());


        const price = this._inventoryFurniService.marketPlaceItemStats.averagePrice;
        const priceText = price == 0 ? ' - ' : price.toString();

        text = text.replace('%price%', priceText);

        const noCommission = Math.floor((this._inventoryFurniService.marketPlaceItemStats.averagePrice / (1 + (commission * 0.01))));
        const commissionText = noCommission == 0 ? ' - ' : noCommission.toString();

        text = text.replace('%price_no_commission%', commissionText);

        const average = this._inventoryFurniService.marketPlaceItemStats.averagePrice;
        const averageText = average == 0 ? ' - ' : average.toString();

        text = text.replace('%average%', averageText);
        return text;
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


    private _text: string = null;
    public canPostItem: boolean = false;


    public updateInterface(event): void
    {
        const stats = this._inventoryFurniService.marketPlaceItemStats;
        const config = this._inventoryFurniService.marketPlaceConfig;
        let price  = event ? parseInt(event.target.value) : this.askingPrice ?? 0;

        const maxPrice = 100000;
        // const maxPrice = config.maximumPrice;

        if(price > maxPrice)
        {
            this.askingPrice = maxPrice;
            price = maxPrice;
            if(event) event.target.value = maxPrice;
        }

        const _local_3:number = Math.max(Math.ceil(((config.commission * 0.01) * price)), 1);
        const _local_4:number= (price + _local_3);



        if(price < config.minimumPrice)
        {
            this.canPostItem = false;
            this._text = Nitro.instance.localization.getValueWithParameter('inventory.marketplace.make_offer.min_price', 'minprice', config.minimumPrice.toString());
        }
        else
        {
            this.canPostItem = true;
            let text = Nitro.instance.localization.getValue('inventory.marketplace.make_offer.final_price');
            text = text.replace('%commission%', _local_3.toString());
            text = text.replace('%finalprice%', _local_4.toString());
            this._text = text;
        }


        const text = Nitro.instance.localization.getValue('inventory.marketplace.make_offer.min_price');


    }

    private closeMainWindow(): void
    {
        this.askingPrice = null;
        this.updateInterface(null);
        this._inventoryService.marketPlaceOfferVisible = false;
        this._inventoryFurniService.marketPlaceItemStats = null;
    }

    public creditsPrice(): string
    {
        return this._text;
    }

    public imageFailed(id: number): void
    {
        return;
    }

    public postOffer(): void
    {
        this._inventoryService.marketPlaceOfferVisible = false;
        this.showConfirmDialog = true;
    }

    public doPostOffer(): void
    {
        const local2 = this.item.isWallItem ? 2 : 1;
        Nitro.instance.communication.connection.send(new MarketplaceSellItemComposer(this.askingPrice, local2, this.item.ref));
        this.showConfirmDialog = false;
        this.closeMainWindow();
    }

    public closeConfirmDialog(): void
    {
        this.showConfirmDialog = false;
    }

    public get offerTime(): number
    {
        return this._inventoryFurniService.marketPlaceConfig.offerTime;
    }
}
