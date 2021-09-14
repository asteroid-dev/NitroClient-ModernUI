import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { CantConnectMessageParser, ConvertGlobalRoomIdMessageComposer, DesktopViewComposer, GenericErrorEvent, HabboWebTools, ILinkEventTracker, IMessageEvent, LegacyExternalInterface, NavigatorCategoriesComposer, NavigatorCategoriesEvent, NavigatorCategoryDataParser, NavigatorCollapsedEvent, NavigatorEventCategoriesEvent, NavigatorHomeRoomEvent, NavigatorInitComposer, NavigatorLiftedEvent, NavigatorMetadataEvent, NavigatorOpenRoomCreatorEvent, NavigatorSearchComposer, NavigatorSearchesEvent, NavigatorSearchEvent, NavigatorSearchResultList, NavigatorSettingsComposer, NavigatorSettingsEvent, NavigatorTopLevelContext, Nitro, NitroToolbarEvent, RoomCreatedEvent, RoomDataParser, RoomDoorbellAcceptedEvent, RoomDoorbellEvent, RoomDoorbellRejectedEvent, RoomEnterErrorEvent, RoomForwardEvent, RoomInfoComposer, RoomInfoEvent, RoomInfoOwnerEvent, RoomScoreEvent, RoomSessionEvent, RoomSettingsUpdatedEvent, ToolbarIconEnum, UserInfoEvent } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../core/settings/service';
import { NotificationService } from '../../notification/services/notification.service';
import { NavigatorData } from '../common/NavigatorData';
import { NavigatorMainComponent } from '../components/main/main.component';
import { INavigatorSearchFilter } from '../components/search/INavigatorSearchFilter';

@Injectable()
export class NavigatorService implements OnDestroy, ILinkEventTracker
{
    public static SEARCH_FILTERS: INavigatorSearchFilter[] = [
        {
            name: 'anything',
            query: null
        },
        {
            name: 'room.name',
            query: 'roomname'
        },
        {
            name: 'owner',
            query: 'owner'
        },
        {
            name: 'tag',
            query: 'tag'
        },
        {
            name: 'group',
            query: 'group'
        }
    ];

    private static MAX_VISITOR_STEPPER: number = 10;
    private static MAX_VISITOR_INCREMENTOR: number = 5;

    private _component: NavigatorMainComponent;
    private _topLevelContexts: NavigatorTopLevelContext[];
    private _topLevelContext: NavigatorTopLevelContext;
    private _categories: NavigatorCategoryDataParser[];
    private _filter: INavigatorSearchFilter;
    private _lastSearchResults: NavigatorSearchResultList[];
    private _lastSearch: string;
    private _data: NavigatorData;

    private _roomInfoShowing: boolean = false;

    private _tradeSettings: string[];

    private _homeRoomId: number;

    private _messages: IMessageEvent[] = [];

    private _isSearching: boolean;
    private _isLoaded: boolean;
    private _isLoading: boolean;

    constructor(
        private _notificationService: NotificationService,
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this._component         = null;
        this._topLevelContexts  = [];
        this._topLevelContext   = null;
        this._categories        = [];
        this._filter            = NavigatorService.SEARCH_FILTERS[0];
        this._lastSearchResults = [];
        this._lastSearch        = '';
        this._data              = new NavigatorData();

        this._tradeSettings     = [];

        this._homeRoomId        = -1;

        this._isSearching       = false;
        this._isLoaded          = false;
        this._isLoading         = false;

        this.onRoomSessionEvent = this.onRoomSessionEvent.bind(this);

        this.setTradeSettings();

        this.registerMessages();

        Nitro.instance.addLinkEventTracker(this);

        if(LegacyExternalInterface.available)
        {
            LegacyExternalInterface.addCallback(HabboWebTools.OPENROOM, this.enterRoomWebRequest);
        }
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();

        Nitro.instance.removeLinkEventTracker(this);
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent);

