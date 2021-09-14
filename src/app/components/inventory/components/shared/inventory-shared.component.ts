import { NgZone } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

export class InventorySharedComponent
{
    constructor(
        protected _inventoryService: InventoryService,
        protected _ngZone: NgZone)
    {}

    public get canPlace(): boolean
    {
        return !!this._inventoryService.roomSession;
    }

    public get tradeRunning(): boolean
    {
        return this._inventoryService.controller.tradeService.running;
    }

    public offerOnMarketplace(): void
    {
        this._inventoryService.controller.furnitureService.offerOnMarketplace();
    }

    public attemptItemPlacement(): void
    {
        if(!this.canPlace || this.tradeRunning) return;

        this._ngZone.runOutsideAngular(() => this._inventoryService.controller.furnitureService.attemptItemPlacement());
    }

    public attemptBotPlacement(): void
    {
        if(!this.canPlace || this.tradeRunning) return;

        this._ngZone.runOutsideAngular(() => this._inventoryService.controller.botService.attemptBotPlacement());
    }

    public attemptPetPlacement(): void
    {
        if(!this.canPlace || this.tradeRunning) return;

        this._ngZone.runOutsideAngular(() => this._inventoryService.controller.petService.attemptPetPlacement());
    }
}
