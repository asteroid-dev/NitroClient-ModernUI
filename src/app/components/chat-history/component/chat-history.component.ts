import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Nitro, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { SettingsService } from '../../../core/settings/service';
import { ChatHistoryItem } from '../common/ChatHistoryItem';
import { ChatHistorySet } from '../common/ChatHistorySet';
import { ChatHistoryService } from '../services/chat-history.service';

@Component({
    selector: 'nitro-chat-history-component',
    templateUrl: './chat-history.template.html'
})
export class ChatHistoryComponent implements OnChanges
{
    @ViewChild('historyScroller')
    public historyScroller: PerfectScrollbarComponent;

    @Input()
    public visible: boolean;

    constructor(
        private _settingsService: SettingsService,
        private _chatHistoryService: ChatHistoryService)
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev  = changes.visible.previousValue;
        const next  = changes.visible.currentValue;

        if(next && (next !== prev))
        {
            setTimeout(() => this.scrollToBottom(), 1);
        }
    }

    public hide(): void
    {
        this._settingsService.hideChatHistory();
    }

    public selectUser(userId: number | null): void
    {
        if(!userId) return;

        const currentRoomId = Nitro.instance.roomEngine.activeRoomId;
        Nitro.instance.roomEngine.selectRoomObject(currentRoomId, userId, RoomObjectCategory.UNIT);
    }

    public trackById(index: number, item: ChatHistorySet | ChatHistoryItem): number
    {
        return item.id;
    }

    private scrollToBottom(): void
    {
        if(!this.historyScroller) return;

        this.historyScroller.directiveRef.scrollToBottom(0);
    }

    public get historyItems(): ChatHistoryItem[]
    {
        return this._chatHistoryService.historyItems;
    }
}
