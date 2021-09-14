import { Component } from '@angular/core';
import { NitroLogger } from '@nitrots/nitro-renderer';
import { NotificationBroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';

@Component({
    templateUrl: './choices.template.html'
})
export class NotificationChoicesComponent extends NotificationBroadcastMessageComponent
{
    public callback: Function = null;

    public choices: NotificationChoice[] = [];

    public choose(chosenIndex: number): void
    {
        try
        {
            this.choices[chosenIndex].callback();
        }
        catch (err)
        {
            NitroLogger.log(err);
        }

        this.close();
    }
}

export class NotificationChoice
{
    private _localizationKey: string;
    private _callback: Function;
    private _classes: string[];

    constructor(localizationKey: string, callback: Function, classes: string[] = [])
    {
        this._localizationKey = localizationKey;
        this._callback = callback;
        this._classes = classes;
    }

    public get localizationKey(): string
    {
        return this._localizationKey;
    }

    public get callback(): Function
    {
        return this._callback;
    }

    public get classes(): string[]
    {
        return this._classes;
    }
}
