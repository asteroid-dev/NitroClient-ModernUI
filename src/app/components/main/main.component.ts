import { animate, style, transition, trigger } from '@angular/animations';
import { AfterContentInit, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HabboWebTools, ILinkEventTracker, Nitro, RoomBackgroundColorEvent, RoomEngineDimmerStateEvent, RoomEngineEvent, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomId, RoomObjectHSLColorEnabledEvent, RoomObjectWidgetRequestEvent, RoomSessionChatEvent, RoomSessionDanceEvent, RoomSessionDimmerPresetsEvent, RoomSessionDoorbellEvent, RoomSessionErrorMessageEvent, RoomSessionEvent, RoomSessionFriendRequestEvent, RoomSessionPresentEvent, RoomSessionUserBadgesEvent, RoomWidgetEnum, RoomZoomEvent } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../core/settings/service';
import { NotificationService } from '../notification/services/notification.service';
import { RoomComponent } from '../room/room.component';
import { RoomAvatarInfoComponent } from '../room/widgets/avatarinfo/components/main/main.component';
import { RoomChatInputComponent } from '../room/widgets/chatinput/component';
import { ChooserWidgetFurniComponent } from '../room/widgets/choosers/furni/furni.component';
import { ChooserWidgetUserComponent } from '../room/widgets/choosers/user/user.component';
import { FriendRequestMainComponent } from '../room/widgets/friendrequest/components/main/main.component';
import { BackgroundColorFurniWidget } from '../room/widgets/furniture/backgroundcolor/backgroundcolor.component';
import { FurnitureContextMenuWidget } from '../room/widgets/furniture/context-menu/components/main/main.component';
import { FurnitureWidgetCreditComponent } from '../room/widgets/furniture/credit/credit.component';
import { CustomStackHeightComponent } from '../room/widgets/furniture/customstackheight/customstackheight.component';
import { DimmerFurniComponent } from '../room/widgets/furniture/dimmer/dimmer.component';
import { FriendsFurniConfirmWidget } from '../room/widgets/furniture/friendfurni/confirm.component';
import { FriendFurniEngravingWidget } from '../room/widgets/furniture/friendfurni/friendfurni.component';
import { PresentFurniWidget } from '../room/widgets/furniture/gift-opening/present.component';
import { HighscoreComponent } from '../room/widgets/furniture/highscore/highscore.component';
import { MannequinWidget } from '../room/widgets/furniture/mannequin/mannequin.component';
import { StickieFurniComponent } from '../room/widgets/furniture/stickies/stickie.component';
import { FurnitureWidgetTrophyComponent } from '../room/widgets/furniture/trophies/trophy.component';
import { RoomInfoStandMainComponent } from '../room/widgets/infostand/components/main/main.component';
import { DoorbellWidgetComponent } from '../room/widgets/navigator/doorbell/doorbell.component';
import { RoomChatComponent } from '../room/widgets/roomchat/component';
import { RoomToolsMainComponent } from '../room/widgets/roomtools/main/main.component';

@Component({
    selector: 'nitro-main-component',
    templateUrl: './main.template.html',
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ top: '-100%' }),
                        animate('1s ease-out',
                            style({ top: 0 }))
                    ]
                )
            ]
        )
    ]
})
export class MainComponent implements OnInit, OnDestroy, AfterContentInit, ILinkEventTracker
{
    @ViewChild(RoomComponent)
    public roomComponent: RoomComponent = null;

    private _landingViewVisible: boolean = true;

    constructor(
        private _notificationService: NotificationService,
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this.onRoomEngineEvent          = this.onRoomEngineEvent.bind(this);
        this.onInterstitialEvent        = this.onInterstitialEvent.bind(this);
        this.onRoomEngineObjectEvent    = this.onRoomEngineObjectEvent.bind(this);
        this.onRoomSessionEvent         = this.onRoomSessionEvent.bind(this);
        this.onRoomErrorEvent           = this.onRoomErrorEvent.bind(this);
        Nitro.instance.addLinkEventTracker(this);
    }

