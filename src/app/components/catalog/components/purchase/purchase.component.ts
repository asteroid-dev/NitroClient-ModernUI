import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CatalogPageOfferData, ICatalogPageParser } from '@nitrots/nitro-renderer';
import * as $ from "jquery";
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: '[nitro-catalog-purchase-component]',
    templateUrl: './purchase.template.html'
})
export class CatalogPurchaseComponent implements OnChanges
{
    @Input()
    public activePage: ICatalogPageParser = null;

    @Input()
    public activeOffer: CatalogPageOfferData = null;

    @Input()
    public quantityEnabled: boolean = false;

    @Input()
    public vertical: boolean = false;

    public quantity: number = 1;

    @Input()
    public forcedExtra: string = null;

    constructor(private _catalogService: CatalogService)
    {}

    public ngOnInit(): void
    {
        $('.mctlg-close2').click(function ()
        {
            $('.magaza-mobi-satin-box').css({'display': 'none' });
        });
        
        $('.onizlemeac').click(function ()
        {
            $('.magaza-mobi-satin-box').css({'display': 'block' });
        });
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        if(!changes.activeOffer) return;

        const prev = changes.activeOffer.previousValue;
        const next = changes.activeOffer.currentValue;

        if(next && (next !== prev)) this.resetOffer();
    }

    private resetOffer(): void
    {
        this.quantity = 1;
    }

    public purchase(asGift: boolean = false): void
    {
        this._catalogService.component && this._catalogService.component.confirmPurchase(this.activePage, this.activeOffer, this.quantity, this.extra, asGift);
    }

    public increase(): void
    {
        if(this.quantity >= this.maxQuantity) return;

        this.quantity++;
    }

    public decrease(): void
    {
        this.quantity--;

        if(this.quantity < 1) this.quantity = 1;
    }

    public get costCredits(): number
    {
        return (this.activeOffer.priceCredits * this.quantity);
    }

    public get costPoints(): number
    {
        return (this.activeOffer.priceActivityPoints * this.quantity);
    }

    public get pointsType(): number
    {
        return this.activeOffer.priceActivityPointsType;
    }

    public get extra(): string
    {
        if(this.forcedExtra) return this.forcedExtra;

        return (this.activeOffer.products[0] && this.activeOffer.products[0].extraParam);
    }

    public get maxQuantity(): number
    {
        return 99;
    }

    public get isGiftable(): boolean
    {
        return this.activeOffer.giftable;
    }
}
