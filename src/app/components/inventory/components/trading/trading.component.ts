import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../../notification/services/notification.service';
import { GroupItem } from '../../items/GroupItem';
import { InventoryService } from '../../services/inventory.service';
import { InventoryTradingService } from '../../services/trading.service';

@Component({
    selector: '[nitro-inventory-trading-component]',
    templateUrl: './trading.template.html'
})
export class InventoryTradingComponent implements OnInit, OnDestroy
{
    private static COLOR_LOCKED: number = 4284532064;
    private static COLOR_UNLOCKED: number = 2577770;

    public static ALERT_SCAM: number = 0;
    public static ALERT_OTHER_CANCELLED: number = 1;
    public static ALERT_ALREADY_OPEN: number = 2;

    public indexs: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];

    private _timer: ReturnType<typeof setTimeout>;
    private _timerTick: number = 3;

    constructor(
        private _notificationService: NotificationService,
        private _inventoryService: InventoryService,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        this._inventoryService.tradeController = this;
    }

    public ngOnDestroy(): void
    {
        this._inventoryService.tradeController = null;
    }

    public startTimer(): void
    {
        if(this._timer)
        {
            clearInterval(this._timer);

            this._timer = null;
        }

        this._timerTick = 3;

        this._timer = setInterval(this.progressTimer.bind(this), 1000);
    }

    public resetTimer(): void
    {
        if(this._timer)
        {
            clearInterval(this._timer);
        }

        this._timerTick = -1;
    }

    private progressTimer(): void
    {
        if(this._timerTick === -1)
        {
            this.resetTimer();

            return;
        }

        this._timerTick--;

        if(this._timerTick === 0)
        {
            this._inventoryService.controller.tradeService.onTimerFinished();
        }
    }

    public getIconUrl(groupItem: GroupItem): string
    {
        const imageUrl = ((groupItem && groupItem.iconUrl) || null);

        return imageUrl;
    }

    public removeItem(index: number): void
    {
        this._inventoryService.controller.tradeService.removeItem(index);
    }

    public progressTrade(): void
    {
        switch(this._inventoryService.controller.tradeService.state)
        {
            case InventoryTradingService.TRADING_STATE_RUNNING:
                if(!this.otherUserItems.length && !this.ownUserAccepts)
                {
                    this._notificationService.alert('${inventory.trading.warning.other_not_offering}');
                }

                if(this.ownUserAccepts)
                {
                    this._inventoryService.controller.tradeService.sendTradingUnacceptComposer();
                }
                else
                {
                    this._inventoryService.controller.tradeService.sendTradingAcceptComposer();
                }
                break;
            case InventoryTradingService.TRADING_STATE_CONFIRMING:
                this._inventoryService.controller.tradeService.sendTradingConfirmComposer();
                break;
        }
    }

    public cancelTrade(): void
    {
        switch(this._inventoryService.controller.tradeService.state)
        {
            case InventoryTradingService.TRADING_STATE_RUNNING:
                this._inventoryService.controller.tradeService.sendTradingCloseComposer();
                break;
            case InventoryTradingService.TRADING_STATE_CONFIRMING:
                this._inventoryService.controller.tradeService.sendTradingCancelComposer();
                break;
        }
    }

    public get timerTick(): number
    {
        return this._timerTick;
    }

    public get state(): number
    {
        return this._inventoryService.controller.tradeService.state;
    }

    public get ownUserName(): string
    {
        return this._inventoryService.controller.tradeService.ownUserName;
    }

    public get ownUserItems(): GroupItem[]
    {
        return this._inventoryService.controller.tradeService.ownUserItems.getValues();
    }

    public get ownUserNumItems(): number
    {
        return this._inventoryService.controller.tradeService.ownUserNumItems;
    }

    public get ownUserNumCredits(): number
    {
        return this._inventoryService.controller.tradeService.ownUserNumCredits;
    }

    public get ownUserAccepts(): boolean
    {
        return this._inventoryService.controller.tradeService.ownUserAccepts;
    }

    public get otherUserName(): string
    {
        return this._inventoryService.controller.tradeService.otherUserName;
    }

    public get otherUserItems(): GroupItem[]
    {
        return this._inventoryService.controller.tradeService.otherUserItems.getValues();
    }

    public get otherUserNumItems(): number
    {
        return this._inventoryService.controller.tradeService.otherUserNumItems;
    }

    public get otherUserNumCredits(): number
    {
        return this._inventoryService.controller.tradeService.otherUserNumCredits;
    }

    public get otherUserAccepts(): boolean
    {
        return this._inventoryService.controller.tradeService.otherUserAccepts;
    }
}
