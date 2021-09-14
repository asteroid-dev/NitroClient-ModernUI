import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CatalogPageData, ICatalogPageData, IFurnitureData, IFurnitureDataListener, Nitro } from '@nitrots/nitro-renderer';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CatalogService } from '../../services/catalog.service';
import { SearchResultsPage } from '../layouts/search-results/SearchResultsPage';

@Component({
    selector: '[nitro-catalog-navigation-component]',
    templateUrl: './navigation.template.html'
})
export class CatalogNavigationComponent implements OnInit, OnDestroy, IFurnitureDataListener
{
    public searchControl: FormControl = new FormControl();

    private _subscription: Subscription;

    constructor(private _catalogService: CatalogService)
    {}

    public ngOnInit(): void
    {
        this.subscribe();
    }

    public ngOnDestroy(): void
    {
        this.unsubscribe();
    }

    private subscribe(): void
    {
        this.unsubscribe();

        this._subscription = this.searchControl.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(500)
        ).subscribe(value => this.search(value));
    }

    private unsubscribe(): void
    {
        if(!this._subscription) return;

        this._subscription.unsubscribe();

        this._subscription = null;
    }

    private search(value: string): void
    {
        if(!value || !value.length)
        {
            this._catalogService.clearSearchResults();
            return;
        }

        value = value.toLocaleLowerCase();

        const furnitureData = Nitro.instance.sessionDataManager.getAllFurnitureData(this);

        if(!furnitureData) return;

        const foundFurniture: IFurnitureData[] = [];

        for(const furniture of furnitureData)
        {
            const hasOffer      = this._catalogService.getOfferPages(furniture.purchaseOfferId);
            const hasRentOffer  = this._catalogService.getOfferPages(furniture.rentOfferId);

            if(!hasOffer && !hasRentOffer) continue;

            const searchValue = [ furniture.className, furniture.name, furniture.description ].join(' ').toLocaleLowerCase();

            if(searchValue.indexOf(value) === -1) continue;

            foundFurniture.push(furniture);

            if(foundFurniture.length === 200) break;
        }

        this._catalogService.component.handleSearchResults(foundFurniture);
    }

    public loadFurnitureData(): void
    {

    }

    public get hasSearchResults(): boolean
    {
        return this._catalogService.activePage instanceof SearchResultsPage;
    }

    public get catalogPage(): CatalogPageData
    {
        return ((this._catalogService.component && this._catalogService.component.activeTab) || null);
    }

    public get searchResults(): ICatalogPageData
    {
        return this._catalogService.searchResults;
    }

    public clearResults(): void
    {
        this._catalogService.clearSearchResults();
        this.searchControl.setValue('');
    }

}
