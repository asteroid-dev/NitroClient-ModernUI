import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';

@Component({
    template: `
        <div class="mp-flex-main">
            <div class="mp-flex">
                <input type="text" class="mp-search" [(ngModel)]="searchQuery" [placeholder]="'catalog.marketplace.search_name' | translate" />
                <div class="price-between">{{ 'catalog.marketplace.search_price' | translate }}</div>
            </div>
            <div class="mp-flex">
                <div class="mpa-select-main">
                    <select class="mpa-select" (change)="onOptionSelect($event)">
                        <option [selected]="filter.value == sortType" [value]="filter.value" *ngFor="let filter of getFilters()">{{ filter.name }}</option>
                    </select>
                </div>
                <div class="price-flex">
                    <input type="number" placeholder="0" class="price-input" [(ngModel)]="searchPriceBetweenStart" />
                    <input type="number" placeholder="0" class="price-input" [(ngModel)]="searchPriceBetweenEnd" />
                </div>
            </div>
            <button (click)="search()" class="advanced-success">{{ 'generic.search' | translate }}</button>
        </div>
        `,
    selector: '[nitro-marketplace-sub-advanced]',
})
export class CatalogLayoutMarketplaceMarketplaceSubAdvancedComponent
{
    @Input()
    public sortTypes: number[];


    public sortType: number = 0;

    public searchQuery: string = '';
    public searchPriceBetweenStart: number = null;
    public searchPriceBetweenEnd: number = null;

    @Output()
    public onSearch = new EventEmitter<IMarketplaceSearchOptions>();

    public getFilters(): IFilter[]
    {
        const filters = [];

        for(const type of this.sortTypes)
        {
            const name = this.translateKey(`catalog.marketplace.sort.${type}`);
            filters.push({
                name,
                value: type
            });
        }

        return filters;
    }

    public ngOnInit(): void
    {
        this.sortType = this.sortTypes[0];
    }

    private translateKey(key: string): string
    {
        return Nitro.instance.localization.getValue(key);
    }

    public onOptionSelect(event)
    {
        const value = parseInt(event.target.value);
        this.sortType = value;
    }

    public search(): void
    {
        const options: IMarketplaceSearchOptions = {
            minPrice: this.searchPriceBetweenStart,
            maxPrice: this.searchPriceBetweenEnd,
            query: this.searchQuery,
            type: this.sortType
        };

        this.onSearch.emit(options);
    }

}

export interface IMarketplaceSearchOptions {
    query: string;
    type: number;
    minPrice: number;
    maxPrice: number;
}

interface IFilter {
    name: string,
    value: number
}
