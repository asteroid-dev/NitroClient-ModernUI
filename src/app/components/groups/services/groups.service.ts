import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CatalogPurchaseEvent, GroupAdminGiveComposer, GroupAdminTakeComposer, GroupBadgePartsComposer, GroupBadgePartsEvent, GroupBuyComposer, GroupBuyDataComposer, GroupBuyDataEvent, GroupConfirmMemberRemoveEvent, GroupConfirmRemoveMemberComposer, GroupDeleteComposer, GroupInformationComposer, GroupInformationEvent, GroupJoinComposer, GroupMembersComposer, GroupMembersEvent, GroupMembershipAcceptComposer, GroupMembershipDeclineComposer, GroupSaveBadgeComposer, GroupSaveColorsComposer, GroupSaveInformationComposer, GroupSavePreferencesComposer, GroupSettingsComposer, GroupSettingsEvent, ILinkEventTracker, IMessageEvent, Nitro, RoomInfoEvent, RoomSessionEvent, UserProfileComposer } from '@nitrots/nitro-renderer';
import { NotificationService } from '../../notification/services/notification.service';
import GroupSettings from '../common/GroupSettings';
import { GroupCreatorComponent } from '../components/group-creator/components/main/group-creator.component';
import { GroupInfoComponent } from '../components/group-info/group-info.component';
import { GroupManagerComponent } from '../components/group-manager/components/main/group-manager.component';
import { GroupMembersComponent } from '../components/group-members/group-members.component';
import { GroupRoomInfoComponent } from '../components/room-info/room-info.component';

@Injectable()
export class GroupsService implements OnDestroy, ILinkEventTracker
{
    private _messages: IMessageEvent[];

    private _roomInfoComponent: GroupRoomInfoComponent;
    private _groupInfoComponent: GroupInfoComponent;
    private _groupMembersComponent: GroupMembersComponent;
    private _groupManagerComponent: GroupManagerComponent;

    private _groupCreatorModal: NgbModalRef;

    private _badgeBases: Map<number, string[]>;
    private _badgeSymbols: Map<number, string[]>;
    private _badgePartColors: Map<number, string>;

    private _groupColorsA: Map<number, string>;
    private _groupColorsB: Map<number, string>;

    private _leavingGroupId: number;

    constructor(
        private _notificationService: NotificationService,
        private _modalService: NgbModal,
        private _ngZone: NgZone)
    {
        this._messages          = [];

        this._badgeBases         = new Map();
        this._badgeSymbols       = new Map();
        this._badgePartColors    = new Map();
        this._groupColorsA       = new Map();
        this._groupColorsB       = new Map();

        this._leavingGroupId    = 0;

        this.onRoomSessionEvent = this.onRoomSessionEvent.bind(this);

        this.registerMessages();

        Nitro.instance.addLinkEventTracker(this);
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.unregisterMessages();

            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent);

