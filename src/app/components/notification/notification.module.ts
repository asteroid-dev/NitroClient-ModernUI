import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AlertCenterComponent } from './components/alert-center/alert-center.component';
import { NotificationBroadcastMessageComponent } from './components/broadcast-message/broadcast-message.component';
import { NotificationChoicesComponent } from './components/choices/choices.component';
import { NotificationConfirmComponent } from './components/confirm/confirm.component';
import { NotificationModeratorMessageComponent } from './components/moderator-message/moderator-message.component';
import { NotificationMultipleMessagesComponent } from './components/multiple-messages/multiple-messages.component';
import { NotificationBubbleComponent } from './components/notification-bubble/notification-bubble.component';
import { NotificationCenterComponent } from './components/notification-center/notification-center.component';
import { NotificationDialogComponent } from './components/notification-dialog/notification-dialog.component';
import { NotificationEventComponent } from './components/notification-event/notification-event.component';
import { NotificationService } from './services/notification.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        AlertCenterComponent,
        NotificationBroadcastMessageComponent,
        NotificationConfirmComponent,
        NotificationChoicesComponent,
        NotificationModeratorMessageComponent,
        NotificationMultipleMessagesComponent,
        NotificationBubbleComponent,
        NotificationCenterComponent,
        NotificationDialogComponent,
        NotificationEventComponent
    ],
    providers: [
        NotificationService
    ],
    declarations: [
        AlertCenterComponent,
        NotificationBroadcastMessageComponent,
        NotificationConfirmComponent,
        NotificationChoicesComponent,
        NotificationModeratorMessageComponent,
        NotificationMultipleMessagesComponent,
        NotificationBubbleComponent,
        NotificationCenterComponent,
        NotificationDialogComponent,
        NotificationEventComponent
    ]
})
export class NotificationModule
{ }
