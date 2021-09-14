import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigatorService } from '../../services/navigator.service';
import { INavigatorSearchFilter } from './INavigatorSearchFilter';

@Component({
    selector: '[nitro-navigator-search-component]',
    templateUrl: './search.template.html'
})
export class NavigatorSearchComponent implements OnInit
{
    private _form: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _navigatorService: NavigatorService)
    {}

    public ngOnInit(): void
    {
        this._form = this._formBuilder.group({
            search: [ '' ]
        });
    }

    public changeFilter(filter: INavigatorSearchFilter): void
    {
        this._navigatorService.setCurrentFilter(filter);
    }

    public search(event: KeyboardEvent): void
    {
        this._navigatorService.search(this.searchValue);
    }

    public clearSearch(): void
    {

    }

    public get form(): FormGroup
    {
        return this._form;
    }

    public get searchValue(): string
    {
        return this._navigatorService.lastSearch;
    }

    public set searchValue(value: string)
    {
        this._navigatorService.lastSearch = value;
    }

    public get currentFilter(): INavigatorSearchFilter
    {
        return this._navigatorService.filter;
    }

    public get searchFilters(): INavigatorSearchFilter[]
    {
        return NavigatorService.SEARCH_FILTERS;
    }

    public get hasSearchResults(): boolean
    {
        return (this._navigatorService.lastSearchResults && this._navigatorService.lastSearchResults.length > 0);
    }
}