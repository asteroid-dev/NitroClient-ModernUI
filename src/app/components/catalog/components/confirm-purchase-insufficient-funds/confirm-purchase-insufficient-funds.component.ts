import { Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: 'nitro-catalog-confirm-purchase-insufficient-funds',
    templateUrl: './confirm-purchase-insufficient-funds.template.html'
})
export class CatalogConfirmPurchaseInsufficientFundsComponent
{
    constructor(
        private _catalogService: CatalogService,
        private _ngZone: NgZone
    )
    {}
    public hide(): void
    {
        (this._catalogService.component && this._catalogService.component.setInsufficientFunds(false));
    }
}
