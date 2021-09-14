import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigatorCategoryDataParser } from '@nitrots/nitro-renderer';
import RoomSettings from '../../common/RoomSettings';

@Component({
    selector: 'nitro-navigator-roomsettings-tab-basic-component',
    templateUrl: './roomsettings-tab-basic.template.html'
})
export class NavigatorRoomSettingsTabBasicComponent
{
    @Input()
    public roomSettings: RoomSettings;

    @Input()
    public categories: NavigatorCategoryDataParser[];

    @Input()
    public maxVisitors: number[];

    @Input()
    public tradeSettings: string[];

    @Output()
    onSave: EventEmitter<any> = new EventEmitter();

    @Output()
    onDeleteRoom: EventEmitter<any> = new EventEmitter();

    constructor()
    {}

    save(): void
    {
        this.onSave.emit(this.roomSettings);
    }

    deleteRoom(): void
    {
        this.onDeleteRoom.emit();
    }
}
