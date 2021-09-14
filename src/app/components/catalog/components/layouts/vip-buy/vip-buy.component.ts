import { Component, NgZone } from '@angular/core';
import { CatalogClubOfferData, Nitro } from '@nitrots/nitro-renderer';
import { CatalogLayout } from '../../../CatalogLayout';
import { CatalogService } from '../../../services/catalog.service';
import { MarketplaceService } from '../../../services/marketplace.service';


@Component({
    templateUrl: './vip-buy.template.html'
})
export class CatalogLayoutVipBuyComponent extends CatalogLayout
{
    public static CODE: string = 'vip_buy';
    public vipOffers: CatalogClubOfferData[] = [];
    constructor(
        protected _catalogService: CatalogService,
        protected _marketService: MarketplaceService,
        protected _ngZone: NgZone)
    {
        super(_catalogService, _marketService, _ngZone);
        _catalogService.registerVipBuyTemplate(this);

        _catalogService.requestOffers(6);
    }

    public setOffers(offers: CatalogClubOfferData[]): void
    {
        this._ngZone.run(() =>
        {
            this.vipOffers = offers.reverse();
        });

    }

    public getPurseContent(): string
    {
        const purse = this._catalogService.purse;

        const clubDays = purse.clubDays;

        const clubPeriods = purse.clubPeriods;

        const value = (clubPeriods * 31) + clubDays;
        // TODO: Register this in the localization
        return Nitro.instance.localization.getValueWithParameter('catalog.vip.extend.info', 'days', value.toString());
    }

    public buyVip(offer: CatalogClubOfferData): void
    {
        this._catalogService.component && this._catalogService.component.confirmVipSubscription(offer);
    }

    public getOfferText(offer: CatalogClubOfferData)
    {
        if(offer.months > 0)
        {
            return Nitro.instance.getLocalizationWithParameter('catalog.vip.item.header.months', 'num_months', offer.months.toString());
        }

        return Nitro.instance.getLocalizationWithParameter('catalog.vip.item.header.days', 'num_days', offer.extraDays.toString());

    }
}
