import { Component, EventEmitter, Input, Output } from '@angular/core';
import RoomSettings from '../../common/RoomSettings';

@Component({
    selector: 'nitro-navigator-roomsettings-tab-access-component',
    templateUrl: './roomsettings-tab-access.template.html'
})
export class NavigatorRoomSettingsTabAccessComponent
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