import { Component } from '@angular/core';
import { NotificationBroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';

@Component({
    templateUrl: './event-message.template.html'
})
export class NotificationEventMessageComponent extends NotificationBroadcastMessageComponent
{
    public link: string = '';

    public openLink(): void
    {
        window.open(this.link, '_blank');
    }

    public get hasLink(): boolean
    {
        return (this.link.length > 0);
    }
}