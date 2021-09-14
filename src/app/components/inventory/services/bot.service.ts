import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AdvancedMap, BotAddedToInventoryEvent, BotData, BotInventoryMessageEvent, BotRemovedFromInventoryEvent, GetBotInventoryComposer, IMessageEvent, Nitro, RoomEngineObjectEvent, RoomEngineObjectPlacedEvent, RoomObjectCategory, RoomObjectPlacementSource, RoomObjectType } from '@nitrots/nitro-renderer';
import { InventoryMainComponent } from '../components/main/main.component';
import { BotItem } from '../items/BotItem';
import { UnseenItemCategory } from '../unseen/UnseenItemCategory';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryBotService implements OnDestroy
{
    public static INVENTORY_UPDATED: string             = 'IBS_INVENTORY_UPDATED';
    public static SELECT_FIRST_GROUP: string            = 'IBS_SELECT_FIRST_GROUP';
    public static SELECT_EXISTING_GROUP_DEFAULT: string = 'IBS_SELECT_EXISTING_GROUP_DEFAULT';

    private _messages: IMessageEvent[]          = [];
    private _bots: AdvancedMap<number, BotItem> = new AdvancedMap();
    private _botIdInBotPlacing: number          = -1;
    private _isObjectMoverRequested: boolean    = false;
    private _isInitialized: boolean             = false;
    private _needsUpdate: boolean               = false;

    constructor(
        private _inventoryService: InventoryService,
        private _ngZone: NgZone)
    {
        this.onRoomEngineObjectPlacedEvent = this.onRoomEngineObjectPlacedEvent.bind(this);

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectPlacedEvent);

            this._messages = [
                new BotInventoryMessageEvent(this.onBotInventoryMessageEvent.bind(this)),
                new BotRemovedFromInventoryEvent(this.onBotRemovedFromInventoryEvent.bind(this)),
                new BotAddedToInventoryEvent(this.onBotAddedToInventoryEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectPlacedEvent);

            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomEngineObjectPlacedEvent(event: RoomEngineObjectPlacedEvent): void
    {
        if(!event) return;

        if(this._isObjectMoverRequested && event.type === RoomEngineObjectEvent.PLACED)
        {
            this._isObjectMoverRequested = false;

            if(!event.placedInRoom)
            {
                this._ngZone.run(() => this._inventoryService.showWindow());
            }
        }
    }

    private onBotInventoryMessageEvent(event: BotInventoryMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            for(const botData of parser.items.values()) this.addSingleBotItem(botData);

            this._isInitialized = true;

            if(this._inventoryService.botsController) this._inventoryService.botsController.selectExistingGroupOrDefault();
        });
    }

    private onBotRemovedFromInventoryEvent(event: BotRemovedFromInventoryEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this.removeItemById(parser.itemId));
    }

    private onBotAddedToInventoryEvent(event: BotAddedToInventoryEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            const botItem = this.addSingleBotItem(parser.item);

            if(botItem) botItem.isUnseen = true;
        });
    }

    private getAllItemIds(): number[]
    {
        const itemIds: number[] = [];

        for(const botData of this._bots.getValues()) itemIds.push(botData.id);

        return itemIds;
    }

    public getBotItem(id: number): BotItem
    {
        const botItem = this._bots.getValue(id);

        if(!botItem) return null;

        return botItem;
    }

    private addSingleBotItem(botData: BotData): BotItem
    {
        if(!this._bots) this._bots = new AdvancedMap();

        const botItem   = new BotItem(botData);
        const unseen    = this.isBotUnseen(botData);

        if(unseen)
        {
            botItem.isUnseen = true;

            this.unshiftBotItem(botItem);
        }
        else
        {
            this.pushBotItem(botItem);
        }

        return botItem;
    }

    public removeItemById(id: number): BotItem
    {
        if(!this._bots.length) return null;

        const botItem = this._bots.remove(id);

        if(!botItem) return null;

        if(this._botIdInBotPlacing === botItem.id)
        {
            this.cancelRoomObjectPlacement();

            this._inventoryService.showWindow();
        }

        return botItem;
    }

    private isBotUnseen(item: BotData): boolean
    {
        const category = UnseenItemCategory.BOT;

        return this._inventoryService.unseenTracker._Str_3613(category, item.id);
    }

    public setAllBotsSeen(): void
    {
        this._inventoryService.unseenTracker._Str_8813(UnseenItemCategory.BOT);

        for(const botItem of this._bots.getValues())
        {
            if(botItem.isUnseen) botItem.isUnseen = false;
        }

        this._inventoryService.updateUnseenCount();
    }

    public attemptBotPlacement(flag: boolean = false): boolean
    {
        const botItem = this.getSelectedBot();

        if(!botItem) return false;

        const botData = botItem.botData;

        if(!botData) return false;

        const session = Nitro.instance.roomSessionManager.getSession(1);

        if(!session || !session.isRoomOwner) return false;

        this._inventoryService.hideWindow();

        this.startRoomObjectPlacement(botData);

        return true;
    }

    private startRoomObjectPlacement(botData: BotData): void
    {
        const isMoving = Nitro.instance.roomEngine.processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, -(botData.id), RoomObjectCategory.UNIT, RoomObjectType.RENTABLE_BOT, botData.figure);

        if(isMoving)
        {
            this._botIdInBotPlacing = botData.id;

            this.setObjectMoverRequested(true);
        }
    }

    private cancelRoomObjectPlacement(): void
    {
        if(this._botIdInBotPlacing > -1)
        {
            Nitro.instance.roomEngine.cancelRoomObjectPlacement();

            this.setObjectMoverRequested(false);

            this._botIdInBotPlacing = -1;
        }
    }

    public getSelectedBot(): BotItem
    {
        for(const botItem of this._bots.getValues())
        {
            if(botItem && botItem.selected) return botItem;
        }

        return null;
    }

    private unshiftBotItem(botItem: BotItem): void
    {
        this._bots.unshift(botItem.id, botItem);
    }

    private pushBotItem(botItem: BotItem): void
    {
        this._bots.add(botItem.id, botItem);
    }

    private removeBotItem(botItem: BotItem): void
    {
        this._bots.remove(botItem.id);
    }

    private removeAndUnshiftGroupitem(botItem: BotItem): void
    {
        this.removeBotItem(botItem);
        this.unshiftBotItem(botItem);
    }

    public unselectAllBotItems(): void
    {
        for(const botItem of this._bots.getValues()) botItem.selected = false;
    }

    public requestLoad(): void
    {
        this._needsUpdate = false;

        Nitro.instance.communication.connection.send(new GetBotInventoryComposer());
    }

    private setObjectMoverRequested(flag: boolean)
    {
        if(this._isObjectMoverRequested === flag) return;

        this._ngZone.run(() => (this._isObjectMoverRequested = flag));
    }

    public get controller(): InventoryMainComponent
    {
        return this._inventoryService.controller;
    }

    public get isInitalized(): boolean
    {
        return this._isInitialized;
    }

    public get needsUpdate(): boolean
    {
        return this._needsUpdate;
    }

    public get bots(): BotItem[]
    {
        return this._bots.getValues();
    }

    public get isObjectMoverRequested(): boolean
    {
        return this._isObjectMoverRequested;
    }
}
