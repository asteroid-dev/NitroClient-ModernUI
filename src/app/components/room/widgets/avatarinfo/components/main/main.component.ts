import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { AvatarAction, HabboClubLevelEnum, IEventDispatcher, IRoomObject, Nitro, RoomEngineObjectEvent, RoomEnterEffect, RoomObjectCategory, RoomObjectType, RoomObjectUserType, RoomObjectVariable, RoomUserData } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../../../core/settings/service';
import { AvatarEditorService } from '../../../../../avatar-editor/services/avatar-editor.service';
import { FriendListService } from '../../../../../friendlist/services/friendlist.service';
import { ContextInfoView } from '../../../contextmenu/ContextInfoView';
import { IContextMenuParentWidget } from '../../../contextmenu/IContextMenuParentWidget';
import { ConversionTrackingWidget } from '../../../ConversionTrackingWidget';
import { RoomObjectNameEvent } from '../../../events/RoomObjectNameEvent';
import { RoomWidgetAvatarInfoEvent } from '../../../events/RoomWidgetAvatarInfoEvent';
import { RoomWidgetFurniInfostandUpdateEvent } from '../../../events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetPetInfostandUpdateEvent } from '../../../events/RoomWidgetPetInfostandUpdateEvent';
import { RoomWidgetRentableBotInfostandUpdateEvent } from '../../../events/RoomWidgetRentableBotInfostandUpdateEvent';
import { RoomWidgetRoomEngineUpdateEvent } from '../../../events/RoomWidgetRoomEngineUpdateEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../../../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetUpdateInfostandUserEvent } from '../../../events/RoomWidgetUpdateInfostandUserEvent';
import { RoomWidgetUserDataUpdateEvent } from '../../../events/RoomWidgetUserDataUpdateEvent';
import { RoomWidgetUserLocationUpdateEvent } from '../../../events/RoomWidgetUserLocationUpdateEvent';
import { AvatarInfoWidgetHandler } from '../../../handlers/AvatarInfoWidgetHandler';
import { RoomWidgetGetObjectLocationMessage } from '../../../messages/RoomWidgetGetObjectLocationMessage';
import { RoomWidgetRoomObjectMessage } from '../../../messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetUpdateEvent } from '../../../RoomWidgetUpdateEvent';
import { AvatarContextInfoView } from '../../common/AvatarContextInfoView';
import { AvatarInfoData } from '../../common/AvatarInfoData';
import { PetInfoData } from '../../common/PetInfoData';
import { RentableBotInfoData } from '../../common/RentableBotInfoData';
import { RoomAvatarInfoAvatarComponent } from '../avatar/avatar.component';
import { RoomAvatarInfoDecorateComponent } from '../decorate/decorate.component';
import { RoomAvatarInfoNameComponent } from '../name/name.component';
import { RoomAvatarInfoOwnAvatarComponent } from '../ownavatar/ownavatar.component';
import { RoomAvatarInfoOwnPetComponent } from '../ownpet/ownpet.component';
import { RoomAvatarInfoPetComponent } from '../pet/pet.component';
import { RoomAvatarInfoRentableBotComponent } from '../rentablebot/rentablebot.component';

@Component({
    selector: 'nitro-room-avatarinfo-component',
    templateUrl: './main.template.html'
})
export class RoomAvatarInfoComponent extends ConversionTrackingWidget implements IContextMenuParentWidget, OnDestroy
{
    private static _Str_17951: number = 77;
    private static _Str_18968: number = 29;
    private static _Str_16970: number = 30;
    private static _Str_18857: number = 185;
    private static _Str_18641: number = 5000;

    @ViewChild('contextsContainer', { read: ViewContainerRef })
    public contextsContainer: ViewContainerRef;

