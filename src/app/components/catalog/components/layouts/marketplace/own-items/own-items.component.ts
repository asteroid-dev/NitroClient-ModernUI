import { Component, OnInit } from '@angular/core';
import { MarketplaceOfferData, MarketplaceRequestOwnItemsComposer, Nitro } from '@nitrots/nitro-renderer';
import { CatalogLayout } from '../../../../CatalogLayout';
import { MarketplaceService } from '../../../../services/marketplace.service';


@Component({
    templateUrl: './own-items.template.html'
})
export class CatalogLayoutMarketplaceOwnItemsComponent extends CatalogLayout implements OnInit
{
    public static CODE: string = 'marketplace_own_items';

    public redeemButtonActive: boolean = false;

    public ngOnInit(): void
    {
        Nitro.instance.communication.connection.send(new MarketplaceRequestOwnItemsComposer());
    }

    public get statusText(): string
    {
        const offers = this._marketService.lastOwnOffers;

        const defaultTranslation = Nitro.instance.localization.getValue('catalog.marketplace.no_items');

        if(!offers || offers.length === 0) return defaultTranslation;

        return Nitro.instance.localization.getValueWithParameter('catalog.marketplace.items_found', 'count', offers.length.toString());
    }


    public get topText(): string
    {
        const offers = this._marketService.lastOwnOffers;

        const defaultTranslation = Nitro.instance.localization.getValue('catalog.marketplace.redeem.no_sold_items');

        if(!offers || offers.length === 0) return defaultTranslation;


        let offersOnMarketplace = 0;

        for(const offer of offers.getValues())
        {
            if(offer.status == MarketplaceService._Str_8295)
            {
                offersOnMarketplace++;
            }
        }

        if(offersOnMarketplace > 0)
        {
            const credits = this._marketService.creditsWaiting;
            this.redeemButtonActive = true;

            return Nitro.instance.localization.getValueWithParameters('catalog.marketplace.redeem.get_credits',
                [
                    'count',
                    'credits'
                ],
                [
                    offersOnMarketplace.toString(),
                    credits.toString()
                ]);
        }
        return defaultTranslation;
    }

    public imageUrlOffer(offer: MarketplaceOfferData): string
    {
        if(!offer) return '';

        switch(offer.furniType)
        {
            case 1:
                return Nitro.instance.roomEngine.getFurnitureFloorIconUrl(offer.furniId);
            case 2:
                return Nitro.instance.roomEngine.getFurnitureWallIconUrl(offer.furniId, offer.extraData);
        }

        return '';
    }

    public getMarketplaceOfferTitle(offer: MarketplaceOfferData): string
    {
        if(!offer) return '';

        const localizationKey = offer.furniType == 2  ? 'wallItem.name.' + offer.furniId: 'roomItem.name.' + offer.furniId;

        return Nitro.instance.localization.getValue(localizationKey);
    }

    public getMarketplaceOfferDescription(offer: MarketplaceOfferData): string
    {
        if(!offer) return '';

        const localizationKey =  offer.furniType == 2 ? 'wallItem.desc.' + offer.furniId : 'roomItem.desc.' + offer.furniId;

        return Nitro.instance.localization.getValue(localizationKey);
    }

    public getMarketplacePrice(offer: MarketplaceOfferData): string
    {
        if(!offer) return '';

        return Nitro.instance.localization.getValueWithParameter('catalog.marketplace.offer.price_own_item', 'price', offer.price.toString());
    }

    public offerIsOnGoing(offer: MarketplaceOfferData): boolean
    {
        if(!offer) return false;

        return offer.status === MarketplaceService._Str_15376;
    }

    public offerIsSold(offer: MarketplaceOfferData): boolean
    {
        if(!offer) return false;

        return offer.status === MarketplaceService._Str_8295;
    }

    public offerIsExpired(offer: MarketplaceOfferData): boolean
    {
        if(!offer) return false;

        return offer.status === MarketplaceService._Str_6495;
    }

    public canTakeBack(offer: MarketplaceOfferData): boolean
    {
        if(!offer) return false;

        const isSold = this.offerIsSold(offer);
        const isExpired = this.offerIsExpired(offer);

        return !isSold || isExpired;
    }

    public offerExpiredText(offer: MarketplaceOfferData): string
    {
        if(!offer) return '';

        return Nitro.instance.localization.getValue('catalog.marketplace.offer.expired');
    }

    public takeBack(offer: MarketplaceOfferData): void
    {
        if(!offer) return;

        this._marketService.redeemExpiredMarketPlaceOffer(offer.offerId);
    }

    public offerSoldText(offer: MarketplaceOfferData): string
    {
        if(!offer) return '';

        return Nitro.instance.localization.getValue('catalog.marketplace.offer.sold');
    }

    public offerTime(offer: MarketplaceOfferData): string
    {
        if(!offer) return '';

        const time = Math.max(1, offer.timeLeftMinutes);
        const hours = Math.floor(time / 60);
        const minutes =  time - (hours * 60);

        let text = minutes + ' ' + Nitro.instance.localization.getValue('catalog.marketplace.offer.minutes');
        if(hours > 0)
        {
            text = hours + ' ' + Nitro.instance.localization.getValue('catalog.marketplace.offer.hours') + ' ' + text;
        }

        return Nitro.instance.localization.getValueWithParameter('catalog.marketplace.offer.time_left', 'time', text);
    }

    public redeemCredits(): void
    {
        this.redeemButtonActive = false;
        this._marketService.redeemCredits();
    }

    public get hasOwnOffersOnMarketplace(): boolean
    {
        return !(!this._marketService.lastOwnOffers || this._marketService.lastOwnOffers.length === 0);
    }

    public get ownOffers(): MarketplaceOfferData[]
    {
        return this._marketService.lastOwnOffers.getValues();
    }


}
