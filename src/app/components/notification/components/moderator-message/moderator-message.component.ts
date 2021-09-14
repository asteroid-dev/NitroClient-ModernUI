import { Component } from '@angular/core';
import { NotificationBroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';

@Component({
    templateUrl: './moderator-message.template.html'
})
export class NotificationModeratorMessageComponent extends NotificationBroadcastMessageComponent
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