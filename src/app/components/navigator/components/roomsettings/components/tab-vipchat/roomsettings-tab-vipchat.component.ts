import { Component, EventEmitter, Input, Output } from '@angular/core';
import RoomSettings from '../../common/RoomSettings';

@Component({
    selector: 'nitro-navigator-roomsettings-tab-vipchat-component',
    templateUrl: './roomsettings-tab-vipchat.template.html'
})
export class NavigatorRoomSettingsTabVipChatComponent
{
    @Input()
    public roomSettings: RoomSettings;

    @Output()
    onSave: EventEmitter<any> = new EventEmitter();

    constructor()
    {}

    save(): void
    {
        this.onSave.emit(this.roomSettings);
    }
}