    public view: ComponentRef<AvatarContextInfoView> = null;
    public cachedNameView: ComponentRef<RoomAvatarInfoNameComponent> = null;
    public cachedOwnAvatarMenuView: ComponentRef<RoomAvatarInfoOwnAvatarComponent> = null;
    public cachedAvatarMenuView: ComponentRef<RoomAvatarInfoAvatarComponent> = null;
    public cachedDecorateModeView: ComponentRef<RoomAvatarInfoDecorateComponent> = null;
    public cachedRentableBotMenuView: ComponentRef<RoomAvatarInfoRentableBotComponent> = null;
    public cachedPetMenuView: ComponentRef<RoomAvatarInfoPetComponent> = null;
    public cachedOwnPetMenuView: ComponentRef<RoomAvatarInfoOwnPetComponent> = null;
    public cachedNameBubbles: Map<string, ComponentRef<RoomAvatarInfoNameComponent>> = new Map();

    public lastRollOverId: number                   = -1;
    public userInfoData: AvatarInfoData             = new AvatarInfoData();
    public petInfoData: PetInfoData                 = new PetInfoData();
    public rentableBotInfoData: RentableBotInfoData = new RentableBotInfoData();
    public isDancing: boolean                       = false;
    public handlePetInfo: boolean                   = true;

    private _isInitialized: boolean             = false;
    private _isRoomEnteredOwnAvatarHighlight    = false;
    private _isGameMode                         = false;
    private _isUpdating                         = false;

    constructor(
        private _avatarEditorService: AvatarEditorService,
        private _settingsService: SettingsService,
        private _friendListService: FriendListService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone
    )
    {
        super();

        this._Str_2557 = this._Str_2557.bind(this);
        this.onRoomEngineObjectEvent = this.onRoomEngineObjectEvent.bind(this);
    }

    public ngOnDestroy(): void
    {
        Nitro.instance.ticker.remove(this.update, this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.ADDED, this.onRoomEngineObjectEvent);
        Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectEvent);

