import { Component, Input } from '@angular/core';
import { SettingsService } from '../../../core/settings/service';
import { UserSettingsService } from '../services/user-settings.service';

@Component({
    selector: 'nitro-user-settings-component',
    templateUrl: './user-settings.template.html'
})
export class UserSettingsComponent
{
    @Input()
    public visible: boolean = false;

    constructor(
        private _userSettingsService: UserSettingsService,
        private _settingsService: SettingsService)
    {}

    public hide(): void
    {
        this._settingsService.hideUserSettings();
    }

    public saveSound(): void
    {
        this._userSettingsService.sendSound();
    }

    public get volumeSystem(): number
    {
        return this._userSettingsService.volumeSystem * 100;
    }

    public set volumeSystem(volume: number)
    {
        this._userSettingsService.volumeSystem = volume / 100;
    }

    public get volumeFurni(): number
    {
        return this._userSettingsService.volumeFurni * 100;
    }

    public set volumeFurni(volume: number)
    {
        this._userSettingsService.volumeFurni = volume / 100;
    }

    public get volumeTrax(): number
    {
        return this._userSettingsService.volumeTrax * 100;
    }

    public set volumeTrax(volume: number)
    {
        this._userSettingsService.volumeTrax = volume / 100;
    }

    public get oldChat(): boolean
    {
        return this._userSettingsService.oldChat;
    }

    public set oldChat(value: boolean)
    {
        this._userSettingsService.oldChat = value;
    }

    public get roomInvites(): boolean
    {
        return this._userSettingsService.roomInvites;
    }

    public set roomInvites(value: boolean)
    {
        this._userSettingsService.roomInvites = value;
    }

    public get cameraFollow(): boolean
    {
        return this._userSettingsService.cameraFollow;
    }

    public set cameraFollow(value: boolean)
    {
        this._userSettingsService.cameraFollow = value;
    }
}
