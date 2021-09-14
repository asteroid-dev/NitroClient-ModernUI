import { ChangeDetectorRef, Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { HabboClubLevelEnum, Nitro, RoomControllerLevel } from '@nitrots/nitro-renderer';

@Component({
    selector: 'nitro-room-chatinput-styleselector-component',
    template: `
    <div class="nitro-room-chatinput-styleselector-component">
        <i class="icon chatstyles-icon" (click)="toggleSelector()"></i>
        <svg (click)="toggleSelector()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="m-bubble-select-box bi bi-chat-square-dots-fill" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
        </svg>
        <div [bringToTop] class="nitro-chatstyle-selector bubble-kullan" [ngClass]="{ 'active': showStyles }">
            <div class="esb-header">Hotel Bubble</div>
            <div class="bubbleBottom"></div>
            <div class="bubble-listesi"> 
                <div id="chatbubble_icon" *ngFor="let styleId of styleIds" class="bubble-sec" [ngClass]="[ ((lastSelectedId === styleId) ? 'slm' : '') ]">
                    <div class="bubble-container" style="height: 40px;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 6px;    position: relative;visibility: unset;">
                        <div class="chat-bubble bubble-{{ styleId }}" (click)="selectStyle(styleId)" style="background-position: center;background-repeat: no-repeat;width: 50px;">&nbsp;</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class RoomChatInputStyleSelectorComponent implements OnInit, OnDestroy
{
    @Output()
    public styleSelected = new EventEmitter<number>();

    public showStyles           = false;
    public lastSelectedId       = 0;
    public styleIds: number[]   = [];

    constructor(
        private changeDetector: ChangeDetectorRef,
        private ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        this.lastSelectedId = Nitro.instance.sessionDataManager.chatStyle;

        const styles = Nitro.instance.getConfiguration<{ styleId: number, minRank: number, isSystemStyle: boolean, isHcOnly: boolean, isAmbassadorOnly: boolean }[]>('chat.styles');

        for(const style of styles)
        {
            if(!style) continue;

            if(style.minRank > 0)
            {
                if(Nitro.instance.sessionDataManager.hasSecurity(style.minRank)) this.styleIds.push(style.styleId);

                continue;
            }

            if(style.isSystemStyle)
            {
                if(Nitro.instance.sessionDataManager.hasSecurity(RoomControllerLevel.MODERATOR))
                {
                    this.styleIds.push(style.styleId);

                    continue;
                }
            }

            if(Nitro.instance.getConfiguration<number[]>('chat.styles.disabled').indexOf(style.styleId) >= 0) continue;

            if(style.isHcOnly && (Nitro.instance.sessionDataManager.clubLevel >= HabboClubLevelEnum.CLUB))
            {
                this.styleIds.push(style.styleId);

                continue;
            }

            if(style.isAmbassadorOnly && Nitro.instance.sessionDataManager.isAmbassador)
            {
                this.styleIds.push(style.styleId);

                continue;
            }

            if(!style.isHcOnly && !style.isAmbassadorOnly) this.styleIds.push(style.styleId);
        }
    }

    public ngOnDestroy(): void
    {
        this.hideSelector();
    }

    private showSelector(): void
    {
        this.showStyles = true;

        //this.ngZone.runOutsideAngular(() => document.body.addEventListener('click', this.onOutsideClick.bind(this)));
    }

    private hideSelector(): void
    {
        this.showStyles = false;

        //this.ngZone.runOutsideAngular(() => document.body.removeEventListener('click', this.onOutsideClick.bind(this)));
    }

    public toggleSelector(): void
    {
        if(this.showStyles)
        {
            this.hideSelector();

            return;
        }

        this.showSelector();
    }

    public selectStyle(styleId: number): void
    {
        this.lastSelectedId = styleId;
        this.styleSelected.emit(styleId);

        this.hideSelector();
    }
}
