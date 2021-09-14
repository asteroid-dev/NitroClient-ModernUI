import { Component, OnInit } from '@angular/core';
import { MarketplaceOffer, Nitro } from '@nitrots/nitro-renderer';
import { CatalogLayout } from '../../../../CatalogLayout';
import { IMarketplaceSearchOptions } from './sub/advanced.component';


@Component({
    templateUrl: './marketplace.template.html',
    styleUrls: ['./index.scss']
})
export class CatalogLayoutMarketplaceMarketplaceComponent extends CatalogLayout implements OnInit
{
    public static CODE: string = 'marketplace';

    public readonly SORT_TYPES_VALUE = [1, 2];
    public readonly SORT_TYPES_ACTIVITY = [3, 4, 5, 6];
    public readonly SORT_TYPES_ADVANCED = [1, 2, 3, 4, 5, 6];

    public view: string = 'activity';

    public sortType: number = 3; // first item of SORT_TYPES_ACTIVITY

    public ngOnInit(): void
    {
        this.searchOffers();
    }

    public selectView(view: string)
    {
        this.view = view;

        let forceSearch = false;
        switch(view)
        {
            case 'activity':
                this.sortType = this.SORT_TYPES_ACTIVITY[0];
                forceSearch = true;
                break;
            case 'value':
                this.sortType = this.SORT_TYPES_VALUE[0];
                forceSearch = true;
                break;
            case 'advanced':
                this.sortType = this.SORT_TYPES_ADVANCED[0];
                break;
        }

        if(forceSearch)
        {
            this.onSearch({
                minPrice: -1,
                maxPrice: -1,
                query: '',
                type: this.sortType
            });
        }
    }

    public onSortChanged(option: number): void
    {
        this._ngZone.run(() => this.sortType = option);
        this.searchOffers();
    }

    public onSearch(searchOptions: IMarketplaceSearchOptions): void
    {
        const minPrice = searchOptions.minPrice == 0 || !searchOptions.minPrice ? -1 : searchOptions.minPrice;
        const maxPrice = searchOptions.maxPrice == 0 || !searchOptions.maxPrice ? -1 : searchOptions.maxPrice;

        searchOptions.minPrice = minPrice;
        searchOptions.maxPrice = maxPrice;

        this._marketService.requestOffers(searchOptions);
    }

    private searchOffers(): void
    {
        const min = -1;
        const max = -1;
        const query = '';
        const type = this.sortType;

        this._marketService.requestOffers({
            minPrice: min,
            maxPrice: max,
            query,
            type
        });
    }

    public get marketOffers(): MarketplaceOffer[]
    {
        return this._marketService.publicOffers;
    }

    public get totalOffersFound(): number
    {
        return this._marketService.totalOffersFound;
    }

    public get foundText(): string
    {
        return Nitro.instance.localization.getValueWithParameter('catalog.marketplace.items_found', 'count', this.totalOffersFound.toString());
    }

    public get hasOffers(): boolean
    {
        return this.marketOffers && this.marketOffers.length > 0;
    }




}
