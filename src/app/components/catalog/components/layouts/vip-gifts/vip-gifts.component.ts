import { Component } from '@angular/core';
import { CatalogClubOfferData, CatalogPageOfferData, CatalogSelectClubGiftComposer, Nitro, Vector3d } from '@nitrots/nitro-renderer';
import { CatalogLayout } from '../../../CatalogLayout';


@Component({
    templateUrl: './vip-gifts.template.html'
})
export class CatalogLayoutVipGiftsComponent extends CatalogLayout
{
    public static CODE: string = 'club_gifts';
    public showPopup: boolean = false;

    public vipOffers: CatalogClubOfferData[] = [];
    private _currentSelectedVipOffer: CatalogPageOfferData = null;

    public get visible(): boolean
    {
        return this._catalogService.clubGiftsParser !== null;
    }

    public hidePopup(): void
    {
        this.showPopup = false;
    }

    public getAvailability(offerId: number): boolean
    {
        const test = this._catalogService.clubGiftsParser.getOfferExtraData(offerId);

        return test.isSelectable && this._catalogService.clubGiftsParser.giftsAvailable > 0;
    }

    public get gifts(): CatalogPageOfferData[]
    {
        if(!this.visible) return [];

        return this._catalogService.clubGiftsParser.offers;
    }

    public get direction(): Vector3d
    {
        return new Vector3d(90);
    }

    public selectOffer(item :CatalogPageOfferData): void
    {
        this._currentSelectedVipOffer = item;
        this.showPopup = true;
    }

    public getGiftImage(): string
    {
        return this.offerImage(this._currentSelectedVipOffer);
    }

    public giftName(): string
    {
        return this.getProductFurniData(this._currentSelectedVipOffer.products[0]).name;
    }

    public confirmGift(): void
    {
        Nitro.instance.communication.connection.send(new CatalogSelectClubGiftComposer(this._currentSelectedVipOffer.localizationId));
        this._catalogService.clubGiftsParser.giftsAvailable--;
        this.showPopup = false;
    }
    public get pastClubDays(): string
    {
        const pastClubDays = this._catalogService.purse.pastClubDays;
        const month = 31;

        const textSelector = (pastClubDays > month) ? 'catalog.club_gift.past_club.long': 'catalog.club_gift.past_club';
        const days = Math.floor(pastClubDays % month);
        const months = Math.floor(pastClubDays / month);

        let text = Nitro.instance.localization.getValue(textSelector);
        text = text.replace('%days%', days.toString());
        text = text.replace('%months%', months.toString());
        return text;
    }

    public nonAvailableText(offerId: number): string
    {
        const test = this._catalogService.clubGiftsParser.getOfferExtraData(offerId);

        const giftAvailableInDays =  test.daysRequired - this._catalogService.purse.pastClubDays;

        if(giftAvailableInDays <= 0) return '';

        const monthDays = 31;

        let textSelector = '';

        if(test.isVip)
        {
            textSelector = 'catalog.club_gift.vip_missing';
        }
        else
        {
            textSelector = 'catalog.club_gift.club_missing';
        }

        if(giftAvailableInDays > monthDays)
        {
            textSelector += '.long';
        }

        const days = giftAvailableInDays % monthDays;
        const months = giftAvailableInDays / monthDays;

        let text = Nitro.instance.localization.getValue(textSelector);

        text = text.replace('%days%', days.toString());
        text = text.replace('%months%', months.toString());

        return text;
    }


    public get giftsAvailable(): string
    {
        if(!this.visible) return '';

        const parser = this._catalogService.clubGiftsParser;

        if(parser.giftsAvailable > 0)
        {
            return Nitro.instance.localization.getValueWithParameter('catalog.club_gift.available', 'amount', parser.giftsAvailable.toString());
        }

        if(parser.daysUntilNextGift > 0)
        {
            return Nitro.instance.localization.getValueWithParameter('catalog.club_gift.days_until_next', 'days', parser.daysUntilNextGift.toString());
        }

        if(this._catalogService.hasClubDays())
        {
            return Nitro.instance.localization.getValue('catalog.club_gift.not_available');
        }

        return Nitro.instance.localization.getValue('catalog.club_gift.no_club');

    }

}
