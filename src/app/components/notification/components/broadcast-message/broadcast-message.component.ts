import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NotificationChoice } from '../choices/choices.component';

@Component({
    templateUrl: './broadcast-message.template.html'
})
export class NotificationBroadcastMessageComponent
{
    public title: string    = '';
    public message: string  = '';
    public choices: NotificationChoice[] = [];

    constructor(
        private _notificationService: NotificationService
    )
    {}

    public close(): void
    {
        this._notificationService.closeAlert(this);
    }
}