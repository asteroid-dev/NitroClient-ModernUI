import { Component, EventEmitter, Input, Output } from '@angular/core';
import RoomSettings from '../../common/RoomSettings';

@Component({
    selector: 'nitro-navigator-roomsettings-tab-mod-component',
    templateUrl: './roomsettings-tab-mod.template.html'
})
export class NavigatorRoomSettingsTabModComponent
{
    @Input()
    public roomSettings: RoomSettings;

    @Output()
    onSave: EventEmitter<any> = new EventEmitter();

    @Output()
    onUnban: EventEmitter<any> = new EventEmitter();

    @Output()
    onOpenProfile: EventEmitter<any> = new EventEmitter();

    constructor()
    {}

    save(): void
    {
        this.onSave.emit(this.roomSettings);
    }

    unban(): void
    {
        this.onUnban.emit();
    }

    openProfile(userId: number): void
    {
        this.onOpenProfile.emit(userId);
    }
}