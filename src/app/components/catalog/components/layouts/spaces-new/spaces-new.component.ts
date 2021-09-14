import { Component, OnInit } from '@angular/core';
import { CatalogPageOfferData, Nitro } from '@nitrots/nitro-renderer';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';
import { CatalogLayoutDefaultComponent } from '../default/default.component';

@Component({
    templateUrl: './spaces-new.template.html'
})
export class CatalogLayoutSpacesNewComponent extends CatalogLayoutDefaultComponent implements OnInit
{
    public static CODE: string = 'spaces_new';

    private _groupNames: string[] = [ 'wallpaper', 'floor', 'landscape' ];
    private _groups: CatalogPageOfferData[][] = [];
    private _activeGroupIndex: number = -1;

    public ngOnInit(): void
    {
        this.sortOffers();

        this.selectFirstSpace();
    }

    private sortOffers(): void
    {
        for(const offer of this.offers)
        {
            if(!offer) continue;

            const product = this.getFirstProduct(offer);

            if(!product) continue;

            if((product.productType === ProductTypeEnum.WALL) || (product.productType === ProductTypeEnum.FLOOR))
            {
                const furniData = this.getProductFurniData(product);

                if(furniData)
                {
                    const className = furniData.className;
                    const index     = this._groupNames.indexOf(className);

                    if(index === -1) this._groupNames.push(className);

                    while(this._groups.length < this._groupNames.length) this._groups.push([]);

                    switch(className)
                    {
                        case 'floor':
                            this._groups[index].push(offer);
                            break;
                        case 'wallpaper':
                            this._groups[index].push(offer);
                            break;
                        case 'landscape':
                            this._groups[index].push(offer);
                            break;
                    }
                }
            }
        }

        this.switchCategory('walls');
    }

    public switchCategory(name: string): void
    {
        let index = -1;

        switch(name)
        {
            case 'walls':
                index = 0;
                break;
            case 'floor':
                index = 1;
                break;
            case 'landscape':
                index = 2;
                break;
        }

        this._activeGroupIndex = index;
    }

    private selectFirstSpace(): void
    {
        if(this._activeGroupIndex === -1) return;

        const group = this._groups[this.activeGroupIndex];

        if(!group || !group.length) return;

        this.selectOffer(group[0]);
    }

    public offerName(offer: CatalogPageOfferData): string
    {
        let key = '';

        const product = this.getFirstProduct(offer);

        if(product)
        {
            switch(product.productType)
            {
                case ProductTypeEnum.FLOOR:
                    key = 'roomItem.name.' + product.furniClassId;
                    break;
                case ProductTypeEnum.WALL:
                    key = 'wallItem.name.' + product.furniClassId;
                    break;
            }
        }

        if(key === '') return key;

        return Nitro.instance.getLocalization(key);
    }

    public offerImage(offer: CatalogPageOfferData): string
    {
        if(!offer) return '';

        const product = offer.products[0];

        if(!product) return '';

        const furniData = this.getProductFurniData(product);

        if(!furniData) return '';

        const assetUrl = Nitro.instance.getConfiguration<string>('catalog.asset.url');

        let iconName = '';

        switch(product.productType)
        {
            case ProductTypeEnum.WALL:
                switch(furniData.className)
                {
                    case 'floor':
                        iconName = ['th', furniData.className, product.extraParam].join('_');
                        break;
                    case 'wallpaper':
                        iconName = ['th', 'wall', product.extraParam].join('_');
                        break;
                    case 'landscape':
                        iconName = ['th', furniData.className, product.extraParam.replace('.', '_'), '001'].join('_');
                        break;
                }
                break;
            default:
                return super.offerImage(offer);
        }

        return ((assetUrl + '/' + iconName) + '.png');
    }

    public get groups(): CatalogPageOfferData[][]
    {
        return this._groups;
    }

    public get activeGroupIndex(): number
    {
        return this._activeGroupIndex;
    }
}
