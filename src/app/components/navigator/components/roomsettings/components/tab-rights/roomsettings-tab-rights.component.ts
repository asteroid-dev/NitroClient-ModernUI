import { Component, EventEmitter, Input, Output } from '@angular/core';
import RoomSettings from '../../common/RoomSettings';

@Component({
    selector: 'nitro-navigator-roomsettings-tab-rights-component',
    templateUrl: './roomsettings-tab-rights.template.html'
})
export class NavigatorRoomSettingsTabRightsComponent
{
    @Input()
    public roomSettings: RoomSettings;

    @Output()
    onSave: EventEmitter<any> = new EventEmitter();

    @Output()
    onGiveRights: EventEmitter<any> = new EventEmitter();

    @Output()
    onTakeRights: EventEmitter<any> = new EventEmitter();

    @Output()
    onOpenProfile: EventEmitter<any> = new EventEmitter();

    constructor()
    {}

    save(): void
    {
        this.onSave.emit(this.roomSettings);
    }

    giveRights(userId: number): void
    {
        this.onGiveRights.emit(userId);
    }

    takeRights(userId: number): void
    {
        this.onTakeRights.emit(userId);
    }

    openProfile(userId: number): void
    {
        this.onOpenProfile.emit(userId);
    }
}