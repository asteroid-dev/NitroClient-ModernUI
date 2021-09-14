import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Nitro, RoomPreviewer } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../core/settings/service';
import { FurnitureItem } from '../../items/FurnitureItem';
import { InventoryBadgeService } from '../../services/badge.service';
import { InventoryBotService } from '../../services/bot.service';
import { InventoryFurnitureService } from '../../services/furniture.service';
import { InventoryService } from '../../services/inventory.service';
import { InventoryPetService } from '../../services/pet.service';
import { InventoryTradingService } from '../../services/trading.service';

@Component({
    selector: 'nitro-inventory-main-component',
    templateUrl: './main.template.html'
})
export class InventoryMainComponent implements OnInit, OnDestroy, OnChanges
{
    @Input()
    public visible: boolean = false;

    private _roomPreviewer: RoomPreviewer = null;

    constructor(
        private _settingsService: SettingsService,
        private _inventoryService: InventoryService,
        private _inventoryFurnitureService: InventoryFurnitureService,
        private _inventoryBotService: InventoryBotService,
        private _inventoryPetService: InventoryPetService,
        private _inventoryBadgeService: InventoryBadgeService,
        private _inventoryTradingService: InventoryTradingService)
    {}

    public ngOnInit(): void
    {
        if(!this._roomPreviewer)
        {
            this._roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);
        }

        this._inventoryService.controller = this;
    }

    public ngOnDestroy(): void
    {
        if(this._roomPreviewer)
        {
            this._roomPreviewer.dispose();
        }

        this._inventoryService.controller = null;
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next !== prev)
        {
            if(!next) this._inventoryTradingService.close();
        }
    }

    public hide(): void
    {
        this._inventoryService.hideWindow();
    }

    public showFurniture(): void
    {
        this._inventoryService.furnitureVisible = true;
        this._inventoryService.botsVisible      = false;
        this._inventoryService.petsVisible      = false;
        this._inventoryService.badgesVisible    = false;
    }

    public showBots(): void
    {
        this._inventoryService.furnitureVisible = false;
        this._inventoryService.botsVisible      = true;
        this._inventoryService.petsVisible      = false;
        this._inventoryService.badgesVisible    = false;
    }

    public showPets(): void
    {
        this._inventoryService.furnitureVisible = false;
        this._inventoryService.botsVisible      = false;
        this._inventoryService.petsVisible      = true;
        this._inventoryService.badgesVisible    = false;
    }

    public showBadges(): void
    {
        this._inventoryService.furnitureVisible = false;
        this._inventoryService.botsVisible      = false;
        this._inventoryService.petsVisible      = false;
        this._inventoryService.badgesVisible    = true;
    }

    public updateItemLocking(): void
    {
        const itemIds: number[] = [];

        itemIds.push(...this._inventoryTradingService.getOwnTradingItemIds());

        if(!itemIds.length)
        {
            this._inventoryFurnitureService.unlockAllItems();

            return;
        }

        for(const item of this._inventoryFurnitureService.groupItems) item.lockItemIds(itemIds);
    }

    public setAllFurnitureSeen(): void
    {
        this._inventoryFurnitureService.setAllFurnitureSeen();
    }

    public setAllBotsSeen(): void
    {
        this._inventoryBotService.setAllBotsSeen();
    }

    public setAllPetsSeen(): void
    {
        this._inventoryPetService.setAllPetsSeen();
    }

    public setAllBadgesSeen(): void
    {
        this._inventoryBadgeService.setAllBadgesSeen();
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return this._roomPreviewer;
    }

    public get furnitureVisible(): boolean
    {
        return this._inventoryService.furnitureVisible;
    }

    public get badgesVisible(): boolean
    {
        return this._inventoryService.badgesVisible;
    }

    public get tradingVisible(): boolean
    {
        return this._inventoryService.tradingVisible;
    }

    public get marketPlaceOfferVisible(): boolean
    {
        return this._inventoryService.marketPlaceOfferVisible;
    }

    public get offerForMarketplace(): FurnitureItem
    {
        return this.furnitureService.offerOnMarketPlaceItem;
    }

    public get offerStatsIsCorrect(): boolean
    {
        return this.offerForMarketplace && this._inventoryFurnitureService.marketPlaceItemStats && this.offerForMarketplace.type === this._inventoryFurnitureService.marketPlaceItemStats.furniTypeId;
    }

    public get botsVisible(): boolean
    {
        return this._inventoryService.botsVisible;
    }

    public get petsVisible(): boolean
    {
        return this._inventoryService.petsVisible;
    }

    public get furnitureService(): InventoryFurnitureService
    {
        return this._inventoryFurnitureService;
    }

    public get botService(): InventoryBotService
    {
        return this._inventoryBotService;
    }

    public get petService(): InventoryPetService
    {
        return this._inventoryPetService;
    }

    public get badgeService(): InventoryBadgeService
    {
        return this._inventoryBadgeService;
    }

    public get tradeService(): InventoryTradingService
    {
        return this._inventoryTradingService;
    }

    public get furniUnseenCount(): number
    {
        return this._inventoryService.furniUnseenCount;
    }

    public get botUnseenCount(): number
    {
        return this._inventoryService.botUnseenCount;
    }

    public get petUnseenCount(): number
    {
        return this._inventoryService.petUnseenCount;
    }

    public get badgeUnseenCount(): number
    {
        return this._inventoryService.badgeUnseenCount;
    }
}