            this._messages = [
                new UserInfoEvent(this.onUserInfoEvent.bind(this)),
                new RoomForwardEvent(this.onRoomForwardEvent.bind(this)),
                new RoomInfoOwnerEvent(this.onRoomInfoOwnerEvent.bind(this)),
                new RoomInfoEvent(this.onRoomInfoEvent.bind(this)),
                new RoomEnterErrorEvent(this.onRoomEnterErrorEvent.bind(this)),
                new RoomCreatedEvent(this.onRoomCreatedEvent.bind(this)),
                new RoomDoorbellEvent(this.onRoomDoorbellEvent.bind(this)),
                new RoomDoorbellAcceptedEvent(this.onRoomDoorbellAcceptedEvent.bind(this)),
                new RoomScoreEvent(this.onRoomScoreEvent.bind(this)),
                new RoomSettingsUpdatedEvent(this.onRoomSettingsUpdatedEvent.bind(this)),
                new GenericErrorEvent(this.onGenericErrorEvent.bind(this)),
                new RoomDoorbellRejectedEvent(this.onRoomDoorbellRejectedEvent.bind(this)),
                new NavigatorCategoriesEvent(this.onNavigatorCategoriesEvent.bind(this)),
                new NavigatorCollapsedEvent(this.onNavigatorCollapsedEvent.bind(this)),
                new NavigatorEventCategoriesEvent(this.onNavigatorEventCategoriesEvent.bind(this)),
                new NavigatorLiftedEvent(this.onNavigatorLiftedEvent.bind(this)),
                new NavigatorMetadataEvent(this.onNavigatorMetadataEvent.bind(this)),
                new NavigatorOpenRoomCreatorEvent(this.onNavigatorOpenRoomCreatorEvent.bind(this)),
                new NavigatorSearchesEvent(this.onNavigatorSearchesEvent.bind(this)),
                new NavigatorSearchEvent(this.onNavigatorSearchEvent.bind(this)),
                new NavigatorSettingsEvent(this.onNavigatorSettingsEvent.bind(this)),
                new NavigatorHomeRoomEvent(this.onNavigatorHomeRoomEvent.bind(this)),
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent);

            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                this._ngZone.run(() => this._settingsService.hideNavigator());
                return;
        }
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        Nitro.instance.communication.connection.send(new NavigatorCategoriesComposer());
        Nitro.instance.communication.connection.send(new NavigatorSettingsComposer());
    }

    private onRoomForwardEvent(event: RoomForwardEvent): void
    {
        if(!(event instanceof RoomForwardEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        Nitro.instance.communication.connection.send(new RoomInfoComposer(parser.roomId, false, true));
    }

    private onRoomInfoOwnerEvent(event: RoomInfoOwnerEvent): void
    {
        if(!(event instanceof RoomInfoOwnerEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._data.currentRoomOwner = false;
            this._data.currentRoomOwner = parser.isOwner;
            this._data.currentRoomId    = parser.roomId;
        });

        Nitro.instance.communication.connection.send(new RoomInfoComposer(parser.roomId, true, false));

        LegacyExternalInterface.call('legacyTrack', 'navigator', 'private', [ parser.roomId ]);
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if(!(event instanceof RoomInfoEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            if(parser.roomEnter)
            {
                this._data.enteredGuestRoom = parser.data;
                this._data.staffPick        = parser.data.roomPicker;

                const isCreatedRoom = (this._data.createdRoomId === parser.data.roomId);

                if(!isCreatedRoom && parser.data.displayRoomEntryAd)
                {
                    // display ad
                }

                this._data.createdRoomId = 0;
            }
            else
            {
                if(parser.roomForward)
                {
                    if((parser.data.ownerName !== Nitro.instance.sessionDataManager.userName) && !parser.isGroupMember)
                    {
                        switch(parser.data.doorMode)
                        {
                            case RoomDataParser.DOORBELL_STATE:
                                this.openRoomDoorbell(parser.data);
                                return;
                            case RoomDataParser.PASSWORD_STATE:
                                this.openRoomPassword(parser.data);
                                return;
                        }
                    }

                    this.goToRoom(parser.data.roomId);
                }
                else
                {
                    this._data.enteredGuestRoom = parser.data;
                    this._data.staffPick        = parser.data.roomPicker;
                }
            }
        });
    }

    private onRoomEnterErrorEvent(event: RoomEnterErrorEvent): void
    {
        if(!(event instanceof RoomEnterErrorEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            switch(parser.reason)
            {
                case CantConnectMessageParser.REASON_FULL:
                    this._notificationService.alert('${navigator.guestroomfull.text}', '${navigator.guestroomfull.title}');
                    break;
                case CantConnectMessageParser.REASON_QUEUE_ERROR:
                    this._notificationService.alert('${room.queue.error. ' + parser.parameter + '}', '${room.queue.error.title}');
                    break;
                case CantConnectMessageParser.REASON_BANNED:
                    this._notificationService.alert('${navigator.banned.text}', '${navigator.banned.title}');
                    break;
                default:
                    this._notificationService.alert('${room.queue.error.title}', '${room.queue.error.title}');
                    break;
            }
        });

        Nitro.instance.communication.connection.send(new DesktopViewComposer());

        const toolbarEvent = new NitroToolbarEvent(NitroToolbarEvent.TOOLBAR_CLICK);

        toolbarEvent.iconName = ToolbarIconEnum.HOTEL_VIEW;

        Nitro.instance.roomEngine.events.dispatchEvent(toolbarEvent);
    }

    private onRoomCreatedEvent(event: RoomCreatedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._data.createdRoomId    = parser.roomId;
            this._roomInfoShowing       = false;
        });

        this.goToRoom(parser.roomId);
    }

    private onRoomDoorbellEvent(event: RoomDoorbellEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.userName || (parser.userName.length === 0))
        {
            this._ngZone.run(() => (this._component && this._component.openRoomDoorbell(null, true)));
        }
    }

    private onRoomDoorbellAcceptedEvent(event: RoomDoorbellAcceptedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.userName || (parser.userName.length === 0))
        {
            this._ngZone.run(() => (this._component && this._component.closeRoomDoorbell()));
        }
    }

    private onRoomScoreEvent(event: RoomScoreEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => (this._data.canRate = parser.canLike));
    }

    private onRoomSettingsUpdatedEvent(event: RoomSettingsUpdatedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        Nitro.instance.communication.connection.send(new RoomInfoComposer(parser.roomId, false, false));
    }

    private onGenericErrorEvent(event: GenericErrorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        switch(parser.errorCode)
        {
            case -100002:
                this._ngZone.run(() => (this._component && this._component.openRoomPassword(null, true)));
                break;
            case 4009:
                this._notificationService.alert('${navigator.alert.need.to.be.vip}', '${generic.alert.title}');
                break;
            case 4010:
                this._notificationService.alert('${navigator.alert.invalid_room_name}', '${generic.alert.title}');
                break;
            case 4011:
                this._notificationService.alert('${navigator.alert.cannot_perm_ban}', '${generic.alert.title}');
                break;
            case 4013:
                this._notificationService.alert('${navigator.alert.room_in_maintenance}', '${generic.alert.title}');
                break;
        }
    }


    private onRoomDoorbellRejectedEvent(event: RoomDoorbellRejectedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.userName || (parser.userName.length === 0))
        {
            this._ngZone.run(() => (this._component && this._component.openRoomDoorbell(null, false, true)));
        }
    }

    private onNavigatorCategoriesEvent(event: NavigatorCategoriesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this._categories = parser.categories);
    }

    private onNavigatorCollapsedEvent(event: NavigatorCollapsedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onNavigatorEventCategoriesEvent(event: NavigatorEventCategoriesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onNavigatorLiftedEvent(event: NavigatorLiftedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onNavigatorMetadataEvent(event: NavigatorMetadataEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._topLevelContexts = parser.topLevelContexts;

            if(this._topLevelContexts.length > 0) this.setCurrentContext(this._topLevelContexts[0]);

            this.clearSearch();
        });
    }

    private onNavigatorOpenRoomCreatorEvent(event: NavigatorOpenRoomCreatorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!this._component) return;

        this._ngZone.run(() => this._component.openRoomCreator());
    }

    private onNavigatorSearchesEvent(event: NavigatorSearchesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onNavigatorSearchEvent(event: NavigatorSearchEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const resultSet = parser.result;

        if(!resultSet) return;

        this._ngZone.run(() =>
        {
            this.setCurrentContextByCode(resultSet.code);

            this._lastSearchResults = resultSet.results;
            this._isSearching       = false;
        });
    }

    private onNavigatorSettingsEvent(event: NavigatorSettingsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onNavigatorHomeRoomEvent(event: NavigatorHomeRoomEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._homeRoomId = parser.homeRoomId;
    }

    public getMaxVisitors(count: number): number[]
    {
        const maxVisitors = [];

        let i = NavigatorService.MAX_VISITOR_STEPPER;

        while(i <= count)
        {
            maxVisitors.push(i);

            i += NavigatorService.MAX_VISITOR_INCREMENTOR;
        }

        return maxVisitors;
    }

    private setTradeSettings(): void
    {
        this._tradeSettings = [];

        this._tradeSettings.push(...[
            '${navigator.roomsettings.trade_not_allowed}',
            '${navigator.roomsettings.trade_not_with_Controller}',
            '${navigator.roomsettings.trade_allowed}'
        ]);
    }

    public goToRoom(roomId: number, password: string = null): void
    {
        Nitro.instance.roomSessionManager.createSession(roomId, password);
    }

    public goToPrivateRoom(roomId: number): void
    {
        Nitro.instance.communication.connection.send(new RoomInfoComposer(roomId, false, true));
    }

    public goToHomeRoom(): boolean
    {
        if(this._homeRoomId < 1) return false;

        this.goToRoom(this._homeRoomId);

        return true;
    }

    public getContextByCode(code: string): NavigatorTopLevelContext
    {
        if(!code) return null;

        for(const context of this._topLevelContexts)
        {
            if(!context || (context.code !== code)) continue;

            return context;
        }

        return null;
    }

    public setCurrentContext(context: NavigatorTopLevelContext, search: boolean = true): void
    {
        if(!context || (this._topLevelContext === context)) return;

        this._topLevelContext = context;
    }

    public setCurrentContextByCode(code: string, search: boolean = true): void
    {
        if(!code) return;

        const topLevelContext = this.getContextByCode(code);

        if(!topLevelContext) return;

        this.setCurrentContext(topLevelContext, search);
    }

    public setCurrentFilter(filter: INavigatorSearchFilter): void
    {
        if(!filter || (this._filter === filter)) return;

        this._filter = filter;
    }

    public search(value: string = null): void
    {
        if(!this._topLevelContext || this._isSearching) return;

        if(!this._filter) this.setCurrentFilter(NavigatorService.SEARCH_FILTERS[0]);

        const query = ((this._filter && this._filter.query) ? this._filter.query + ':' : '');

        let search = value;

        if(search === null) search = this._lastSearch;

        this._lastSearch = (search || '');

        this.sendSearch(this._topLevelContext.code, (query + this._lastSearch));
    }

    public clearSearch(): void
    {
        this.setCurrentFilter(NavigatorService.SEARCH_FILTERS[0]);

        this._lastSearch = null;

        (this.isLoaded && this.search());
    }

    private sendSearch(code: string, query: string): void
    {
        if(!code) return;

        this._isSearching = true;

        this._ngZone.runOutsideAngular(() => Nitro.instance.communication.connection.send(new NavigatorSearchComposer(code, query)));
    }

    public loadNavigator(): void
    {
        this._ngZone.runOutsideAngular(() => Nitro.instance.communication.connection.send(new NavigatorInitComposer()));

        this._isLoaded = true;
    }

    public openRoomDoorbell(room: RoomDataParser): void
    {
        if(!room || !this._component) return;

        this._component.openRoomDoorbell(room);
    }

    public openRoomPassword(room: RoomDataParser): void
    {
        if(!room || !this._component) return;

        this._component.openRoomPassword(room);
    }

    public toggleRoomInfo(): void
    {
        this._roomInfoShowing = !this._roomInfoShowing;
    }

    public linkReceived(k: string):void
    {
        const parts = k.split('/');

        if(parts.length < 2) return;

        switch(parts[1])
        {
            case 'goto':
                if(parts.length > 2)
                {
                    switch(parts[2])
                    {
                        case 'home':
                            this.goToHomeRoom();
                            break;
                        default: {
                            const roomId = parseInt(parts[2]);

                            if(roomId > 0) this.goToPrivateRoom(roomId);
                        }
                    }
                }
                return;
        }
    }

    public enterRoomWebRequest(k: string, _arg_2:boolean=false, _arg_3:string=null)
    {
        //this._webRoomReport = _arg_2;
        //this._webRoomReportedName = _arg_3;
        Nitro.instance.communication.connection.send(new ConvertGlobalRoomIdMessageComposer(k));
    }

    public get eventUrlPrefix(): string
    {
        return 'navigator';
    }

    public get component(): NavigatorMainComponent
    {
        return this._component;
    }

    public set component(component: NavigatorMainComponent)
    {
        this._component = component;
    }

    public get topLevelContexts(): NavigatorTopLevelContext[]
    {
        return this._topLevelContexts;
    }

    public get topLevelContext(): NavigatorTopLevelContext
    {
        return this._topLevelContext;
    }

    public get categories(): NavigatorCategoryDataParser[]
    {
        return this._categories;
    }

    public get filter(): INavigatorSearchFilter
    {
        return this._filter;
    }

    public get lastSearch(): string
    {
        return this._lastSearch;
    }

    public set lastSearch(value: string)
    {
        this._lastSearch = value;
    }

    public get lastSearchResults(): NavigatorSearchResultList[]
    {
        return this._lastSearchResults;
    }

    public get isSearching(): boolean
    {
        return this._isSearching;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isLoading(): boolean
    {
        return this._isLoading;
    }

    public get tradeSettings(): string[]
    {
        return this._tradeSettings;
    }

    public get data(): NavigatorData
    {
        return this._data;
    }

    public get roomInfoShowing(): boolean
    {
        return this._roomInfoShowing;
    }

    public set roomInfoShowing(flag: boolean)
    {
        this._roomInfoShowing = flag;
    }
}
