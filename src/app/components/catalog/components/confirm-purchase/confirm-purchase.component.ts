import { Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CatalogPageOfferData, CatalogPageParser, Nitro, NitroToolbarAnimateIconEvent, TextureUtils, ToolbarIconEnum } from '@nitrots/nitro-renderer';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: 'nitro-catalog-confirm-purchase-component',
    templateUrl: './confirm-purchase.template.html'
})
export class CatalogConfirmPurchaseComponent implements OnChanges
{
    @Input()
    public page: CatalogPageParser = null;

    @Input()
    public offer: CatalogPageOfferData = null;

    @Input()
    public giftOffer: CatalogPageOfferData = null;

    @Input()
    public quantity: number = 1;

    @Input()
    public extra: string = null;

    @Input()
    public completed: boolean = false;

    @ViewChild('imageElement')
    public imageElement: ElementRef<HTMLDivElement>;

    private _imageUrl: string = '';

    constructor(
        private _catalogService: CatalogService,
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
        (this._catalogService.component && this._catalogService.component.hidePurchaseConfirmation());
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

            const roomPreviewer = (this._catalogService.component && this._catalogService.component.roomPreviewer);

            if(!roomPreviewer) return;

            const object = roomPreviewer.getRoomPreviewObject();

            if(object)
            {
                const texture   = object.visualization.getImage(0xFF0000, -1);
                const element   = TextureUtils.generateImage(texture);

                if(element)
                {
                    this._imageUrl = element.src;
                }
            }
        });
    }

    public purchase(): void
    {
        if(!this.giftOffer)
        {
            this._catalogService.purchase(this.page, this.offer, this.quantity, this.extra);
        }
        else
        {
            this._catalogService.component && this._catalogService.component.makeGiftConfiguratorVisible();
        }
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

    public get costCredits(): number
    {
        return (this.offer.priceCredits * this.quantity);
    }

    public get costPoints(): number
    {
        return (this.offer.priceActivityPoints * this.quantity);
    }

    public get pointsType(): number
    {
        return this.offer.priceActivityPointsType;
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }

    public getOfferTitle(): string
    {
        const localization = this.offer.localizationId;

        const productData = Nitro.instance.sessionDataManager.getProductData(localization);
        if(productData) return productData.name;

        return localization;

    }


}
