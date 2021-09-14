import { Component, NgZone } from '@angular/core';
import { LoveLockStartConfirmComposer, Nitro } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';

@Component({
    templateUrl: './confirm.template.html'
})
export class FriendsFurniConfirmWidget extends ConversionTrackingWidget
{
    protected _visible: boolean                         = false;
    private _furniId: number = -1;


    constructor(
        protected _ngZone: NgZone)
    {
        super();
    }


    public open(furniId: number, start: boolean): void
    {
        if(this._visible && this._furniId != -1)
        {
            this.sendStart(this._furniId, false);
        }

        this._ngZone.run(() =>
        {
            this._furniId = furniId;
            this._visible = true;
        });

    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'confirm':
                this.sendStart(this._furniId, true);
                this.hide();
                break;
            case 'cancel':
                this.sendStart(this._furniId, false);
                this.hide();
                break;
        }
    }

    private sendStart(furniId: number, start: boolean): void
    {
        Nitro.instance.communication.connection.send(new LoveLockStartConfirmComposer(furniId, start));
    }

    public hide(): void
    {
        this._visible = false;
        this._furniId = -1;
    }

    public get visible(): boolean
    {
        return this._visible;
    }

}
