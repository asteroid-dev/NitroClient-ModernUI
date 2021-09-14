import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent, Nitro, UserWardrobePageComposer, UserWardrobePageEvent, UserWardrobeSaveComposer } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../core/settings/service';
import { NotificationService } from '../../notification/services/notification.service';
import { AvatarEditorMainComponent } from '../components/main/main.component';
import { AvatarEditorWardrobeComponent } from '../components/wardrobe/wardrobe.component';

@Injectable()
export class AvatarEditorService implements OnDestroy
{
    private _component: AvatarEditorMainComponent = null;
    private _wardrobeComponent: AvatarEditorWardrobeComponent = null;
    private _messages: IMessageEvent[] = [];

    constructor(
        private _notificationService: NotificationService,
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._messages = [
                new UserWardrobePageEvent(this.onUserWardrobePageEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onUserWardrobePageEvent(event: UserWardrobePageEvent): void
    {
        if(!this._wardrobeComponent) return;

        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        parser.looks.forEach((value, key) =>
        {
            this._ngZone.run(() =>
            {
                this._wardrobeComponent.setLook(key, value[0], value[1]);
            });
        });
    }

    public loadOwnAvatarInEditor(): void
    {
        if(!this._component) return;

        const sessionData = Nitro.instance.sessionDataManager;

        this._component.loadAvatarInEditor(sessionData.figure, sessionData.gender, sessionData.clubLevel);
    }

    public loadAvatarInEditor(look: string, gender: string): void
    {
        if(!this._component) return;

        const sessionData = Nitro.instance.sessionDataManager;

        this._component.loadAvatarInEditor(look, gender, sessionData.clubLevel);
    }

    public requestWardrobePage(pageId: number): void
    {
        Nitro.instance.communication.connection.send(new UserWardrobePageComposer(pageId));
    }

    public setWardrobeSlot(slotId: number): void
    {
        Nitro.instance.communication.connection.send(new UserWardrobeSaveComposer(slotId, this.currentEditorLook, this.currentEditorGender));
    }

    public get component(): AvatarEditorMainComponent
    {
        return this._component;
    }

    public set component(component: AvatarEditorMainComponent)
    {
        this._component = component;
    }

    public set wardrobeComponent(component: AvatarEditorWardrobeComponent)
    {
        this._wardrobeComponent = component;
    }

    public get currentEditorLook(): string
    {
        return this._component.figureData.view.figureString;
    }

    public get currentEditorGender(): string
    {
        return this._component.figureData.gender;
    }
}
