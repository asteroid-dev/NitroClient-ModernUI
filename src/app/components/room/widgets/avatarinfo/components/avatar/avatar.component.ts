import { Component, ElementRef, ViewChild } from '@angular/core';
import { Nitro, RoomControllerLevel, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../../../core/settings/service';
import { RoomWidgetUserActionMessage } from '../../../messages/RoomWidgetUserActionMessage';
import { RoomWidgetMessage } from '../../../RoomWidgetMessage';
import { AvatarContextInfoView } from '../../common/AvatarContextInfoView';
import { AvatarInfoData } from '../../common/AvatarInfoData';
import { RoomAvatarInfoComponent } from '../main/main.component';

@Component({
    selector: 'nitro-room-avatarinfo-avatar-component',
    templateUrl: './avatar.template.html'
})
export class RoomAvatarInfoAvatarComponent extends AvatarContextInfoView
{
    private static MODE_NORMAL: number          = 0;
    private static MODE_MODERATE: number        = 1;
    private static MODE_MODERATE_BAN: number    = 2;
    private static MODE_MODERATE_MUTE: number   = 3;
    private static MODE_AMBASSADOR: number      = 4;
    private static MODE_AMBASSADOR_MUTE: number = 5;

    @ViewChild('activeView')
    public activeView: ElementRef<HTMLDivElement>;

    public avatarData: AvatarInfoData = null;
    public mode: number = 0;

    public menu: { mode: number, items: { name: string, localization: string, visible: boolean }[] }[] = [];

    public openProfilePage()
    {
        Nitro.instance.createLinkEvent('profile/goto/' + this.userId);
    }
    
    constructor(
        private _settingsService: SettingsService)
    {
        super();
    }

    public static setup(view: RoomAvatarInfoAvatarComponent, userId: number, userName: string, userType: number, roomIndex: number, avatarData: AvatarInfoData): void
    {
        view.avatarData = avatarData;

        AvatarContextInfoView.extendedSetup(view, userId, userName, userType, roomIndex);

        view.setupButtons();
    }

    public setupButtons(): void
    {
        let giveHandItem = false;

        const handler       = this.widget.handler;
        const roomObject    = handler.container.roomEngine.getRoomObject(handler.roomSession.roomId, handler.container.roomSession.ownRoomIndex, RoomObjectCategory.UNIT);

        if(roomObject)
        {
            const carryId = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);

            if((carryId > 0) && (carryId < 999999)) giveHandItem = true;
        }

        this.menu = [
            {
                mode: RoomAvatarInfoAvatarComponent.MODE_NORMAL,
                items: [
                    {
                        name: 'friend',
                        localization: 'infostand.button.friend',
                        visible: this.avatarData.canBeAskedForAFriend
                    },
                    {
                        name: 'trade',
                        localization: 'infostand.button.trade',
                        visible: true
                    },
                    {
                        name: 'whisper',
                        localization: 'infostand.button.whisper',
                        visible: true
                    },
                    {
                        name: 'respect',
                        localization: 'infostand.button.respect',
                        visible: (this.avatarData._Str_3577 > 0)
                    },
                    {
                        name: 'ignore',
                        localization: 'infostand.button.ignore',
                        visible: !this.avatarData._Str_3655
                    },
                    {
                        name: 'unignore',
                        localization: 'infostand.button.unignore',
                        visible: this.avatarData._Str_3655
                    },
                    {
                        name: 'report',
                        localization: 'infostand.button.report',
                        visible: true
                    },
                    {
                        name: 'moderate',
                        localization: 'infostand.link.moderate',
                        visible: this.moderateMenuHasContent()
                    },
                    {
                        name: 'ambassador',
                        localization: 'infostand.link.ambassador',
                        visible: this.ambassadorMenuHasContent()
                    },
                    {
                        name: 'pass_handitem',
                        localization: 'avatar.widget.pass_hand_item',
                        visible: giveHandItem
                    }
                ]
            },
            {
                mode: RoomAvatarInfoAvatarComponent.MODE_MODERATE,
                items: [
                    {
                        name: 'kick',
                        localization: 'infostand.button.kick',
                        visible: true
                    },
                    {
                        name: 'mute',
                        localization: 'infostand.button.mute',
                        visible: true
                    },
                    {
                        name: 'ban',
                        localization: 'infostand.button.ban',
                        visible: true
                    },
                    {
                        name: 'give_rights',
                        localization: 'infostand.button.giverights',
                        visible: this.isShowGiveRights()
                    },
                    {
                        name: 'remove_rights',
                        localization: 'infostand.button.removerights',
                        visible: this.isShowRemoveRights()
                    },
                    {
                        name: 'back',
                        localization: 'generic.back',
                        visible: true
                    }
                ]
            },
            {
                mode: RoomAvatarInfoAvatarComponent.MODE_MODERATE_BAN,
                items: [
                    {
                        name: 'ban_hour',
                        localization: 'infostand.button.ban_hour',
                        visible: true
                    },
                    {
                        name: 'ban_day',
                        localization: 'infostand.button.ban_day',
                        visible: true
                    },
                    {
                        name: 'ban_perm',
                        localization: 'infostand.button.ban_perm',
                        visible: true
                    },
                    {
                        name: 'back_moderate',
                        localization: 'generic.back',
                        visible: true
                    }
                ]
            },
            {
                mode: RoomAvatarInfoAvatarComponent.MODE_MODERATE_MUTE,
                items: [
                    {
                        name: 'mute_2min',
                        localization: 'infostand.button.mute_2min',
                        visible: true
                    },
                    {
                        name: 'mute_5min',
                        localization: 'infostand.button.mute_5min',
                        visible: true
                    },
                    {
                        name: 'mute_10min',
                        localization: 'infostand.button.mute_10min',
                        visible: true
                    },
                    {
                        name: 'back_moderate',
                        localization: 'generic.back',
                        visible: true
                    }
                ]
            },
            {
                mode: RoomAvatarInfoAvatarComponent.MODE_AMBASSADOR,
                items: [
                    {
                        name: 'ambassador_alert',
                        localization: 'infostand.button.alert',
                        visible: true
                    },
                    {
                        name: 'ambassador_kick',
                        localization: 'infostand.button.kick',
                        visible: true
                    },
                    {
                        name: 'ambassador_mute',
                        localization: 'infostand.button.mute',
                        visible: true
                    },
                    {
                        name: 'back',
                        localization: 'generic.back',
                        visible: true
                    }
                ]
            },
            {
                mode: RoomAvatarInfoAvatarComponent.MODE_AMBASSADOR_MUTE,
                items: [
                    {
                        name: 'ambassador_mute_2min',
                        localization: 'infostand.button.mute_2min',
                        visible: true
                    },
                    {
                        name: 'ambassador_mute_10min',
                        localization: 'infostand.button.mute_10min',
                        visible: true
                    },
                    {
                        name: 'ambassador_mute_60min',
                        localization: 'infostand.button.mute_60min',
                        visible: true
                    },
                    {
                        name: 'ambassador_mute_18hr',
                        localization: 'infostand.button.mute_18hr',
                        visible: true
                    },
                    {
                        name: 'back_ambassador',
                        localization: 'generic.back',
                        visible: true
                    }
                ]
            }
        ];
    }

    public processAction(name: string): void
    {
        let messageType: string         = null;
        let message: RoomWidgetMessage  = null;
        let hideMenu           = true;

        if(name)
        {
            switch(name)
            {
                case 'moderate':
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoAvatarComponent.MODE_MODERATE);
                    break;
                case 'ban':
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoAvatarComponent.MODE_MODERATE_BAN);
                    break;
                case 'mute':
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoAvatarComponent.MODE_MODERATE_MUTE);
                    break;
                case 'ambassador':
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoAvatarComponent.MODE_AMBASSADOR);
                    break;
                case 'ambassador_mute':
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoAvatarComponent.MODE_AMBASSADOR_MUTE);
                    break;
                case 'back_moderate':
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoAvatarComponent.MODE_MODERATE);
                    break;
                case 'back_ambassador':
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoAvatarComponent.MODE_AMBASSADOR);
                    break;
                case 'back':
                    hideMenu = false;
                    this.setMode(RoomAvatarInfoAvatarComponent.MODE_NORMAL);
                    break;
                case 'whisper':
                    messageType = RoomWidgetUserActionMessage.RWUAM_WHISPER_USER;
                    break;
                case 'friend':
                    this.avatarData.canBeAskedForAFriend = false;
                    messageType = RoomWidgetUserActionMessage.RWUAM_SEND_FRIEND_REQUEST;
                    break;
                case 'respect':
                    this.avatarData._Str_3577--;

                    messageType = RoomWidgetUserActionMessage.RWUAM_RESPECT_USER;

                    if(this.avatarData._Str_3577 > 0) hideMenu = false;
                    break;
                case 'ignore':
                    this.avatarData._Str_3655 = true;
                    messageType = RoomWidgetUserActionMessage.RWUAM_IGNORE_USER;
                    break;
                case 'unignore':
                    this.avatarData._Str_3655 = false;
                    messageType = RoomWidgetUserActionMessage.RWUAM_UNIGNORE_USER;
                    break;
                case 'kick':
                    messageType = RoomWidgetUserActionMessage.RWUAM_KICK_USER;
                    break;
                case 'ban_hour':
                    messageType = RoomWidgetUserActionMessage.RWUAM_BAN_USER_HOUR;
                    break;
                case 'ban_day':
                    messageType = RoomWidgetUserActionMessage.RWUAM_BAN_USER_DAY;
                    break;
                case 'perm_ban':
                    messageType = RoomWidgetUserActionMessage.RWUAM_BAN_USER_PERM;
                    break;
                case 'mute_2min':
                    messageType = RoomWidgetUserActionMessage.MUTE_USER_2MIN;
                    break;
                case 'mute_5min':
                    messageType = RoomWidgetUserActionMessage.MUTE_USER_5MIN;
                    break;
                case 'mute_10min':
                    messageType = RoomWidgetUserActionMessage.MUTE_USER_10MIN;
                    break;
                case 'give_rights':
                    this.avatarData.roomControllerLevel = RoomControllerLevel.GUEST;
                    messageType = RoomWidgetUserActionMessage.RWUAM_GIVE_RIGHTS;
                    break;
                case 'remove_rights':
                    this.avatarData.roomControllerLevel = RoomControllerLevel.NONE;
                    messageType = RoomWidgetUserActionMessage.RWUAM_TAKE_RIGHTS;
                    break;
                case 'trade':
                    messageType = RoomWidgetUserActionMessage.RWUAM_START_TRADING;
                    break;
                case 'report':
                    messageType = RoomWidgetUserActionMessage.RWUAM_REPORT_CFH_OTHER;
                    break;
                case 'pass_handitem':
                    messageType = RoomWidgetUserActionMessage.RWUAM_PASS_CARRY_ITEM;
                    break;
                case 'ambassador_alert':
                    messageType = RoomWidgetUserActionMessage.RWUAM_AMBASSADOR_ALERT_USER;
                    break;
                case 'ambassador_kick':
                    messageType = RoomWidgetUserActionMessage.RWUAM_AMBASSADOR_KICK_USER;
                    break;
                case 'ambassador_mute_2min':
                    messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_2MIN;
                    break;
                case 'ambassador_mute_10min':
                    messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_10MIN;
                    break;
                case 'ambassador_mute_60min':
                    messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_60MIN;
                    break;
                case 'ambassador_mute_18hour':
                    messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_18HOUR;
                    break;
            }

            if(messageType) message = new RoomWidgetUserActionMessage(messageType, this.userId);

            if(message) this.parent.messageListener.processWidgetMessage(message);
        }

        if(hideMenu)
        {
            this.parent.removeView(this.componentRef, false);
        }
    }

    private setMode(mode: number): void
    {
        if(mode === this.mode) return;

        this.mode = mode;
    }

    private ambassadorMenuHasContent(): boolean
    {
        return this.avatarData._Str_4050;
    }

    private moderateMenuHasContent(): boolean
    {
        return (this.avatarData._Str_5990 || this.avatarData._Str_6701 || this.avatarData._Str_6394 || this.isShowGiveRights() || this.isShowRemoveRights());
    }

    private isShowGiveRights(): boolean
    {
        return (this.avatarData._Str_3246 && (this.avatarData._Str_5599 < RoomControllerLevel.GUEST) && !this.avatarData._Str_3672);
    }

    private isShowRemoveRights(): boolean
    {
        return (this.avatarData._Str_3246 && (this.avatarData._Str_5599 === RoomControllerLevel.GUEST) && !this.avatarData._Str_3672);
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
