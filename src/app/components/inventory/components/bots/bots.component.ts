import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Nitro, RoomObjectVariable, RoomPreviewer } from '@nitrots/nitro-renderer';
import { NotificationService } from '../../../notification/services/notification.service';
import { BotItem } from '../../items/BotItem';
import { InventoryService } from '../../services/inventory.service';
import { InventorySharedComponent } from '../shared/inventory-shared.component';

@Component({
    selector: '[nitro-inventory-bots-component]',
    templateUrl: './bots.template.html'
})
export class InventoryBotsComponent extends InventorySharedComponent implements OnInit, OnDestroy
{
    @Input()
    public roomPreviewer: RoomPreviewer = null;

    public selectedItem: BotItem = null;
    public mouseDown: boolean = false;

    constructor(
        private _notificationService: NotificationService,
        protected _inventoryService: InventoryService,
        protected _ngZone: NgZone)
    {
        super(_inventoryService, _ngZone);
    }

    public ngOnInit(): void
    {
        this._inventoryService.botsController = this;

        if(this._inventoryService.controller.botService.isInitalized) this.selectExistingGroupOrDefault();

        this.prepareInventory();
    }

    public ngOnDestroy(): void
    {
        this._inventoryService.controller.setAllBotsSeen();

        this._inventoryService.botsController = null;
    }

    private prepareInventory(): void
    {
        if(!this._inventoryService.controller.botService.isInitalized || this._inventoryService.controller.botService.needsUpdate)
        {
            this._inventoryService.controller.botService.requestLoad();
        }
        else
        {
            this.selectExistingGroupOrDefault();
        }
    }

    public selectExistingGroupOrDefault(): void
    {
        if(this.selectedItem)
        {
            const index = this.botItems.indexOf(this.selectedItem);

            if(index > -1)
            {
                this.selectBotItem(this.selectedItem);

                return;
            }
        }

        this.selectFirstBot();
    }

    public selectFirstBot(): void
    {
        let bot: BotItem = null;

        for(const botItem of this.botItems)
        {
            if(!botItem) continue;

            bot = botItem;

            break;
        }

        this.selectBotItem(bot);
    }

    private selectBotItem(botItem: BotItem): void
    {
        if(this.selectedItem === botItem) return;

        this._inventoryService.controller.botService.unselectAllBotItems();

        this.selectedItem = botItem;

        if(this.selectedItem)
        {
            this.selectedItem.selected = true;

            if(this.selectedItem.isUnseen) this.selectedItem.isUnseen = false;

            const botData = this.selectedItem.botData;

            if(!botData) return;

            this._ngZone.runOutsideAngular(() =>
            {
                if(this.roomPreviewer)
                {
                    let wallType        = Nitro.instance.roomEngine.getRoomInstanceVariable<string>(Nitro.instance.roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
                    let floorType       = Nitro.instance.roomEngine.getRoomInstanceVariable<string>(Nitro.instance.roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
                    let landscapeType   = Nitro.instance.roomEngine.getRoomInstanceVariable<string>(Nitro.instance.roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

                    wallType        = (wallType && wallType.length) ? wallType : '101';
                    floorType       = (floorType && floorType.length) ? floorType : '101';
                    landscapeType   = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

                    this.roomPreviewer.reset(false);
                    this.roomPreviewer.updateRoomWallsAndFloorVisibility(false, true);
                    this.roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);
                    this.roomPreviewer.addAvatarIntoRoom(botData.figure, 0);
                }
            });
        }
        else
        {
            this._ngZone.runOutsideAngular(() => this.roomPreviewer && this.roomPreviewer.reset(false));
        }
    }

    public onMouseDown(botItem: BotItem): void
    {
        if(!botItem) return;

        this.selectBotItem(botItem);

        this.mouseDown = true;
    }

    public onMouseUp(): void
    {
        this.mouseDown = false;
    }

    public onMouseOut(botItem: BotItem): void
    {
        if(!this.mouseDown) return;

        if(this.selectedItem !== botItem) return;

        this.attemptBotPlacement();
    }

    public trackByType(index: number, item: BotItem): number
    {
        return item.id;
    }

    public get botItems(): BotItem[]
    {
        return this._inventoryService.controller.botService.bots;
    }

    public get hasBotItems(): boolean
    {
        return !!this.botItems.length;
    }
}
