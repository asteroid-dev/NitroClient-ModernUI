import { Component } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { NotificationService } from '../../services/notification.service';

@Component({
    templateUrl: './notification-dialog.temlate.html'
})
export class NotificationDialogComponent
{
    public type: string                     = null;
    public parameters: Map<string, string>  = null;

    public removing: boolean = false;

    constructor(private _notificationService: NotificationService)
    {}

    public hide(): void
    {
        this.removing = true;

        setTimeout(() => this.close(), 300);
    }

    public close(): void
    {
        this._notificationService.closeNotification(this);
    }

    public interpolate(value: string, regex: RegExp = null): string
    {
        if(!regex) regex = new RegExp(/%(.*?)%/g);

        const pieces = value.match(regex);

        if(pieces && pieces.length)
        {
            for(const piece of pieces)
            {
                const existing = (this.parameters.get(this.removeInterpolateKey(piece)) as string);

                if(existing) (value = value.replace(piece, existing));
            }
        }

        return value;
    }

    private removeInterpolateKey(value: string): string
    {
        return value.replace(/%/g, '');
    }

    public getDefaultImage(): string
    {
        const lookup = (this.notificationLocaleKey + '.image');

        let image = (Nitro.instance.getLocalization(lookup) || null);

        if(image === lookup)
        {
            image = Nitro.instance.getConfiguration<string>('image.library.notifications.url');

            image = image.replace('%image%', this.type);

            return image;
        }

        if(image && image.length)
        {
            image = this.interpolate(image);

            image = Nitro.instance.core.configuration.interpolate(image);
        }

        return image;
    }

    public getDefaultLinkTitle(): string
    {
        let linkTitle = (Nitro.instance.getLocalization(this.notificationLocaleKey + '.linkTitle') || null);

        if(linkTitle && linkTitle.length) linkTitle = this.interpolate(linkTitle);

        return linkTitle;
    }

    public getDefaultLinkUrl(): string
    {
        let linkUrl = (Nitro.instance.getLocalization(this.notificationLocaleKey + '.linkUrl') || null);

        if(linkUrl && linkUrl.length) linkUrl = this.interpolate(linkUrl);

        return linkUrl;
    }

    public getDefaultMessage(): string
    {
        let message = (Nitro.instance.getLocalization(this.notificationLocaleKey + '.message') || null);

        if(message && message.length) message = this.interpolate(message);

        return message;
    }

    public getDefaultTitle(): string
    {
        let title = (Nitro.instance.getLocalization(this.notificationLocaleKey + '.title') || null);

        if(title && title.length) title = this.interpolate(title);

        return title;
    }

    public get notificationLocaleKey(): string
    {
        return ('notification.' + this.type);
    }

    public get timeout(): number
    {
        return 0;
    }
}
