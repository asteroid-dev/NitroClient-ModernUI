import { Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { BotCommandConfigurationEvent, BotRemoveComposer, BotSkillSaveComposer, IMessageEvent, Nitro, RequestBotCommandConfigurationComposer } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../../../core/settings/service';
import { AvatarContextInfoView } from '../../common/AvatarContextInfoView';
import { BotSkillsEnum } from '../../common/BotSkillsEnum';
import { RentableBotInfoData } from '../../common/RentableBotInfoData';
import { RoomAvatarInfoComponent } from '../main/main.component';

@Component({
    templateUrl: './rentablebot.template.html'
})
export class RoomAvatarInfoRentableBotComponent extends AvatarContextInfoView implements OnDestroy
{
    private static MODE_NORMAL: number          = 0;
    private static MODE_CHANGE_NAME: number     = 1;
    private static MODE_CHANGE_MOTTO: number    = 2;
    private static MODE_CHANGE_SPEECH: number   = 3;

    @ViewChild('activeView')
    public activeView: ElementRef<HTMLDivElement>;

    private _messageListener: IMessageEvent = null;

    public avatarData: RentableBotInfoData = null;
    public mode: number = 0;

    public menu: { mode: number, items: { name: string, localization: string, visible: boolean }[] }[] = [];

    public newName: string = '';
    public newMotto: string = '';

    public newText: string = '';
    public automaticChat: boolean = false;
    public mixSentences: boolean = false;
    public chatDelay: number = 5;

    constructor(
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        super();
    }

    public static setup(view: RoomAvatarInfoRentableBotComponent, userId: number, userName: string, userType: number, roomIndex: number, avatarData: RentableBotInfoData): void
    {
        view.avatarData = avatarData;

        AvatarContextInfoView.extendedSetup(view, userId, userName, userType, roomIndex);

        view.setupButtons();
    }

    public ngOnDestroy(): void
    {
        if(this._messageListener)
        {
            Nitro.instance.communication.connection.removeMessageEvent(this._messageListener);

            this._messageListener = null;
        }
    }

    private requestBotCommandConfiguration(skillType: number): void
    {
        if(!this._messageListener)
        {
            this._messageListener = new BotCommandConfigurationEvent(this.onBotCommandConfigurationEvent.bind(this));

            Nitro.instance.communication.connection.addMessageEvent(this._messageListener);
        }

        Nitro.instance.communication.connection.send(new RequestBotCommandConfigurationComposer(this.userId, skillType));
    }

    private onBotCommandConfigurationEvent(event: BotCommandConfigurationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(parser.botId !== this.userId) return;

        this._ngZone.run(() =>
        {
            switch(parser.commandId)
            {
                case BotSkillsEnum.CHANGE_BOT_NAME:
                    this.newName = parser.data;
                    return;
                case BotSkillsEnum.CHANGE_BOT_MOTTO:
                    this.newMotto = parser.data;
                    return;
                case BotSkillsEnum.SETUP_CHAT: {
                    const data = parser.data;

                    const pieces = data.split(((data.indexOf(';#;') === -1) ? ';' : ';#;'));

                    if((pieces.length === 3) || (pieces.length === 4))
                    {
                        this.newText        = pieces[0];
                        this.automaticChat  = ((pieces[1].toLowerCase() === 'true') || (pieces[1] === '1'));
                        this.chatDelay      = parseInt(pieces[2]);
                        this.mixSentences   = ((pieces[3]) ? ((pieces[3].toLowerCase() === 'true') || (pieces[3] === '1')) : false);
                    }

                    return;
                }
            }
        });
    }

    public setupButtons(): void
    {
        const canControl = (this.avatarData._Str_3246 || this.avatarData._Str_3529);

        this.menu = [
            {
                mode: RoomAvatarInfoRentableBotComponent.MODE_NORMAL,
                items: [
                    {
                        name: 'donate_to_all',
                        localization: 'avatar.widget.donate_to_all',
                        visible: ((this.avatarData._Str_2899.indexOf(BotSkillsEnum.DONATE_TO_ALL) >= 0) && canControl)
                    },
                    {
                        name: 'donate_to_user',
                        localization: 'avatar.widget.donate_to_user',
                        visible: ((this.avatarData._Str_2899.indexOf(BotSkillsEnum.DONATE_TO_USER) >= 0) && canControl)
                    },
                    {
                        name: 'change_bot_name',
                        localization: 'avatar.widget.change_bot_name',
                        visible: ((this.avatarData._Str_2899.indexOf(BotSkillsEnum.CHANGE_BOT_NAME) >= 0) && canControl)
                    },
                    {
                        name: 'change_bot_motto',
                        localization: 'avatar.widget.change_bot_motto',
                        visible: ((this.avatarData._Str_2899.indexOf(BotSkillsEnum.CHANGE_BOT_MOTTO) >= 0) && canControl)
                    },
                    {
                        name: 'dress_up',
                        localization: 'avatar.widget.dress_up',
                        visible: ((this.avatarData._Str_2899.indexOf(BotSkillsEnum.DRESS_UP) >= 0) && canControl)
                    },
                    {
                        name: 'random_walk',
                        localization: 'avatar.widget.random_walk',
                        visible: ((this.avatarData._Str_2899.indexOf(BotSkillsEnum.RANDOM_WALK) >= 0) && canControl)
                    },
                    {
                        name: 'setup_chat',
                        localization: 'avatar.widget.setup_chat',
                        visible: ((this.avatarData._Str_2899.indexOf(BotSkillsEnum.SETUP_CHAT) >= 0) && canControl)
                    },
                    {
                        name: 'dance',
                        localization: 'avatar.widget.dance',
                        visible: ((this.avatarData._Str_2899.indexOf(BotSkillsEnum.DANCE) >= 0) && canControl)
                    },
                    {
                        name: 'pick',
                        localization: 'avatar.widget.pick_up',
                        visible: ((this.avatarData._Str_2899.indexOf(BotSkillsEnum._Str_17261) === -1) && canControl)
                    }
                ]
            }
        ];
    }

    public processAction(name: string): void
    {
        let hideMenu = true;

        if(name)
        {
            switch(name)
            {
                case 'donate_to_all':
                    //this.requestBotCommandConfiguration(BotSkillsEnum.DONATE_TO_ALL);
                    this.widget.handler.container.connection.send(new BotSkillSaveComposer(this.avatarData.id, BotSkillsEnum.DONATE_TO_ALL, ''));
                    break;
                case 'donate_to_user':
                    //this.requestBotCommandConfiguration(BotSkillsEnum.DONATE_TO_USER);
                    this.widget.handler.container.connection.send(new BotSkillSaveComposer(this.avatarData.id, BotSkillsEnum.DONATE_TO_USER, ''));
                    break;
                case 'change_bot_name':
                    this.requestBotCommandConfiguration(BotSkillsEnum.CHANGE_BOT_NAME);
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoRentableBotComponent.MODE_CHANGE_NAME);
                    break;
                case 'save_bot_name':
                    this.widget.handler.container.connection.send(new BotSkillSaveComposer(this.avatarData.id, BotSkillsEnum.CHANGE_BOT_NAME, this.newName));
                    break;
                case 'change_bot_motto':
                    this.requestBotCommandConfiguration(BotSkillsEnum.CHANGE_BOT_MOTTO);
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoRentableBotComponent.MODE_CHANGE_MOTTO);
                    break;
                case 'save_bot_motto':
                    this.widget.handler.container.connection.send(new BotSkillSaveComposer(this.avatarData.id, BotSkillsEnum.CHANGE_BOT_MOTTO, this.newMotto));
                    break;
                case 'dress_up':
                    this.widget.handler.container.connection.send(new BotSkillSaveComposer(this.avatarData.id, BotSkillsEnum.DRESS_UP, ''));
                    break;
                case 'random_walk':
                    this.widget.handler.container.connection.send(new BotSkillSaveComposer(this.avatarData.id, BotSkillsEnum.RANDOM_WALK, ''));
                    break;
                case 'setup_chat':
                    this.requestBotCommandConfiguration(BotSkillsEnum.SETUP_CHAT);
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoRentableBotComponent.MODE_CHANGE_SPEECH);
                    break;
                case 'dance':
                    this.widget.handler.container.connection.send(new BotSkillSaveComposer(this.avatarData.id, BotSkillsEnum.DANCE, ''));
                    break;
                case 'nux_take_tour':
                    Nitro.instance.createLinkEvent('help/tour');
                    this.widget.handler.container.connection.send(new BotSkillSaveComposer(this.avatarData.id, BotSkillsEnum.NUX_TAKE_TOUR, ''));
                    break;
                case 'pick':
                    this.widget.handler.container.connection.send(new BotRemoveComposer(this.avatarData.id));
                    break;
                default:
                    break;
            }
        }

        if(hideMenu) this.parent.removeView(this.componentRef, false);
    }

    private setMode(mode: number): void
    {
        if(mode === this.mode) return;

        this.mode = mode;
    }

    public toggleVisibility(): void
    {
        this._settingsService.toggleUserContextVisible();
    }

    public get visible(): boolean
    {
        return this._settingsService.userContextVisible;
    }

    public get widget(): RoomAvatarInfoComponent
    {
        return (this.parent as RoomAvatarInfoComponent);
    }
}
