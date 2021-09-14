import { Component, OnInit } from '@angular/core';
import { AdvancedMap, CatalogPageOfferData, CatalogProductOfferData, IGetImageListener, Nitro, NitroRenderTexture, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { CatalogLayout } from '../../../CatalogLayout';


@Component({
    templateUrl: './trophies.template.html'
})
export class CatalogLayoutTrophiesComponent extends CatalogLayout implements OnInit, IGetImageListener
{
    public static CODE: string = 'trophies';

    public textPages: string[]                            = [];

    private _allTrophyOffers                               = new AdvancedMap<string, AdvancedMap<string, CatalogPageOfferData>>();
    public currentTrophyOffer: CatalogPageOfferData        = null;

    private _imageUrl: string                           = null;

    private _currentTrophy: CatalogProductOfferData        = null;
    private _availableColorsForCurrentTrophy: string[] = null;
    private _currentTrophyIndex: number                       = 0;
    private readonly _orderOfColors = ['g','s','b'];
    public enteredText: string = '';
    private _currentTrophyColor: string;


    public ngOnInit(): void
    {
        const offers = this.activePage.offers;

        this.textPages = this.activePage.localization.texts.filter(item => item && item.length > 0);


        if(offers && offers.length)
        {
            for(const offer of offers)
            {
                if(!offer) continue;

                const local4 = this.getTrophyNameWithoutColors(offer.localizationId);
                const trophyColorCharacter = this.getTrophyColorCharacter(offer.localizationId);

                let existing = this._allTrophyOffers.getValue(local4);

                if(!existing)
                {
                    existing = new AdvancedMap();

                    this._allTrophyOffers.add(local4, existing);
                }

                existing.add(trophyColorCharacter, offer);
            }
        }

        this.selectOfferByIndex(this._currentTrophyIndex);

    }

    private selectOfferByIndex(index: number): void
    {
        const firstOffer    = this._allTrophyOffers.getWithIndex(this._currentTrophyIndex);
        if(firstOffer) this.selectOffer(firstOffer);
    }

    private selectOffer(availaleOffers: AdvancedMap<string, CatalogPageOfferData>): void
    {
        if(!availaleOffers) return;

        let firstAvailableTrophyColor:CatalogPageOfferData = null;
        const availableColorsForTrophy:string[] = [];
        this._orderOfColors.map((color) =>
        {
            const colorIsAvailableForTrophy = availaleOffers.getValue(color);
            if(colorIsAvailableForTrophy)
            {
                availableColorsForTrophy.push(color);
            }
            if(!firstAvailableTrophyColor)
            {
                firstAvailableTrophyColor = colorIsAvailableForTrophy;
            }
        });

        if(!firstAvailableTrophyColor) firstAvailableTrophyColor = availaleOffers.getWithIndex(0); // Some trophies don't have a color. We want to show then either way.

        if(firstAvailableTrophyColor) this._currentTrophyColor = this.getTrophyColorCharacter(firstAvailableTrophyColor.localizationId);
        this._availableColorsForCurrentTrophy = availableColorsForTrophy;
        this.selectTrophyColor(firstAvailableTrophyColor);
    }


    private selectTrophyColor(firstAvailableTrophyColor: CatalogPageOfferData)
    {
        if(!firstAvailableTrophyColor) return;

        this.currentTrophyOffer = firstAvailableTrophyColor;

        const product = firstAvailableTrophyColor.products[0];

        if(!product) return;

        const imageResult = Nitro.instance.roomEngine.getFurnitureFloorImage(product.furniClassId, new Vector3d(2, 0, 0), 64, this, 0, product.extraParam);

        if(imageResult)
        {
            const image = imageResult.getImage();

            if(image) this._imageUrl = image.src;
        }

        this._currentTrophy = product;
    }

    public handleTrophyColor(color: string): void
    {
        if(this._availableColorsForCurrentTrophy.indexOf(color) < 0) return;

        const trophyColor =  this._allTrophyOffers.getWithIndex(this._currentTrophyIndex).getValue(color);
        if(!trophyColor) return;

        this._currentTrophyColor = color;

        this.selectTrophyColor(trophyColor);
    }

    public getActiveClass(color: string): string
    {
        return this._availableColorsForCurrentTrophy.indexOf(color) >= 0 &&  this._currentTrophyColor == color ? 'selected' : '';
    }

    public imageReady(id: number, texture: NitroRenderTexture, image?: HTMLImageElement): void
    {
        if(texture)
        {
            const imageUrl = TextureUtils.generateImageUrl(texture);

            if(imageUrl)
            {
                this._ngZone.run(() => this._imageUrl = imageUrl);
            }
        }
    }

    public handleButton(button: string)
    {

        switch(button)
        {
            case 'next':
                if((this._allTrophyOffers.length -1) == (this._currentTrophyIndex))
                {
                    this._currentTrophyIndex = 0;
                }
                else
                {
                    this._currentTrophyIndex++;
                }
                break;
            case 'previous':
                if(this._currentTrophyIndex == 0)
                {
                    this._currentTrophyIndex = this._allTrophyOffers.length -1;
                }
                else
                {
                    this._currentTrophyIndex--;
                }
                break;
        }

        this.selectOfferByIndex(this._currentTrophyIndex);
    }

    public imageFailed(id: number): void
    {

    }

    public hasMultipleOffers(): boolean
    {
        return this._allTrophyOffers && this._allTrophyOffers.length > 0;
    }

    public trophyHasColor(color: string): boolean
    {
        return this._availableColorsForCurrentTrophy.indexOf(color) > -1;
    }

    private getTrophyNameWithoutColors(k: string): string
    {
        const local2 = this.getTrophyColorCharacter(k);

        if(local2.length > 0) return k.slice(0, ((k.length - 1) - local2.length));

        return k;
    }

    private getTrophyColorCharacter(k: string): string
    {
        const indexTrophy = k.indexOf('prizetrophy_2011_');

        if(indexTrophy != -1) return '';

        const lastUnderscoreIndex = k.lastIndexOf('_') + 1;

        if(lastUnderscoreIndex <= 0) return '';

        const local4 = k.substr(lastUnderscoreIndex);

        if(local4.length > 1 || (local4 != 'g' && local4 != 's' && local4 != 'b')) return '';

        return local4;

    }

    public buyCurrentItem(): void
    {
        this._catalogService.component && this._catalogService.component.confirmPurchase(this.activePage, this.currentTrophyOffer, 1, this.enteredText);
    }

    public getText(): string
    {

        return '';
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }
}
