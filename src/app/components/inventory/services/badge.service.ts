import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BadgeReceivedEvent, BadgesEvent, IMessageEvent, Nitro, RequestBadgesComposer } from '@nitrots/nitro-renderer';
import { InventoryMainComponent } from '../components/main/main.component';
import { UnseenItemCategory } from '../unseen/UnseenItemCategory';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryBadgeService implements OnDestroy
{
    private _messages: IMessageEvent[]  = [];
    private _badges: string[]           = [];
    private _badgesInUse: string[]      = [];
    private _isInitialized: boolean     = false;
    private _needsUpdate: boolean       = false;

    constructor(
        private _inventoryService: InventoryService,
        private _ngZone: NgZone)
    {
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
            this._messages = [
                new BadgesEvent(this.onBadgesListEvent.bind(this)),
                new BadgeReceivedEvent(this.onBadgeReceivedEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onBadgesListEvent(event: BadgesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._badgesInUse   = [];
            this._badges        = [];

            const badgeCodes        = parser.getAllBadgeCodes();
            const activeBadgeCodes  = parser.getActiveBadgeCodes();

            for(const badgeCode of badgeCodes)
            {
                const wearingIndex = activeBadgeCodes.indexOf(badgeCode);

                if(wearingIndex === -1) this._badges.push(badgeCode);
                else this._badgesInUse.push(badgeCode);
            }

            this._isInitialized = true;

            if(this._inventoryService.badgesController) this._inventoryService.badgesController.selectExistingGroupOrDefault();
        });
    }

    public onBadgeReceivedEvent(event: BadgeReceivedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            const badge = parser.badgeCode;
            if(this._badges.indexOf(badge) === -1) this._badges.push(badge);
        });
    }

    public setAllBadgesSeen(): void
    {
        this._inventoryService.unseenTracker._Str_8813(UnseenItemCategory.BADGE);

        this._inventoryService.updateUnseenCount();
    }

    public isWearingBadge(badge: string): boolean
    {
        return (this._badgesInUse.indexOf(badge) >= 0);
    }

    public badgeLimitReached(): boolean
    {
        return (this._badgesInUse.length === 5);
    }

    public wearOrClearBadge(badge: string)
    {
        const wearingIndex = this._badgesInUse.indexOf(badge);

        if(wearingIndex === -1)
        {
            this._badgesInUse.push(badge);

            const index = this._badges.indexOf(badge);

            if(index >= 0) this._badges.splice(index, 1);
        }
        else
        {
            this._badgesInUse.splice(wearingIndex, 1);

            const index = this._badges.indexOf(badge);

            if(index === -1) this._badges.push(badge);
        }
    }

    public requestLoad(): void
    {
        this._needsUpdate = false;

        Nitro.instance.communication.connection.send(new RequestBadgesComposer());
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

    public get badges(): string[]
    {
        return this._badges;
    }

    public get activeBadges(): string[]
    {
        return this._badgesInUse;
    }
}
