import { Component } from '@angular/core';
import { NitroLogger } from '@nitrots/nitro-renderer';
import { NotificationBroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';

@Component({
    templateUrl: './confirm.template.html'
})
export class NotificationConfirmComponent extends NotificationBroadcastMessageComponent
{
    public callback: Function = null;

    public confirm(): void
    {
        if(this.callback)
        {
            try
            {
                this.callback();
            }

            catch (err)
            {
                NitroLogger.log(err);
            }
        }

        this.close();
    }
}
