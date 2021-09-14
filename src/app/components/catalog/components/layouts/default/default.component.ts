import { Component } from '@angular/core';
import { CatalogPageOfferData } from '@nitrots/nitro-renderer';
import { CatalogLayout } from '../../../CatalogLayout';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';

@Component({
    templateUrl: './default.template.html'
})
export class CatalogLayoutDefaultComponent extends CatalogLayout
{
    public static CODE: string = 'default_3x3';

    public selectOffer(offer: CatalogPageOfferData): void
    {
        if(!offer) return;

        const product = offer.products[0];

        if(!product) return;

        const typesWithoutPreviewer = [ProductTypeEnum.BADGE];

        this.roomPreviewerVisible = typesWithoutPreviewer.indexOf(product.productType) == -1;

        (this._catalogService.component && this._catalogService.component.selectOffer(offer));
    }

    public offerCount(offer: CatalogPageOfferData): number
    {
        if(!this.hasMultipleProducts(offer))
        {
            const product = this.getFirstProduct(offer);

            if(product) return product.productCount;
        }

        return 1;
    }
}
