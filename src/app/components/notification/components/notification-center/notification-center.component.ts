import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NotificationBubbleComponent } from '../notification-bubble/notification-bubble.component';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { NotificationEventComponent } from '../notification-event/notification-event.component';

@Component({
    selector: 'nitro-notification-center-component',
    templateUrl: './notification-center.template.html'
})
export class NotificationCenterComponent implements OnInit, OnDestroy
{
    @ViewChild('notificationsContainer', { read: ViewContainerRef })
    public notificationsContainer: ViewContainerRef;

    public _notifications: Map<NotificationDialogComponent, ComponentRef<NotificationDialogComponent>> = new Map();

    constructor(
        private _notificationService: NotificationService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone)
    { }

    public ngOnInit(): void
    {
        this._notificationService.notificationCenter = this;
    }

    public ngOnDestroy(): void
    {
        this.closeAllNotifications();

        this._notificationService.notificationCenter = null;
    }

    public displayNotification(type: string, parameters: Map<string, string>): NotificationDialogComponent
    {
        let componentClass: typeof NotificationDialogComponent = null;

        switch(type)
        {
            case 'hotel.event':
                componentClass = NotificationEventComponent;
                break;
            default:
                componentClass = NotificationBubbleComponent;
                break;
        }

        const component = (this.buildNotification(componentClass) as NotificationDialogComponent);

        if(!component) return null;

        component.type          = type;
        component.parameters    = parameters;

        if(component.timeout > 0) setTimeout(() => (component && component.hide()), component.timeout);

        return component;
    }

    public buildNotification(type: typeof NotificationDialogComponent): NotificationDialogComponent
    {
        let component: NotificationDialogComponent = null;

        this._ngZone.run(() =>
        {
            component = this.createNotificationComponent(type);
        });

        if(!component) return null;

        return component;
    }

    private createNotificationComponent(type: typeof NotificationDialogComponent): NotificationDialogComponent
    {
        if(!type) return null;

        let instance: NotificationDialogComponent = null;

        const factory = this._componentFactoryResolver.resolveComponentFactory(type);

        let ref: ComponentRef<NotificationDialogComponent> = null;

        if(factory)
        {
            ref = this.notificationsContainer.createComponent(factory);

            this._notifications.set(ref.instance, ref);
        }

        instance = ref.instance;

        return instance;
    }

    public closeNotification(component: NotificationDialogComponent): void
    {
        if(!component) return;

        const ref = this._notifications.get(component);

        if(!ref) return;

        this._notifications.delete(component);

        this.removeNotificationView(ref.hostView);
    }

    public closeAllNotifications(): void
    {
        for(const component of this._notifications.keys()) this.closeNotification(component);
    }

    private removeNotificationView(view: ViewRef): void
    {
        if(!view) return;

        const index = this.notificationsContainer.indexOf(view);

        if(index === -1) return;

        this.notificationsContainer.remove(index);
    }
}