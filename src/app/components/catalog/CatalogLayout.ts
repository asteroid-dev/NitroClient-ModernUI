import { Directive, NgZone } from '@angular/core';
import { CatalogPageOfferData, CatalogProductOfferData, FurnitureType, ICatalogPageParser, IFurnitureData, Nitro, RoomPreviewer } from '@nitrots/nitro-renderer';
import { CatalogService } from './services/catalog.service';
import { MarketplaceService } from './services/marketplace.service';

@Directive()
export class CatalogLayout
{
    public activePage: ICatalogPageParser = null;
    public roomPreviewerVisible: boolean = true;

    constructor(protected _catalogService: CatalogService,
        protected _marketService: MarketplaceService,
        protected _ngZone: NgZone)
    {
    }

    public getText(index: number = 0): string
    {
        let message = (this.activePage.localization.texts[index] || '');

        if(message && message.length) message = message.replace(/\r\n|\r|\n/g, '<br />');

        return (message || '');
    }

    public getImage(index: number = 0): string
    {
        const imageName = this.activePage.localization.images && this.activePage.localization.images[index];

        if(!imageName || !imageName.length) return null;

        let assetUrl = Nitro.instance.getConfiguration<string>('catalog.asset.image.url');

        assetUrl = assetUrl.replace('%name%', imageName);

        return assetUrl;
    }

    public getCurrencyUrl(type: number): string
    {
        const url = Nitro.instance.getConfiguration<string>('currency.asset.icon.url');

        return url.replace('%type%', type.toString());
    }

    public getProductFurniData(product: CatalogProductOfferData): IFurnitureData
    {
        if(!product) return null;

        return this._catalogService.getFurnitureDataForProductOffer(product);
    }

    public offerImage(offer: CatalogPageOfferData): string
    {
        if(!offer) return '';

        const product = offer.products[0];

        if(!product) return '';

        const productType = product.productType.toUpperCase();

        switch(productType)
        {
            case FurnitureType.BADGE:
                return Nitro.instance.sessionDataManager.getBadgeUrl(product.extraParam);
            case FurnitureType.FLOOR:
                return Nitro.instance.roomEngine.getFurnitureFloorIconUrl(product.furniClassId);
            case FurnitureType.WALL:
                return Nitro.instance.roomEngine.getFurnitureWallIconUrl(product.furniClassId, product.extraParam);
        }

        return '';
    }

    public hasMultipleProducts(offer: CatalogPageOfferData): boolean
    {
        return (offer.products.length > 1);
    }

    public offerName(offer: CatalogPageOfferData): string
    {
        const productData = this._catalogService.getProductDataForLocalization(offer.localizationId);

        if(productData) return productData.name;

        return offer.localizationId;
    }

    public getFirstProduct(offer: CatalogPageOfferData): CatalogProductOfferData
    {
        return ((offer && offer.products[0]) || null);
    }

    protected get headerText(): string
    {
        return (this._catalogService.catalogRoot.localization || null);
    }

    public get offers(): CatalogPageOfferData[]
    {
        return this._catalogService.activePage.offers;
    }

    public get activeOffer(): CatalogPageOfferData
    {
        return ((this._catalogService.component && this._catalogService.component.activeOffer) || null);
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return ((this._catalogService.component && this._catalogService.component.roomPreviewer) || null);
    }
}
