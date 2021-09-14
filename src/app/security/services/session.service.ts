import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent, Nitro, UserFigureEvent, UserInfoEvent } from '@nitrots/nitro-renderer';

@Injectable()
export class SessionService implements OnDestroy
{
    private _messages: IMessageEvent[];
    private _userId: number;
    private _userName: string;
    private _figure: string;
    private _gender: string;

    constructor(private _ngZone: NgZone)
    {
        this._userId    = -1;
        this._userName  = null;
        this._figure    = null;
        this._gender    = null;

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
            this._messages = [
                new UserInfoEvent(this.onUserInfoEvent.bind(this)),
                new UserFigureEvent(this.onUserFigureEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const userInfo = parser.userInfo;

        this._ngZone.run(() =>
        {
            this._userId    = userInfo.userId;
            this._userName  = userInfo.username;
            this._figure    = userInfo.figure;
            this._gender    = userInfo.gender;
        });
    }

    private onUserFigureEvent(event: UserFigureEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._figure    = parser.figure;
            this._gender    = parser.gender;
        });
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get userName(): string
    {
        return this._userName;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get gender(): string
    {
        return this._gender;
    }
}