    public ngOnInit(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(Nitro.instance.roomEngine.events)
            {
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.ENGINE_INITIALIZED, this.onInterstitialEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.OBJECTS_INITIALIZED, this.onInterstitialEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.NORMAL_MODE, this.onInterstitialEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.GAME_MODE, this.onInterstitialEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomZoomEvent.ROOM_ZOOM, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomBackgroundColorEvent.ROOM_COLOR, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineDimmerStateEvent.ROOM_COLOR, this.onRoomEngineEvent);

                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.DESELECTED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.ADDED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.REQUEST_MOVE, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.REQUEST_ROTATE, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.MOUSE_ENTER, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.MOUSE_LEAVE, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_TROPHY, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_CREDITFURNI, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomObjectWidgetRequestEvent.OPEN_FURNI_CONTEXT_MENU, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_STICKIE, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_DIMMER, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_PRESENT, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, this.onRoomEngineObjectEvent);
            }

            if(Nitro.instance.roomSessionManager.events)
            {
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ROOM_DATA, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionChatEvent.CHAT_EVENT, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionChatEvent.FLOOD_EVENT, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionDanceEvent.RSDE_DANCE, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionUserBadgesEvent.RSUBE_BADGES, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionDoorbellEvent.DOORBELL, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionDoorbellEvent.RSDE_REJECTED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionDoorbellEvent.RSDE_ACCEPTED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionDimmerPresetsEvent.ROOM_DIMMER_PRESETS, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionPresentEvent.RSPE_PRESENT_OPENED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_KICKED, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_MAX_PETS, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_HOTEL, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_FLAT, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_BOT_LIMIT_REACHED, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_BOT, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionErrorMessageEvent.RSEME_BOT_NAME_NOT_ACCEPTED, this.onRoomErrorEvent);
            }
        });
    }

    public ngOnDestroy(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(Nitro.instance.roomEngine.events)
            {
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.ENGINE_INITIALIZED, this.onInterstitialEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.OBJECTS_INITIALIZED, this.onInterstitialEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.NORMAL_MODE, this.onInterstitialEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.GAME_MODE, this.onInterstitialEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomZoomEvent.ROOM_ZOOM, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomBackgroundColorEvent.ROOM_COLOR, this.onRoomEngineEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineDimmerStateEvent.ROOM_COLOR, this.onRoomEngineEvent);

                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.DESELECTED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.ADDED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.REQUEST_MOVE, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.REQUEST_ROTATE, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.MOUSE_ENTER, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.MOUSE_LEAVE, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_TROPHY, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_CREDITFURNI, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomObjectWidgetRequestEvent.OPEN_FURNI_CONTEXT_MENU, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_STICKIE, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_DIMMER, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_PRESENT, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY, this.onRoomEngineObjectEvent);
                Nitro.instance.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY, this.onRoomEngineObjectEvent);
            }

            if(Nitro.instance.roomSessionManager.events)
            {
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.ROOM_DATA, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionChatEvent.CHAT_EVENT, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionDanceEvent.RSDE_DANCE, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionUserBadgesEvent.RSUBE_BADGES, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionDoorbellEvent.DOORBELL, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionDoorbellEvent.RSDE_REJECTED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionDoorbellEvent.RSDE_ACCEPTED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionDimmerPresetsEvent.ROOM_DIMMER_PRESETS, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionPresentEvent.RSPE_PRESENT_OPENED, this.onRoomSessionEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_KICKED, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_MAX_PETS, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_HOTEL, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_FLAT, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_BOT_LIMIT_REACHED, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_BOT, this.onRoomErrorEvent);
                Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionErrorMessageEvent.RSEME_BOT_NAME_NOT_ACCEPTED, this.onRoomErrorEvent);
            }
        });

        Nitro.instance.removeLinkEventTracker(this);
    }

    public ngAfterContentInit(): void
    {
        Nitro.instance.communication.connection.onReady();
    }

    private onRoomEngineEvent(event: RoomEngineEvent): void
    {
        if(!event) return;

        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        const session = Nitro.instance.roomSessionManager.getSession(event.roomId);

        if(!session) return;

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                if(this.roomComponent)
                {
                    this.roomComponent.prepareRoom(session);

                    Nitro.instance.roomEngine.setActiveRoomId(event.roomId);

                    this.roomComponent.createWidget(RoomWidgetEnum.CHAT_WIDGET, RoomChatComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.INFOSTAND, RoomInfoStandMainComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.LOCATION_WIDGET, null);
                    this.roomComponent.createWidget(RoomWidgetEnum.INTERNAL_LINK, null);
                    this.roomComponent.createWidget(RoomWidgetEnum.ROOM_LINK, null);
                    this.roomComponent.createWidget(RoomWidgetEnum.CUSTOM_STACK_HEIGHT, CustomStackHeightComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.ROOM_DIMMER, DimmerFurniComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.FURNI_STICKIE_WIDGET, StickieFurniComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.DOORBELL, DoorbellWidgetComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.FURNI_TROPHY_WIDGET, FurnitureWidgetTrophyComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.FURNI_CREDIT_WIDGET, FurnitureWidgetCreditComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.FURNITURE_CONTEXT_MENU, FurnitureContextMenuWidget);
                    this.roomComponent.createWidget(RoomWidgetEnum.ROOM_BACKGROUND_COLOR, BackgroundColorFurniWidget);
                    this.roomComponent.createWidget(RoomWidgetEnum.FRIEND_FURNI_CONFIRM, FriendsFurniConfirmWidget);
                    this.roomComponent.createWidget(RoomWidgetEnum.FRIEND_FURNI_ENGRAVING, FriendFurniEngravingWidget);
                    this.roomComponent.createWidget(RoomWidgetEnum.ROOM_TOOLS, RoomToolsMainComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.MANNEQUIN, MannequinWidget);
                    this.roomComponent.createWidget(RoomWidgetEnum.FURNI_PRESENT_WIDGET, PresentFurniWidget);
                    this.roomComponent.createWidget(RoomWidgetEnum.FRIEND_REQUEST, FriendRequestMainComponent);
                    this.roomComponent.createWidget(RoomWidgetEnum.HIGH_SCORE_DISPLAY, HighscoreComponent);

                    if(!this.roomComponent.roomSession.isSpectator)
                    {
                        this.roomComponent.createWidget(RoomWidgetEnum.CHAT_INPUT_WIDGET, RoomChatInputComponent);
                        this.roomComponent.createWidget(RoomWidgetEnum.AVATAR_INFO, RoomAvatarInfoComponent);
                        this.roomComponent.createWidget(RoomWidgetEnum.FURNI_CHOOSER, ChooserWidgetFurniComponent);
                        this.roomComponent.createWidget(RoomWidgetEnum.USER_CHOOSER, ChooserWidgetUserComponent);
                    }
                }
                return;
            case RoomEngineEvent.DISPOSED:
                if(this.roomComponent) this.roomComponent.endRoom();
                return;
            case RoomZoomEvent.ROOM_ZOOM: {
                const zoomEvent = (event as RoomZoomEvent);

                let zoomLevel = ((zoomEvent.level < 1) ? 0.5 : (1 << (Math.floor(zoomEvent.level) - 1)));

                if(zoomEvent.forceFlip || zoomEvent.asDelta) zoomLevel = zoomEvent.level;

                if(this.roomComponent) Nitro.instance.roomEngine.setRoomInstanceRenderingCanvasScale(this.roomComponent.roomSession.roomId, this.roomComponent.getFirstCanvasId(), zoomLevel, null, null, false, zoomEvent.asDelta);

                return;
            }
            case RoomBackgroundColorEvent.ROOM_COLOR:
                if(this.roomComponent)
                {
                    const colorEvent = (event as RoomBackgroundColorEvent);

                    if(colorEvent.bgOnly)
                    {
                        this.roomComponent.setRoomColorizerColor(0xFF0000, 0xFF);
                    }
                    else
                    {
                        this.roomComponent.setRoomColorizerColor(colorEvent.color, colorEvent.brightness);
                    }
                }
                return;
            case RoomEngineDimmerStateEvent.ROOM_COLOR:
                if(this.roomComponent) this.roomComponent._Str_2485(event);
                return;
            case RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR:
                if(this.roomComponent)
                {
                    const hslColorEvent = (event as RoomObjectHSLColorEnabledEvent);

                    if(hslColorEvent.enable) this.roomComponent.setRoomBackgroundColor(hslColorEvent.hue, hslColorEvent.saturation, hslColorEvent.lightness);
                    else this.roomComponent.setRoomBackgroundColor(0, 0, 0);
                }
                return;
        }
    }

    private onInterstitialEvent(event: RoomEngineEvent): void
    {
        if(!event) return;

        if((event.type !== RoomEngineEvent.GAME_MODE) && (event.type !== RoomEngineEvent.NORMAL_MODE)) return;

        this.roomComponent && this.roomComponent.onRoomEngineEvent(event);
    }

    public onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        (this.roomComponent && this.roomComponent.onRoomEngineObjectEvent(event));
    }

    private onRoomErrorEvent(event: RoomSessionEvent):void
    {
        if(!event) return;

        let errorMessage: string;
        let errorTitle = '${error.title}';

        switch(event.type)
        {
            case RoomSessionErrorMessageEvent.RSEME_MAX_PETS:
                errorMessage = '${room.error.max_pets}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS:
                errorMessage = '${room.error.max_own_pets}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_KICKED:
                errorMessage = '${room.error.kicked}';
                errorTitle = '${generic.alert.title}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL:
                errorMessage = '${room.error.pets.forbidden_in_hotel}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT:
                errorMessage = '${room.error.pets.forbidden_in_flat}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET:
                errorMessage = '${room.error.pets.no_free_tiles}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET:
                errorMessage = '${room.error.pets.selected_tile_not_free}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_HOTEL:
                errorMessage = '${room.error.bots.forbidden_in_hotel}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_FLAT:
                errorMessage = '${room.error.bots.forbidden_in_flat}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_BOT_LIMIT_REACHED:
                errorMessage = '${room.error.max_bots}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_BOT:
                errorMessage = '${room.error.bots.selected_tile_not_free}';
                break;
            case RoomSessionErrorMessageEvent.RSEME_BOT_NAME_NOT_ACCEPTED:
                errorMessage = '${room.error.bots.name.not.accepted}';
                break;
            default:
                return;
        }

        this._notificationService.alert(errorMessage, errorTitle);
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                this._ngZone.run(() =>
                {
                    this._landingViewVisible = false;
                });

                Nitro.instance.roomSessionManager.startSession(event.session);
                return;
            case RoomSessionEvent.STARTED:
                return;
            case RoomSessionEvent.ROOM_DATA:
                return;
            case RoomSessionEvent.ENDED:
                if(this.roomComponent) this.roomComponent.endRoom();

                this._ngZone.run(() =>
                {
                    this._landingViewVisible = event.openLandingView;
                });
                return;
            default:
                (this.roomComponent && this.roomComponent.processEvent(event));
                return;
        }
    }

    public linkReceived(link: string): void
    {
        const parts = link.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'open':
                if(parts.length > 2)
                {
                    switch(parts[2])
                    {
                        case 'credits':
                            //HabboWebTools.openWebPageAndMinimizeClient(this._windowManager.getProperty(ExternalVariables.WEB_SHOP_RELATIVE_URL));
                            break;
                        default: {
                            const name = parts[2];
                            HabboWebTools.openHabblet(name);
                        }
                    }
                }
                return;
        }
    }

    public get eventUrlPrefix(): string
    {
        return 'habblet';
    }

    public get landingViewVisible(): boolean
    {
        return this._landingViewVisible;
    }

    public get avatarEditorVisible(): boolean
    {
        return this._settingsService.avatarEditorVisible;
    }

    public get catalogVisible(): boolean
    {
        return this._settingsService.catalogVisible;
    }

    public get navigatorVisible(): boolean
    {
        return this._settingsService.navigatorVisible;
    }

    public get inventoryVisible(): boolean
    {
        return this._settingsService.inventoryVisible;
    }

    public get friendListVisible(): boolean
    {
        return this._settingsService.friendListVisible;
    }

    public get achievementsVisible(): boolean
    {
        return this._settingsService.achievementsVisible;
    }

    public get chatHistoryVisible(): boolean
    {
        return this._settingsService.chatHistoryVisible;
    }

    public get modToolVisible(): boolean
    {
        return Nitro.instance.sessionDataManager.isModerator;
    }

    public get userSettingsVisible(): boolean
    {
        return this._settingsService.userSettingsVisible;
    }
}
