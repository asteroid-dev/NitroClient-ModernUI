import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NavigatorSearchResultList, NavigatorTopLevelContext, Nitro, RoomDataParser } from '@nitrots/nitro-renderer';
import * as $ from "jquery";
import { SettingsService } from '../../../../core/settings/service';
import { NavigatorService } from '../../services/navigator.service';
import { NavigatorCreatorComponent } from '../creator/creator.component';
import { NavigatorDoorbellComponent } from '../doorbell/doorbell.component';
import { NavigatorPasswordComponent } from '../password/password.component';

@Component({
    selector: 'nitro-navigator-main-component',
    templateUrl: './main.template.html'
})
export class NavigatorMainComponent implements OnInit, OnChanges, OnDestroy
{
    @Input()
    public visible: boolean = false;

    private _lastRoom: RoomDataParser;
    private _roomCreatorModal: NgbModalRef;
    private _roomDoorbellModal: NgbModalRef;
    private _roomPasswordModal: NgbModalRef;

    constructor(
        private _settingsService: SettingsService,
        private _navigatorService: NavigatorService,
        private _modalService: NgbModal)
    {}

    public ngOnInit(): void
    {
        this._navigatorService.component = this;

        $(function(){
            let lastHeight = $(".modernnav").height();
            let lastWidth = $(".modernnav").width();
              
            function checkHeightChange() {
                let newHeight = $(".modernnav").height();
                let newWidth = $(".modernnav").width();
              
                if (lastHeight != newHeight || lastWidth != newWidth) {
                    console.log("Navigator resized");

                    $(".modernnav").height();
                    $(".modernnav-roomlist").css("height",`${$(".modernnav").height() - 213}px`);
                    
                   
                    lastHeight = newHeight;
                    lastWidth = newWidth; 
                 }
             }
              
            setInterval(checkHeightChange, 1);
        })
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(next && (next !== prev)) this.prepareNavigator();
    }

    public ngOnDestroy(): void
    {
        if(this._roomCreatorModal) this._roomCreatorModal.close();

        this._navigatorService.component = null;
    }

    private prepareNavigator(): void
    {
        if(!this._navigatorService.isLoaded)
        {
            this._navigatorService.loadNavigator();
        }
        else
        {
            this._navigatorService.search();
        }
    }

    public setCurrentContext(context: NavigatorTopLevelContext): void
    {
        this._navigatorService.setCurrentContext(context);

        this._navigatorService.clearSearch();
    }

    public hide(): void
    {
        this._settingsService.hideNavigator();

        //if(this._roomDoorbellModal) this._roomDoorbellModal.close();

        //if(this._roomPasswordModal) this._roomPasswordModal.close();
    }

    public openRoomCreator(): void
    {
        if(this._roomCreatorModal) return;

        this._roomCreatorModal = this._modalService.open(NavigatorCreatorComponent, {
            backdrop: 'static',
            size: 'lg',
            centered: true,
            keyboard: false
        });

        if(this._roomCreatorModal)
        {
            this._roomCreatorModal.result.then(() => (this._roomCreatorModal = null));
        }
    }

    public openRoomDoorbell(room: RoomDataParser, isWaiting: boolean = false, noAnswer: boolean = false): void
    {
        if(this._roomPasswordModal) this._roomPasswordModal.close();

        if(!room)
        {
            room = this._lastRoom;
        }

        this._lastRoom = room;

        let modal = this._roomDoorbellModal;

        if(!modal)
        {
            modal = this._roomDoorbellModal = this._modalService.open(NavigatorDoorbellComponent, {
                backdrop: 'static',
                size: 'sm',
                centered: true,
                keyboard: false
            });

            modal.result.then(() => (this._roomDoorbellModal = null));
        }

        this._roomDoorbellModal = modal;

        if(this._roomDoorbellModal)
        {
            const instance = (modal.componentInstance as NavigatorDoorbellComponent);

            if(instance)
            {
                instance.room       = room;
                instance.isWaiting  = isWaiting;
                instance.noAnswer   = noAnswer;
            }
        }
    }

    public closeRoomDoorbell(): void
    {
        if(!this._roomDoorbellModal) return;

        this._roomDoorbellModal.close();

        this._lastRoom = null;
    }

    public openRoomPassword(room: RoomDataParser, isWrongPassword: boolean = false): void
    {
        if(this._roomDoorbellModal) this._roomDoorbellModal.close();

        if(!room)
        {
            room = this._lastRoom;
        }

        this._lastRoom = room;

        let modal = this._roomPasswordModal;

        if(!modal)
        {
            modal = this._roomPasswordModal = this._modalService.open(NavigatorPasswordComponent, {
                backdrop: 'static',
                size: 'sm',
                centered: true,
                keyboard: false
            });

            modal.result.then(() => (this._roomPasswordModal = null));
        }

        this._roomPasswordModal = modal;

        if(this._roomPasswordModal)
        {
            const instance = (modal.componentInstance as NavigatorPasswordComponent);

            if(!instance) return;

            instance.room = room;
            instance.isWrongPassword = isWrongPassword;
        }
    }

    public closeRoomPassword(): void
    {
        if(!this._roomPasswordModal) return;

        this._roomPasswordModal.close();

        this._lastRoom = null;
    }

    public get topLevelContext(): NavigatorTopLevelContext
    {
        return ((this._navigatorService && this._navigatorService.topLevelContext) || null);
    }

    public get topLevelContexts(): NavigatorTopLevelContext[]
    {
        return ((this._navigatorService && this._navigatorService.topLevelContexts) || null);
    }

    public get lastSearchResults(): NavigatorSearchResultList[]
    {
        return this._navigatorService.lastSearchResults;
    }

    public get isLoading(): boolean
    {
        return (this._navigatorService && (this._navigatorService.isLoading || this._navigatorService.isSearching));
    }

    public get sliderVisible(): boolean
    {
        return Nitro.instance.core.configuration.getValue<boolean>('navigator.slider.enabled');
    }

    public get roomInfoShowing(): boolean
    {
        return this._navigatorService.roomInfoShowing;
    }
}
