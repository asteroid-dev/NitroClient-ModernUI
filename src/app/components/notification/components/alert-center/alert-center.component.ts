import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { NotificationService } from '../../services/notification.service';
import { NotificationBroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';
import { NotificationChoice, NotificationChoicesComponent } from '../choices/choices.component';
import { NotificationConfirmComponent } from '../confirm/confirm.component';
import { NotificationModeratorMessageComponent } from '../moderator-message/moderator-message.component';
import { NotificationMultipleMessagesComponent } from '../multiple-messages/multiple-messages.component';

@Component({
    selector: 'nitro-alert-center-component',
    templateUrl: './alert-center.template.html'
})
export class AlertCenterComponent implements OnInit, OnDestroy
{
    @ViewChild('alertsContainer', { read: ViewContainerRef })
    public alertsContainer: ViewContainerRef;

    public _alerts: Map<NotificationBroadcastMessageComponent, ComponentRef<NotificationBroadcastMessageComponent>> = new Map();

    constructor(
        private _notificationService: NotificationService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone)
    { }

    public ngOnInit(): void
    {
        this._notificationService.alertCenter = this;
    }

    public ngOnDestroy(): void
    {
        this.closeAllAlerts();

        this._notificationService.alertCenter = null;
    }

    public alert(message: string, title: string = null): NotificationBroadcastMessageComponent
    {
        return this.buildAlert(NotificationBroadcastMessageComponent, message, title);
    }

    public alertWithLink(message: string, link: string = null, title: string = null): NotificationBroadcastMessageComponent
    {
        const component = (this.buildAlert(NotificationModeratorMessageComponent, message, title) as NotificationModeratorMessageComponent);

        if(!component) return null;

        component.link = link;

        return component;
    }

    public alertWithConfirm(message: string, title: string = null, callback: Function = null): NotificationBroadcastMessageComponent
    {
        const component = (this.buildAlert(NotificationConfirmComponent, message, title) as NotificationConfirmComponent);

        if(!component) return null;

        component.callback = callback;

        return component;
    }

    public alertWithChoices(message: string, choices: NotificationChoice[], title: string = null): NotificationBroadcastMessageComponent
    {

        let component: NotificationBroadcastMessageComponent = null;

        this._ngZone.run(() =>
        {
            component = this.createAlertComponent(NotificationChoicesComponent);

            if(title)
            {
                if(title.startsWith('${')) title = Nitro.instance.getLocalization(title);
            }
            else
            {
                title = Nitro.instance.getLocalization('${mod.alert.title}');
            }

            if(message)
            {
                if(message.startsWith('${')) message = Nitro.instance.getLocalization(message);

                message = message.replace(/\r\n|\r|\n/g, '<br />');
            }

            component.title = title;
            component.message = message;
            component.choices = choices;
        });

        if(!component) return null;

        return component;
    }

    public alertWithScrollableMessages(messages: string[], title: string = null): NotificationBroadcastMessageComponent
    {
        const component = (this.buildAlert(NotificationMultipleMessagesComponent, null, title) as NotificationMultipleMessagesComponent);

        if(!component) return;

        const transformedMessages: string[] = [];

        for(const message of messages)
        {
            if(!message) continue;

            transformedMessages.push(message.replace(/\r\n|\r|\n/g, '<br />'));
        }

        component.messages = transformedMessages;

        return component;
    }

    public buildAlert(type: typeof NotificationBroadcastMessageComponent, message: string, title: string = null): NotificationBroadcastMessageComponent
    {
        let component: NotificationBroadcastMessageComponent = null;

        this._ngZone.run(() =>
        {
            component = this.createAlertComponent(type);

            if(title)
            {
                if(title.startsWith('${')) title = Nitro.instance.getLocalization(title);
            }
            else
            {
                title = Nitro.instance.getLocalization('${mod.alert.title}');
            }

            if(message)
            {
                if(message.startsWith('${')) message = Nitro.instance.getLocalization(message);

                message = message.replace(/\r\n|\r|\n/g, '<br />');
            }

            component.title = title;
            component.message = message;
        });

        if(!component) return null;

        return component;
    }

    private createAlertComponent(type: typeof NotificationBroadcastMessageComponent): NotificationBroadcastMessageComponent
    {
        if(!type) return null;

        let instance: NotificationBroadcastMessageComponent = null;

        const factory = this._componentFactoryResolver.resolveComponentFactory(type);

        let ref: ComponentRef<NotificationBroadcastMessageComponent> = null;

        if(factory)
        {
            ref = this.alertsContainer.createComponent(factory);

            this._alerts.set(ref.instance, ref);
        }

        instance = ref.instance;

        return instance;
    }

    public closeAlert(component: NotificationBroadcastMessageComponent): void
    {
        if(!component) return;

        const ref = this._alerts.get(component);

        if(!ref) return;

        this._alerts.delete(component);

        this.removeAlertView(ref.hostView);
    }

    public closeAllAlerts(): void
    {
        for(const component of this._alerts.keys()) this.closeAlert(component);
    }

    private removeAlertView(view: ViewRef): void
    {
        if(!view) return;

        const index = this.alertsContainer.indexOf(view);

        if(index === -1) return;

        this.alertsContainer.remove(index);
    }
}
