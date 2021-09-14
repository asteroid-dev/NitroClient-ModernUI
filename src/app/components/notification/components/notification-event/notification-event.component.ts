import { Component } from '@angular/core';
import { NotificationBubbleComponent } from '../notification-bubble/notification-bubble.component';

@Component({
    templateUrl: './notification-event.template.html',
})
export class NotificationEventComponent extends NotificationBubbleComponent
{
    public get timeout(): number
    {
        return 0;
    }
}