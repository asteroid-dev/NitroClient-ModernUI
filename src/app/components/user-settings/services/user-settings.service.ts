import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent, Nitro, NitroSettingsEvent, UserSettingsCameraFollowComposer, UserSettingsEvent, UserSettingsOldChatComposer, UserSettingsRoomInvitesComposer, UserSettingsSoundComposer } from '@nitrots/nitro-renderer';

@Injectable()
export class UserSettingsService implements OnDestroy
{
    private _messages: IMessageEvent[];

    private _volumeSystem: number;
    private _volumeFurni: number;
    private _volumeTrax: number;

    private _oldChat: boolean;
    private _roomInvites: boolean;
    private _cameraFollow: boolean;
    private _flags: number;
    private _chatType: number;

    constructor(
        private _ngZone: NgZone)
    {
        this._messages      = [];

        this._volumeSystem  = 0;
        this._volumeFurni   = 0;
        this._volumeTrax    = 0;
        this._oldChat       = false;
        this._roomInvites   = false;
        this._cameraFollow  = true;
        this._flags         = 0;
        this._chatType      = 0;

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.unregisterMessages();

            this._messages = [
                new UserSettingsEvent(this.onUserSettingsEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(this._messages && this._messages.length)
            {
                for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    private onUserSettingsEvent(event: UserSettingsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._volumeSystem  = parser.volumeSystem / 100;
        this._volumeFurni   = parser.volumeFurni / 100;
        this._volumeTrax    = parser.volumeTrax / 100;
        this._oldChat       = parser.oldChat;
        this._roomInvites   = parser.roomInvites;
        this._cameraFollow  = parser.cameraFollow;
        this._flags         = parser.flags;
        this._chatType      = parser.chatType;

        this.sendUpdateEvent();
    }

    public sendSound(): void
    {
        Nitro.instance.communication.connection.send(new UserSettingsSoundComposer(Math.round(this._volumeSystem * 100), Math.round(this._volumeFurni * 100), Math.round(this._volumeTrax * 100)));
    }

    private sendUpdateEvent(): void
    {
        const event = new NitroSettingsEvent();
        event.volumeSystem  = this._volumeSystem;
        event.volumeFurni   = this._volumeFurni;
        event.volumeTrax    = this._volumeTrax;
        event.oldChat       = this._oldChat;
        event.roomInvites   = this._roomInvites;
        event.cameraFollow  = this._cameraFollow;
        event.flags         = this._flags;
        event.chatType      = this._chatType;

        Nitro.instance.events.dispatchEvent(event);
    }


    private _sendOldChat(): void
    {
        Nitro.instance.communication.connection.send(new UserSettingsOldChatComposer(this._oldChat));
    }

    private _sendRoomInvites(): void
    {
        Nitro.instance.communication.connection.send(new UserSettingsRoomInvitesComposer(this._roomInvites));
    }

    private _sendCameraFollow(): void
    {
        Nitro.instance.communication.connection.send(new UserSettingsCameraFollowComposer(this._cameraFollow));
    }

    public get volumeSystem(): number
    {
        return this._volumeSystem;
    }

    public set volumeSystem(volume: number)
    {
        if(volume > 1) volume = 1;

        if(volume < 0) volume = 0;

        this._volumeSystem = volume;
        this.sendUpdateEvent();
    }

    public get volumeFurni(): number
    {
        return this._volumeFurni;
    }

    public set volumeFurni(volume: number)
    {
        if(volume > 1) volume = 1;

        if(volume < 0) volume = 0;

        this._volumeFurni = volume;
        this.sendUpdateEvent();
    }

    public get volumeTrax(): number
    {
        return this._volumeTrax;
    }

    public set volumeTrax(volume: number)
    {
        if(volume > 1) volume = 1;

        if(volume < 0) volume = 0;

        this._volumeTrax = volume;
        this.sendUpdateEvent();
    }

    public get oldChat(): boolean
    {
        return this._oldChat;
    }

    public set oldChat(value: boolean)
    {
        this._oldChat = value;
        this._sendOldChat();
    }

    public get roomInvites(): boolean
    {
        return this._roomInvites;
    }

    public set roomInvites(value: boolean)
    {
        this._roomInvites = value;
        this._sendRoomInvites();
    }

    public get cameraFollow(): boolean
    {
        return this._cameraFollow;
    }

    public set cameraFollow(value: boolean)
    {
        this._cameraFollow = value;
        this._sendCameraFollow();
        this.sendUpdateEvent();
    }

    public get flags(): number
    {
        return this._flags;
    }

    public set flags(value: number)
    {
        this._flags = value;
        this.sendUpdateEvent();
    }

    public get chatType(): number
    {
        return this._chatType;
    }

    public set chatType(value: number)
    {
        this._chatType = value;
        this.sendUpdateEvent();
    }
}
