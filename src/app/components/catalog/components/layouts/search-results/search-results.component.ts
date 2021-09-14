import { Component } from '@angular/core';
import { IFurnitureData } from '@nitrots/nitro-renderer';
import { CatalogLayoutDefaultComponent } from '../default/default.component';
import { SearchResultsPage } from './SearchResultsPage';

@Component({
    templateUrl: './search-result.template.html'
})
export class CatalogLayoutSearchResultsComponent extends CatalogLayoutDefaultComponent
{
    public static CODE: string = 'search_results';

    public requestOfferData(item: IFurnitureData): void
    {
        this._catalogService.requestOfferData(item.purchaseOfferId);
    }

    public searchItemImage(item: IFurnitureData): string
    {
        if(!item) return null;

        return this._catalogService.getFurnitureDataIconUrl(item);
    }

    public get searchItems(): IFurnitureData[]
    {
        if(!(this._catalogService.activePage instanceof SearchResultsPage)) return [];

        return (this._catalogService.activePage as SearchResultsPage).furni;
    }
}
