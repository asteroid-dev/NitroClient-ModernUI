import { Component } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';

@Component({
    templateUrl: './notification-bubble.template.html',
})
export class NotificationBubbleComponent extends NotificationDialogComponent
{
    public clickNotification(): void
    {
        this.visitUrl();

        this.hide();
    }

    public visitUrl(): void
    {
        const url = this.getDefaultLinkUrl();

        if(!url || !url.length) return;

        const parts = url.split(':');

        if(!parts || (parts.length < 2)) return;

        if(parts[0] === 'event')
        {
            Nitro.instance.createLinkEvent(parts[1]);
        }
        else
        {
            window.open(url, '_blank');
        }
    }

    public getDefaultImage(): string
    {
        let image = (this.parameters.get('image') || null);

        if(!image) return super.getDefaultImage();

        image = Nitro.instance.core.configuration.interpolate(image);

        return image;
    }

    public getDefaultLinkTitle(): string
    {
        let linkTitle = (this.parameters.get('linkTitle') || null);

        if(!linkTitle) return super.getDefaultLinkTitle();

        linkTitle = Nitro.instance.getLocalization(linkTitle);

        return linkTitle;
    }

    public getDefaultLinkUrl(): string
    {
        const linkUrl = (this.parameters.get('linkUrl') || null);

        if(!linkUrl) return super.getDefaultLinkUrl();

        return linkUrl;
    }

    public getDefaultMessage(): string
    {
        let message = (this.parameters.get('message') || null);

        if(!message) return super.getDefaultMessage();

        message = Nitro.instance.getLocalization(message);

        return message;
    }

    public getDefaultTitle(): string
    {
        let title = (this.parameters.get('title') || null);

        if(!title) return super.getDefaultTitle();

        title = Nitro.instance.getLocalization(title);

        return title;
    }

    public get timeout(): number
    {
        return 5000;
    }
}