            this._messages = [
                new RoomInfoEvent(this.onRoomInfoEvent.bind(this)),
                new GroupInformationEvent(this.onGroupInformationEvent.bind(this)),
                new GroupMembersEvent(this.onGroupMembersEvent.bind(this)),
                new GroupConfirmMemberRemoveEvent(this.onGroupConfirmMemberRemoveEvent.bind(this)),
                new GroupBuyDataEvent(this.onGroupBuyDataEvent.bind(this)),
                new GroupBadgePartsEvent(this.onGroupBadgePartsEvent.bind(this)),
                new CatalogPurchaseEvent(this.onCatalogPurchaseEvent.bind(this)),
                new GroupSettingsEvent(this.onGroupSettingsEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent);

            if(this._messages && this._messages.length)
            {
                for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionEvent.ENDED:
                this._ngZone.run(() =>
                {
                    this._roomInfoComponent.clear();
                });
                return;
        }
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._roomInfoComponent.groupId          = parser.data.habboGroupId;
            this._roomInfoComponent.groupName        = parser.data.groupName;
            this._roomInfoComponent.groupBadgeCode   = parser.data.groupBadgeCode;
            this._roomInfoComponent.groupMember      = parser.isGroupMember;
        });

        Nitro.instance.communication.connection.send(new GroupInformationComposer(parser.data.habboGroupId, false));
    }

    private onGroupInformationEvent(event: GroupInformationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(parser.flag || parser.id === this._groupInfoComponent.groupId)
        {
            this._ngZone.run(() =>
            {
                this._groupInfoComponent.groupId                        = parser.id;
                this._groupInfoComponent.groupName                      = parser.title;
                this._groupInfoComponent.groupBadgeCode                 = parser.badge;
                this._groupInfoComponent.groupDescription               = parser.description;
                this._groupInfoComponent.groupType                      = parser.type;
                this._groupInfoComponent.groupMembershipType            = parser.membershipType;
                this._groupInfoComponent.groupCreationDate              = parser.createdAt;
                this._groupInfoComponent.groupOwnerName                 = parser.ownerName;
                this._groupInfoComponent.groupMembersCount              = parser.membersCount;
                this._groupInfoComponent.groupMembershipRequestsCount   = parser.pendingRequestsCount;
                this._groupInfoComponent.groupHomeRoomId                = parser.roomId;
                this._groupInfoComponent.isOwner                        = parser.isOwner;
            });
        }

        if(this._roomInfoComponent.groupId !== parser.id) return;

        this._ngZone.run(() =>
        {
            this._roomInfoComponent.groupType             = parser.type;
            this._roomInfoComponent.groupMembershipType   = parser.membershipType;
        });
    }

    private onGroupMembersEvent(event: GroupMembersEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._groupMembersComponent.groupId             = parser.groupId;
            this._groupMembersComponent.groupName           = parser.groupTitle;
            this._groupMembersComponent.groupBadgeCode      = parser.badge;
            this._groupMembersComponent.totalMembersCount   = parser.totalMembersCount;
            this._groupMembersComponent.result              = parser.result;
            this._groupMembersComponent.admin               = parser.admin;
            this._groupMembersComponent.pageSize            = parser.pageSize;
            this._groupMembersComponent.pageIndex           = parser.pageIndex;
            this._groupMembersComponent.level               = parser.level.toString();
        });
    }

    private onGroupConfirmMemberRemoveEvent(event: GroupConfirmMemberRemoveEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        let confirmationConfig = [];

        if(parser.userId === Nitro.instance.sessionDataManager.userId)
        {
            confirmationConfig = this._groupInfoComponent.confirmLeave();
        }
        else
        {
            if(!this._groupMembersComponent.admin) return;

            confirmationConfig = this._groupMembersComponent.confirmRemove(parser.userId, parser.furnitureCount);
        }

        this._notificationService.alertWithChoices(confirmationConfig[1], confirmationConfig[2], confirmationConfig[0]);
    }

    private onGroupBuyDataEvent(event: GroupBuyDataEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(this._groupCreatorModal)
        {
            const instance = (this._groupCreatorModal.componentInstance as GroupCreatorComponent);

            if(instance)
            {
                this._ngZone.run(() =>
                {
                    instance.groupCost      = parser.groupCost;
                    instance.availableRooms = parser.availableRooms;
                });
            }
        }
    }

    private onGroupBadgePartsEvent(event: GroupBadgePartsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._badgeBases         = parser.bases;
        this._badgeSymbols       = parser.symbols;
        this._badgePartColors    = parser.partColors;
        this._groupColorsA       = parser.colorsA;
        this._groupColorsB       = parser.colorsB;
    }

    private onCatalogPurchaseEvent(event: CatalogPurchaseEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this.closeGroupCreator();
        });
    }

    private onGroupSettingsEvent(event: GroupSettingsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!this._groupManagerComponent) return;

        this._groupManagerComponent.load(parser);
        Nitro.instance.communication.connection.send(new GroupBadgePartsComposer());
    }

    public linkReceived(k: string):void
    {
        const parts = k.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'create':
                this.openGroupCreator();
                return;
            case 'manage':
                if(!parts[2]) return;

                this.requestGroupSettings(parseInt(parts[2]));
                return;
            case 'info':
                if(!parts[2]) return;

                this.getInfo(parseInt(parts[2]));
                return;
        }
    }

    public getInfo(groupId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupInformationComposer(groupId, true));
    }

    public getMembers(groupId: number, pageId: number, query: string, level: number): void
    {
        Nitro.instance.communication.connection.send(new GroupMembersComposer(groupId, pageId, query, level));
    }

    public join(groupId: number): void
    {
        if(this._roomInfoComponent.groupType === 0)
        {
            this._ngZone.run(() =>
            {
                this._roomInfoComponent.groupMember = true;
            });
        }

        Nitro.instance.communication.connection.send(new GroupJoinComposer(groupId));
    }

    public giveAdmin(groupId: number, memberId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupAdminGiveComposer(groupId, memberId));
    }

    public takeAdmin(groupId: number, memberId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupAdminTakeComposer(groupId, memberId));
    }

    public acceptMembership(groupId: number, memberId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupMembershipAcceptComposer(groupId, memberId));
    }

    public declineMembership(groupId: number, memberId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupMembershipDeclineComposer(groupId, memberId));
    }

    public removeMember(groupId: number, memberId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupConfirmRemoveMemberComposer(groupId, memberId));
    }

    public deleteGroup(groupId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupDeleteComposer(groupId));
    }

    public openProfile(userId: number): void
    {
        Nitro.instance.communication.connection.send(new UserProfileComposer(userId));
    }

    public save(groupSettings: GroupSettings): void
    {
        Nitro.instance.communication.connection.send(new GroupSaveInformationComposer(
            groupSettings.id,
            groupSettings.name,
            groupSettings.description));

        Nitro.instance.communication.connection.send(new GroupSaveBadgeComposer(
            groupSettings.id,
            groupSettings.currentBadgeArray));

        Nitro.instance.communication.connection.send(new GroupSaveColorsComposer(
            groupSettings.id,
            groupSettings.colorA,
            groupSettings.colorB));

        Nitro.instance.communication.connection.send(new GroupSavePreferencesComposer(
            groupSettings.id,
            groupSettings.state,
            groupSettings.canMembersDecorate ? 0 : 1));
    }

    public buyGroup(groupSettings: GroupSettings): void
    {
        Nitro.instance.communication.connection.send(new GroupBuyComposer(
            groupSettings.name,
            groupSettings.description,
            parseInt(groupSettings.roomId),
            groupSettings.colorA,
            groupSettings.colorB,
            groupSettings.currentBadgeArray));
    }

    public openGroupCreator(): void
    {
        if(this._groupCreatorModal) return;

        this._groupCreatorModal = this._modalService.open(GroupCreatorComponent, {
            backdrop: 'static',
            centered: true,
            keyboard: false
        });

        if(this._groupCreatorModal)
        {
            this._groupCreatorModal.result.then(() => (this._groupCreatorModal = null));
        }

        Nitro.instance.communication.connection.send(new GroupBuyDataComposer());
        Nitro.instance.communication.connection.send(new GroupBadgePartsComposer());
    }

    public closeGroupCreator(): void
    {
        if(!this._groupCreatorModal) return;

        this._groupCreatorModal.close();

        this._groupCreatorModal = null;
    }

    public requestGroupSettings(groupId: number): void
    {
        Nitro.instance.communication.connection.send(new GroupSettingsComposer(groupId));
    }

    public get eventUrlPrefix(): string
    {
        return 'groups';
    }

    public set groupRoomInfoComponent(component: GroupRoomInfoComponent)
    {
        this._roomInfoComponent = component;
    }

    public set groupInfoComponent(component: GroupInfoComponent)
    {
        this._groupInfoComponent = component;
    }

    public set groupMembersComponent(component: GroupMembersComponent)
    {
        this._groupMembersComponent = component;
    }

    public set groupManagerComponent(component: GroupManagerComponent)
    {
        this._groupManagerComponent = component;
    }

    public get badgeBases(): Map<number, string[]>
    {
        return this._badgeBases;
    }

    public get badgeSymbols(): Map<number, string[]>
    {
        return this._badgeSymbols;
    }

    public get badgePartColors(): Map<number, string>
    {
        return this._badgePartColors;
    }

    public get groupColorsA(): Map<number, string>
    {
        return this._groupColorsA;
    }

    public get groupColorsB(): Map<number, string>
    {
        return this._groupColorsB;
    }
}