        eventDispatcher.addEventListener(RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO, this._Str_2557);
        eventDispatcher.addEventListener(RoomObjectNameEvent.RWONE_TYPE, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.OWN_USER, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetUserDataUpdateEvent.RWUDUE_USER_DATA_UPDATED, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.BOT, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetRentableBotInfostandUpdateEvent.RENTABLE_BOT, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetPetInfostandUpdateEvent.PET_INFO, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetRoomEngineUpdateEvent.RWREUE_NORMAL_MODE, this._Str_2557);
        eventDispatcher.addEventListener(RoomWidgetRoomEngineUpdateEvent.RWREUE_GAME_MODE, this._Str_2557);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.ADDED, this.onRoomEngineObjectEvent);
        Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectEvent);

        eventDispatcher.removeEventListener(RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO, this._Str_2557);
        eventDispatcher.removeEventListener(RoomObjectNameEvent.RWONE_TYPE, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.OWN_USER, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetUserDataUpdateEvent.RWUDUE_USER_DATA_UPDATED, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.BOT, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetRentableBotInfostandUpdateEvent.RENTABLE_BOT, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetPetInfostandUpdateEvent.PET_INFO, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetRoomEngineUpdateEvent.RWREUE_NORMAL_MODE, this._Str_2557);
        eventDispatcher.removeEventListener(RoomWidgetRoomEngineUpdateEvent.RWREUE_GAME_MODE, this._Str_2557);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        switch(event.type)
        {
            case RoomEngineObjectEvent.ADDED: {
                if(event.category !== RoomObjectCategory.UNIT) return;

                const userData = this.handler.roomSession.userDataManager.getUserDataByIndex(event.objectId);

                if(!userData) return;

                if(this._friendListService.getFriendNames().indexOf(userData.name) == -1) return;

                this.showFriendNameBubble(userData, event.objectId);

                return;
            }
            case RoomEngineObjectEvent.REMOVED: {
                if(event.category === RoomObjectCategory.UNIT)
                {
                    for(const bubble of this.cachedNameBubbles.values())
                    {
                        if(bubble.instance.roomIndex === event.objectId) this.removeView(bubble, false);
                    }
                }
                return;
            }
        }
    }

    private showFriendNameBubble(userData: RoomUserData, objectId: number): void
    {
        if(!userData) return;

        if(this.cachedNameBubbles.has(userData.name)) return;

        const view = this.createView(RoomAvatarInfoNameComponent);

        view.instance.isFriend = true;

        this._ngZone.run(() => RoomAvatarInfoNameComponent.setup(view.instance, userData.webID, userData.name, RoomObjectType.USER, objectId, true));

        this.cachedNameBubbles.set(userData.name, view);

        this.toggleUpdateReceiver();
    }

    private _Str_2557(event: RoomWidgetUpdateEvent): void
    {
        const viewInstance = ((this.view && this.view.instance) || null);

        switch(event.type)
        {
            case RoomWidgetAvatarInfoEvent.RWAIE_AVATAR_INFO: {
                const avatarInfoEvent = (event as RoomWidgetAvatarInfoEvent);

                this._isRoomEnteredOwnAvatarHighlight = (!this._isInitialized && this.handler.container.roomSession && (avatarInfoEvent._Str_2707 === this.handler.container.roomSession.ownRoomIndex));

                this._Str_12674(avatarInfoEvent.userId, avatarInfoEvent.userName, avatarInfoEvent._Str_2908, avatarInfoEvent._Str_2707, avatarInfoEvent._Str_4330, null);

                this._isInitialized = true;
                break;
            }
            case RoomObjectNameEvent.RWONE_TYPE: {
                const nameEvent = (event as RoomObjectNameEvent);

                if(nameEvent.category === RoomObjectCategory.UNIT)
                {
                    this._Str_12674(nameEvent.userId, nameEvent.userName, nameEvent.userType, nameEvent.roomIndex, false, null);
                }
                break;
            }
            case RoomWidgetUpdateInfostandUserEvent.OWN_USER:
            case RoomWidgetUpdateInfostandUserEvent.PEER: {
                const infostandEvent = (event as RoomWidgetUpdateInfostandUserEvent);

                this.userInfoData.populate(infostandEvent);

                const userData = (infostandEvent.isSpectator ? null : this.userInfoData);

                this._Str_12674(infostandEvent.webID, infostandEvent.name, infostandEvent.userType, infostandEvent.roomIndex, false, userData);
                break;
            }
            case RoomWidgetPetInfostandUpdateEvent.PET_INFO: {
                if(this.handlePetInfo)
                {
                    const infostandEvent = (event as RoomWidgetPetInfostandUpdateEvent);

                    this.petInfoData.populate(infostandEvent);

                    this._Str_24751(infostandEvent.id, infostandEvent.name, infostandEvent._Str_2707, this.petInfoData);
                }

                break;
            }
            case RoomWidgetRentableBotInfostandUpdateEvent.RENTABLE_BOT: {
                const infostandEvent = (event as RoomWidgetRentableBotInfostandUpdateEvent);

                if(!this.rentableBotInfoData) this.rentableBotInfoData = new RentableBotInfoData();

                this.rentableBotInfoData.populate(infostandEvent);

                const session = this.handler.container.roomSessionManager.getSession(0);

                if(!session) return;

                const userData = session.userDataManager.getRentableBotData(infostandEvent.id);

                if(!userData) return;

                if(this.rentableBotInfoData && userData.botSkills) this.rentableBotInfoData._Str_19891(userData.botSkills);

                this._Str_16991(infostandEvent.id, infostandEvent.name, infostandEvent.roomIndex, this.rentableBotInfoData);
                break;
            }
            case RoomWidgetUserDataUpdateEvent.RWUDUE_USER_DATA_UPDATED: {
                if(!this._isInitialized)
                {
                    this._Str_25716();
                }
                break;
            }
            case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED: {
                const removedEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(viewInstance && ((viewInstance as AvatarContextInfoView).roomIndex === removedEvent.id)) this.removeView(this.view, false);

                for(const view of this.cachedNameBubbles.values())
                {
                    const viewInstance = view.instance;

                    if(viewInstance.roomIndex == removedEvent.id)
                    {
                        this.removeView(view, false);

                        break;
                    }
                }

                break;
            }
            case RoomWidgetFurniInfostandUpdateEvent.FURNI:
                if(this.view) this.removeView(this.view, false);
                break;
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED: {
                const selectedEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(selectedEvent.category === RoomObjectCategory.UNIT)
                {
                    this.handlePetInfo = true;
                }

                break;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED:
                if(this.view) this.removeView(this.view, false);
                break;
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER: {
                if(this._isRoomEnteredOwnAvatarHighlight) return;

                const rollOverEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(!viewInstance || !((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent) || (viewInstance instanceof RoomAvatarInfoRentableBotComponent) || (viewInstance instanceof RoomAvatarInfoOwnPetComponent)))
                {
                    this.lastRollOverId = rollOverEvent.id;
                    this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_NAME, rollOverEvent.id, rollOverEvent.category));
                }
                break;
            }
            case RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT: {
                if(this._isRoomEnteredOwnAvatarHighlight) return;

                const rollOutEvent = (event as RoomWidgetRoomObjectUpdateEvent);

                if(!viewInstance || !((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent) || (viewInstance instanceof RoomAvatarInfoRentableBotComponent) || (viewInstance instanceof RoomAvatarInfoOwnPetComponent)))
                {
                    if(rollOutEvent.id === this.lastRollOverId)
                    {
                        this.removeView(this.view, false);

                        this.lastRollOverId = -1;
                    }
                }
                break;
            }
            case RoomWidgetRoomEngineUpdateEvent.RWREUE_NORMAL_MODE:
                this._isGameMode = false;
                break;
            case RoomWidgetRoomEngineUpdateEvent.RWREUE_GAME_MODE:
                this._isGameMode = true;
                break;
        }

        this.toggleUpdateReceiver();
    }

    private _Str_12674(userId: number, userName: string, userType: number, roomIndex: number, flag: boolean, avatarData: AvatarInfoData): void
    {
        const isAvatarMenu = !!avatarData;

        let viewInstance = (this.view && this.view.instance);

        if(isAvatarMenu && viewInstance)
        {
            if(!((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent) || (viewInstance instanceof RoomAvatarInfoPetComponent) || (viewInstance instanceof RoomAvatarInfoOwnPetComponent) || (viewInstance instanceof RoomAvatarInfoRentableBotComponent)))
            {
                this.removeView(this.view, false);

                viewInstance = null;
            }
        }

        if(!viewInstance || (viewInstance.userId !== userId) || (viewInstance.userName !== userName) || (viewInstance.userType !== userType) || (viewInstance.roomIndex !== roomIndex))
        {
            if(this.view) this.removeView(this.view, false);

            if(!this._isGameMode)
            {
                if(isAvatarMenu)
                {
                    if(avatarData._Str_11453)
                    {
                        if(this.isDecorating) return;

                        if(RoomEnterEffect.isRunning())
                        {
                            return;
                        }
                        else
                        {
                            if(!this.cachedOwnAvatarMenuView) this.cachedOwnAvatarMenuView = this.createView(RoomAvatarInfoOwnAvatarComponent);

                            this.view = this.cachedOwnAvatarMenuView;

                            this._ngZone.run(() => RoomAvatarInfoOwnAvatarComponent.setup((this.view.instance as RoomAvatarInfoOwnAvatarComponent), userId, userName, userType, roomIndex, avatarData));
                        }
                    }
                    else
                    {
                        if(!this.cachedAvatarMenuView) this.cachedAvatarMenuView = this.createView(RoomAvatarInfoAvatarComponent);

                        this.view = this.cachedAvatarMenuView;

                        this._ngZone.run(() => RoomAvatarInfoAvatarComponent.setup((this.view.instance as RoomAvatarInfoAvatarComponent), userId, userName, userType, roomIndex, avatarData));

                        for(const view of this.cachedNameBubbles.values())
                        {
                            const viewInstance = view.instance;

                            if(viewInstance.userId !== userId) continue;

                            this.removeView(view, false);

                            break;
                        }
                    }
                }
                else
                {
                    if(!this.handler.roomEngine.isDecorating)
                    {
                        if(!this.cachedNameView) this.cachedNameView = this.createView(RoomAvatarInfoNameComponent);

                        this.view = this.cachedNameView;

                        this._ngZone.run(() =>
                        {
                            if(this.handler.container.sessionDataManager.userId === userId)
                            {
                                this._ngZone.run(() => RoomAvatarInfoNameComponent.setup(this.view.instance, userId, userName, userType, roomIndex));

                                if(this._isRoomEnteredOwnAvatarHighlight)
                                {
                                    //
                                }
                            }
                            else
                            {
                                this._ngZone.run(() => RoomAvatarInfoNameComponent.setup(this.view.instance, userId, userName, userType, roomIndex, true));
                            }
                        });
                    }
                }
            }
        }
        else
        {
            if(viewInstance && ((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent)))
            {
                if(viewInstance.userId === userId) this.removeView(this.view, false);
            }
        }
    }

    private _Str_16991(userId: number, userName: string, roomIndex: number, avatarData: RentableBotInfoData): void
    {
        const isAvatarMenu = !!avatarData;

        let viewInstance = (this.view && this.view.instance);

        if(isAvatarMenu && viewInstance)
        {
            if(!((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent) || (viewInstance instanceof RoomAvatarInfoRentableBotComponent) || (viewInstance instanceof RoomAvatarInfoPetComponent) || (viewInstance instanceof RoomAvatarInfoOwnPetComponent)))
            {
                this.removeView(this.view, false);

                viewInstance = null;
            }
        }

        if(!viewInstance || (viewInstance.userId !== userId) || (viewInstance.userName !== userName) || (viewInstance.userType !== RoomObjectType.RENTABLE_BOT) || (viewInstance.roomIndex !== roomIndex))
        {
            if(this.view) this.removeView(this.view, false);

            if(!this._isGameMode)
            {
                if(isAvatarMenu)
                {
                    if(!this.cachedRentableBotMenuView) this.cachedRentableBotMenuView = this.createView(RoomAvatarInfoRentableBotComponent);

                    this.view = this.cachedRentableBotMenuView;

                    this._ngZone.run(() => RoomAvatarInfoRentableBotComponent.setup((this.view.instance as RoomAvatarInfoRentableBotComponent), userId, userName, RoomObjectType.RENTABLE_BOT, roomIndex, avatarData));
                }
            }
        }
        else
        {
            if(viewInstance && (viewInstance instanceof RoomAvatarInfoRentableBotComponent))
            {
                if(viewInstance.userId === userId) this.removeView(this.view, false);
            }
        }
    }

    private _Str_24751(userId: number, userName: string, roomIndex: number, avatarData: PetInfoData): void
    {
        const isAvatarMenu = !!avatarData;

        let viewInstance = (this.view && this.view.instance);

        if(isAvatarMenu && viewInstance)
        {
            if(!((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent) || (viewInstance instanceof RoomAvatarInfoPetComponent) || (viewInstance instanceof RoomAvatarInfoOwnPetComponent) || (viewInstance instanceof RoomAvatarInfoRentableBotComponent)))
            {
                this.removeView(this.view, false);

                viewInstance = null;
            }
        }

        if(!viewInstance || (viewInstance.userId !== userId) || (viewInstance.userName !== userName) || (viewInstance.userType !== RoomObjectType.PET) || (viewInstance.roomIndex !== roomIndex))
        {
            if(this.view) this.removeView(this.view, false);

            if(!this._isGameMode)
            {
                if(isAvatarMenu)
                {
                    if(avatarData._Str_5175)
                    {
                        if(!this.cachedOwnPetMenuView) this.cachedOwnPetMenuView = this.createView(RoomAvatarInfoOwnPetComponent);

                        this.view = this.cachedOwnPetMenuView;

                        this._ngZone.run(() => RoomAvatarInfoOwnPetComponent.setup((this.view.instance as RoomAvatarInfoOwnPetComponent), userId, userName, RoomObjectType.PET, roomIndex, avatarData));
                    }
                    else
                    {
                        if(!this.cachedPetMenuView) this.cachedPetMenuView = this.createView(RoomAvatarInfoPetComponent);

                        this.view = this.cachedPetMenuView;

                        this._ngZone.run(() => RoomAvatarInfoPetComponent.setup((this.view.instance as RoomAvatarInfoPetComponent), userId, userName, RoomObjectType.PET, roomIndex, avatarData));
                    }
                }
            }
        }
        else
        {
            if(viewInstance && ((viewInstance instanceof RoomAvatarInfoAvatarComponent) || (viewInstance instanceof RoomAvatarInfoOwnAvatarComponent)))
            {
                if(viewInstance.userId === userId) this.removeView(this.view, false);
            }
        }
    }

    private createView<T extends ContextInfoView>(component: Type<T>): ComponentRef<T>
    {
        if(!component) return null;

        let viewRef: ComponentRef<T>    = null;
        let view: T                     = null;

        this._ngZone.run(() =>
        {
            const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);

            viewRef = this.contextsContainer.createComponent(componentFactory);
            view    = viewRef.instance;
        });

        if(!view || !viewRef) return null;

        view.parent         = this;
        view.componentRef   = viewRef;

        return viewRef;
    }

    public close(): void
    {
        this.removeView(this.view, false);
    }

    public removeView(view: ComponentRef<ContextInfoView>, flag: boolean): void
    {
        this._isRoomEnteredOwnAvatarHighlight = false;

        if(!view) return;

        const componentIndex = this.contextsContainer.indexOf(view.hostView);

        if(componentIndex === -1) return;

        this.cachedNameView             = null;
        this.cachedOwnAvatarMenuView    = null;
        this.cachedAvatarMenuView       = null;
        this.cachedRentableBotMenuView  = null;
        this.cachedPetMenuView          = null;
        this.cachedOwnPetMenuView       = null;

        if(view === this.view) this.view = null;

        if(view instanceof RoomAvatarInfoNameComponent)
        {
            this.cachedNameBubbles.delete((view.instance as RoomAvatarInfoNameComponent).userName);

            this.toggleUpdateReceiver();
        }

        this._ngZone.run(() => this.contextsContainer.remove(componentIndex));
    }

    public toggleUpdateReceiver(): void
    {
        if(this.view || (this.cachedNameBubbles.size > 0) || this.cachedDecorateModeView)
        {
            if(this._isUpdating) return;

            Nitro.instance.ticker.add(this.update, this);

            this._isUpdating = true;
        }
        else
        {
            Nitro.instance.ticker.remove(this.update, this);

            this._isUpdating = false;
        }
    }

    public update(time: number): void
    {
        if(this.view)
        {
            const viewInstance = this.view.instance;

            const message = (this.messageListener.processWidgetMessage(new RoomWidgetGetObjectLocationMessage(RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION, viewInstance.userId, viewInstance.userType)) as RoomWidgetUserLocationUpdateEvent);

            if(message) viewInstance.update(message.rectangle, message._Str_9337, time);
        }

        if(this.cachedDecorateModeView)
        {
            const viewInstance = this.cachedDecorateModeView.instance;

            const message = (this.messageListener.processWidgetMessage(new RoomWidgetGetObjectLocationMessage(RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION, viewInstance.userId, viewInstance.userType)) as RoomWidgetUserLocationUpdateEvent);

            if(message) viewInstance.update(message.rectangle, message._Str_9337, time);
        }

        for(const view of this.cachedNameBubbles.values())
        {
            if(!view) continue;

            const viewInstance = view.instance;

            const message = (this.messageListener.processWidgetMessage(new RoomWidgetGetObjectLocationMessage(RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION, viewInstance.userId, viewInstance.userType)) as RoomWidgetUserLocationUpdateEvent);

            if(message) viewInstance.update(message.rectangle, message._Str_9337, time);
        }
    }

    private getOwnRoomObject(): IRoomObject
    {
        const userId        = this.handler.container.sessionDataManager.userId;
        const roomId        = this.handler.roomEngine.activeRoomId;
        const category      = RoomObjectCategory.UNIT;
        const totalObjects  = this.handler.roomEngine.getTotalObjectsForManager(roomId, category);

        let i = 0;

        while(i < totalObjects)
        {
            const roomObject = this.handler.roomEngine.getRoomObjectByIndex(roomId, i, category);

            if(roomObject)
            {
                const userData = this.handler.roomSession.userDataManager.getUserDataByIndex(roomObject.id);

                if(userData)
                {
                    if(userData.webID === userId) return roomObject;
                }
            }

            i++;
        }

        return null;
    }

    private _Str_25716(): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OWN_CHARACTER_INFO, 0, 0));
    }

    public openAvatarEditor(): void
    {
        this._avatarEditorService.loadOwnAvatarInEditor();
        this._settingsService.showAvatarEditor();
    }

    public useSign(sign: number): void
    {
        this.widgetHandler.container.roomSession.sendSignMessage(sign);
    }

    public get getOwnPosture(): string
    {
        const roomObject = this.getOwnRoomObject();

        if(roomObject)
        {
            const model = roomObject.model;

            if(model)
            {
                return model.getValue<string>(RoomObjectVariable.FIGURE_POSTURE);
            }
        }

        return AvatarAction.POSTURE_STAND;
    }

    public get getCanStandUp(): boolean
    {
        const roomObject = this.getOwnRoomObject();

        if(roomObject)
        {
            const model = roomObject.model;

            if(model)
            {
                return model.getValue<boolean>(RoomObjectVariable.FIGURE_CAN_STAND_UP);
            }
        }

        return false;
    }

    public get _Str_12708(): boolean
    {
        const roomObject = this.getOwnRoomObject();

        if(roomObject)
        {
            const model = roomObject.model;

            if(model)
            {
                const effectId = model.getValue<number>(RoomObjectVariable.FIGURE_EFFECT);

                return ((effectId === RoomAvatarInfoComponent._Str_18968) || (effectId === RoomAvatarInfoComponent._Str_16970) || (effectId === RoomAvatarInfoComponent._Str_18857));
            }
        }

        return false;
    }

    public get _Str_25831(): boolean
    {
        const roomObject = this.getOwnRoomObject();

        if(roomObject)
        {
            const model = roomObject.model;

            if(model)
            {
                const effectId = model.getValue<number>(RoomObjectVariable.FIGURE_EFFECT);

                return (effectId === RoomAvatarInfoComponent._Str_17951);
            }
        }

        return false;
    }

    public get handler(): AvatarInfoWidgetHandler
    {
        return (this.widgetHandler as AvatarInfoWidgetHandler);
    }

    public get isDecorating(): boolean
    {
        return this.handler.roomSession.isDecorating;
    }

    public set isDecorating(flag: boolean)
    {
        this.handler.roomSession.isDecorating = flag;

        if(flag)
        {
            if(!this.cachedDecorateModeView) this.cachedDecorateModeView = this.createView(RoomAvatarInfoDecorateComponent);

            const userId = this.handler.container.sessionDataManager.userId;
            const userName = this.handler.container.sessionDataManager.userName;
            const roomIndex = this.handler.roomSession.ownRoomIndex;

            RoomAvatarInfoDecorateComponent.setup(this.cachedDecorateModeView.instance, userId, userName, RoomObjectUserType.getTypeNumber(RoomObjectUserType.USER), roomIndex);
        }
        else
        {
            if(this.cachedDecorateModeView)
            {
                this.removeView(this.cachedDecorateModeView, false);

                this.cachedDecorateModeView = null;
            }
        }
    }

    public get hasClub(): boolean
    {
        return (this.handler.container.sessionDataManager.clubLevel >= HabboClubLevelEnum.CLUB);
    }

    public get hasVip(): boolean
    {
        return (this.handler.container.sessionDataManager.clubLevel >= HabboClubLevelEnum.VIP);
    }
}
