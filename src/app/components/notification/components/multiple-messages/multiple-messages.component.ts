import { Component } from '@angular/core';
import { NotificationBroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';

@Component({
    templateUrl: './multiple-messages.template.html'
})
export class NotificationMultipleMessagesComponent extends NotificationBroadcastMessageComponent
{
    public messages: string[] = [];
}