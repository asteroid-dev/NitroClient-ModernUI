import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Nitro, SetActivatedBadgesComposer } from '@nitrots/nitro-renderer';
import { AchievementsService } from '../../../achievements/services/achievements.service';
import { NotificationService } from '../../../notification/services/notification.service';
import { InventoryService } from '../../services/inventory.service';
import { InventorySharedComponent } from '../shared/inventory-shared.component';

@Component({
    selector: '[nitro-inventory-badges-component]',
    templateUrl: './badges.template.html'
})
export class InventoryBadgesComponent extends InventorySharedComponent implements OnInit, OnDestroy
{
    public selectedBadge: string = null;

    constructor(
        private _notificationService: NotificationService,
        private _achievementService: AchievementsService,
        protected _inventoryService: InventoryService,
        protected _ngZone: NgZone)
    {
        super(_inventoryService, _ngZone);
    }

    public ngOnInit(): void
    {
        this._inventoryService.badgesController = this;

        if(this._inventoryService.controller.badgeService.isInitalized) this.selectExistingGroupOrDefault();

        this.prepareInventory();
    }

    public ngOnDestroy(): void
    {
        this._inventoryService.controller.setAllBadgesSeen();

        this._inventoryService.badgesController = null;
    }

    private prepareInventory(): void
    {
        if(!this._inventoryService.controller.badgeService.isInitalized || this._inventoryService.controller.badgeService.needsUpdate)
        {
            this._inventoryService.controller.badgeService.requestLoad();
        }
        else
        {
            this.selectExistingGroupOrDefault();
        }
    }

    public selectExistingGroupOrDefault(): void
    {
        if(this.selectedBadge)
        {
            const index = this.badges.indexOf(this.selectedBadge);

            if(index > -1)
            {
                this.selectBadge(this.selectedBadge);

                return;
            }
        }

        this.selectFirstBadge();
    }

    public selectFirstBadge(): void
    {
        let badge: string = null;

        for(const badgeCode of this.badges)
        {
            if(!badge) continue;

            badge = badgeCode;

            break;
        }

        this.selectBadge(badge);
    }

    public selectBadge(badge: string): void
    {
        if(this.selectedBadge === badge) return;

        this.selectedBadge = badge;
    }

    public wearBadge(): void
    {
        const badge = this.selectedBadge;

        if(!badge) return;

        this._inventoryService.controller.badgeService.wearOrClearBadge(badge);

        const composer = new SetActivatedBadgesComposer();

        for(const badgeCode of this.activeBadges) composer.addActivatedBadge(badgeCode);

        Nitro.instance.communication.connection.send(composer);
    }

    public isWearingBadge(badge: string): boolean
    {
        return this._inventoryService.controller.badgeService.isWearingBadge(badge);
    }

    public get hasBadgeItems(): boolean
    {
        return (this.badges && (this.badges.length > 0));
    }

    public get badges(): string[]
    {
        return this._inventoryService.controller.badgeService.badges;
    }

    public get activeBadges(): string[]
    {
        return this._inventoryService.controller.badgeService.activeBadges;
    }

    public get selectedBadgeName(): string
    {
        return ((this.selectedBadge && Nitro.instance.localization.getBadgeName(this.selectedBadge)) || null);
    }

    public get badgeButtonDisabled(): boolean
    {
        const limitReached = this._inventoryService.controller.badgeService.badgeLimitReached();

        if(this.selectedBadge && this.isWearingBadge(this.selectedBadge)) return false;

        return limitReached;
    }

    public get achievementsScore(): number
    {
        return this._achievementService.achievementScore;
    }
}
