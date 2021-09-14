import { Component, Input } from '@angular/core';
import { ICatalogPageData } from '@nitrots/nitro-renderer';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: 'nitro-catalog-navigation-set-component',
    templateUrl: './navigation-set.template.html'
})
export class CatalogNavigationSetComponent
{
    @Input()
    public catalogPage: ICatalogPageData = null;

    constructor(private _catalogService: CatalogService)
    {}
}
