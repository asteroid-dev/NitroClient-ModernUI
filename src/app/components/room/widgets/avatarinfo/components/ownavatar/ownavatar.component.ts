import { Component, ElementRef, ViewChild } from '@angular/core';
import { AvatarAction, AvatarExpressionEnum, Nitro, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../../../core/settings/service';
import { RoomWidgetAvatarExpressionMessage } from '../../../messages/RoomWidgetAvatarExpressionMessage';
import { RoomWidgetChangePostureMessage } from '../../../messages/RoomWidgetChangePostureMessage';
import { RoomWidgetDanceMessage } from '../../../messages/RoomWidgetDanceMessage';
import { RoomWidgetUserActionMessage } from '../../../messages/RoomWidgetUserActionMessage';
import { RoomWidgetMessage } from '../../../RoomWidgetMessage';
import { AvatarContextInfoView } from '../../common/AvatarContextInfoView';
import { AvatarInfoData } from '../../common/AvatarInfoData';
import { RoomAvatarInfoComponent } from '../main/main.component';

@Component({
    selector: 'nitro-room-avatarinfo-ownavatar-component',
    templateUrl: './ownavatar.template.html'
})
export class RoomAvatarInfoOwnAvatarComponent extends AvatarContextInfoView
{
    private static MODE_NORMAL: number          = 0;
    private static MODE_CLUB_DANCES: number     = 1;
    private static MODE_NAME_CHANGE: number     = 2;
    private static MODE_EXPRESSIONS: number     = 3;
    private static MODE_SIGNS: number           = 4;
    private static MODE_CHANGE_LOOKS: number    = 5;

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
        private _settingsService: SettingsService,
    )
    {
        super();
    }

    public static setup(view: RoomAvatarInfoOwnAvatarComponent, userId: number, userName: string, userType: number, roomIndex: number, avatarData: AvatarInfoData): void
    {
        view.avatarData = avatarData;

        if(view.widget.isDancing && view.widget.hasClub) view.mode = RoomAvatarInfoOwnAvatarComponent.MODE_CLUB_DANCES;

        AvatarContextInfoView.extendedSetup(view, userId, userName, userType, roomIndex);

        view.setupButtons();
    }

    public setupButtons(): void
    {
        const isRidingHorse = this.widget._Str_25831;

        this.menu = [
            {
                mode: RoomAvatarInfoOwnAvatarComponent.MODE_NORMAL,
                items: [
                    {
                        name: 'decorate',
                        localization: 'widget.avatar.decorate',
                        visible: (this.widget.hasClub && (this.avatarData.roomControllerLevel >= RoomControllerLevel.GUEST) || this.avatarData._Str_3246)
                    },
                    {
                        name: 'change_looks',
                        localization: 'widget.memenu.myclothes',
                        visible: true
                    },
                    {
                        name: 'dance_menu',
                        localization: 'widget.memenu.dance',
                        visible: (this.widget.hasClub && !isRidingHorse)
                    },
                    {
                        name: 'dance',
                        localization: 'widget.memenu.dance',
                        visible: (!this.widget.isDancing && !this.widget.hasClub && !isRidingHorse)
                    },
                    {
                        name: 'dance_stop',
                        localization: 'widget.memenu.dance.stop',
                        visible: (this.widget.isDancing && !this.widget.hasClub && !isRidingHorse)
                    },
                    {
                        name: 'expressions',
                        localization: 'infostand.link.expressions',
                        visible: true
                    },
                    {
                        name: 'signs',
                        localization: 'infostand.show.signs',
                        visible: true
                    },
                    {
                        name: 'drop_hand_item',
                        localization: 'avatar.widget.drop_hand_item',
                        visible: ((this.avatarData._Str_8826 > 0) && (this.avatarData._Str_8826 < 999999))
                    }
                ]
            },
            {
                mode: RoomAvatarInfoOwnAvatarComponent.MODE_CLUB_DANCES,
                items: [
                    {
                        name: 'dance_stop',
                        localization: 'widget.memenu.dance.stop',
                        visible: (this.widget.isDancing)
                    },
                    {
                        name: 'dance_1',
                        localization: 'widget.memenu.dance1',
                        visible: true
                    },
                    {
                        name: 'dance_2',
                        localization: 'widget.memenu.dance2',
                        visible: true
                    },
                    {
                        name: 'dance_3',
                        localization: 'widget.memenu.dance3',
                        visible: true
                    },
                    {
                        name: 'dance_4',
                        localization: 'widget.memenu.dance4',
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
                mode: RoomAvatarInfoOwnAvatarComponent.MODE_EXPRESSIONS,
                items: [
                    {
                        name: 'sit',
                        localization: 'widget.memenu.sit',
                        visible: (this.widget.getOwnPosture === AvatarAction.POSTURE_STAND)
                    },
                    {
                        name: 'stand',
                        localization: 'widget.memenu.stand',
                        visible: this.widget.getCanStandUp
                    },
                    {
                        name: 'wave',
                        localization: 'widget.memenu.wave',
                        visible: (!this.widget._Str_12708)
                    },
                    {
                        name: 'laugh',
                        localization: 'widget.memenu.laugh',
                        visible: (!this.widget._Str_12708 && this.widget.hasVip)
                    },
                    {
                        name: 'blow',
                        localization: 'widget.memenu.blow',
                        visible: (!this.widget._Str_12708 && this.widget.hasVip)
                    },
                    {
                        name: 'idle',
                        localization: 'widget.memenu.idle',
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
                mode: RoomAvatarInfoOwnAvatarComponent.MODE_SIGNS,
                items: [
                    {
                        name: 'sign_1',
                        localization: '1',
                        visible: true
                    },
                    {
                        name: 'sign_4',
                        localization: '4',
                        visible: true
                    },
                    {
                        name: 'sign_7',
                        localization: '7',
                        visible: true
                    },
                    {
                        name: 'sign_10',
                        localization: '10',
                        visible: true
                    },
                    {
                        name: 'sign_0',
                        localization: '0',
                        visible: true
                    },
                    {
                        name: 'sign_14',
                        localization: '<i class="icon icon-sign-soccer"></i>',
                        visible: true
                    },
                    {
                        name: 'sign_2',
                        localization: '2',
                        visible: true
                    },
                    {
                        name: 'sign_5',
                        localization: '5',
                        visible: true
                    },
                    {
                        name: 'sign_8',
                        localization: '8',
                        visible: true
                    },
                    {
                        name: 'sign_11',
                        localization: '<i class="icon icon-sign-heart"></i>',
                        visible: true
                    },
                    {
                        name: 'sign_13',
                        localization: '<i class="icon icon-sign-exclamation"></i>',
                        visible: true
                    },
                    {
                        name: 'sign_17',
                        localization: '<i class="icon icon-sign-yellow"></i>',
                        visible: true
                    },
                    {
                        name: 'sign_3',
                        localization: '3',
                        visible: true
                    },
                    {
                        name: 'sign_6',
                        localization: '6',
                        visible: true
                    },
                    {
                        name: 'sign_9',
                        localization: '9',
                        visible: true
                    },
                    {
                        name: 'sign_12',
                        localization: '<i class="icon icon-sign-skull"></i>',
                        visible: true
                    },
                    {
                        name: 'sign_15',
                        localization: '<i class="icon icon-sign-smile"></i>',
                        visible: true
                    },
                    {
                        name: 'sign_16',
                        localization: '<i class="icon icon-sign-red"></i>',
                        visible: true
                    }
                ]
            }
        ];
    }

    public processAction(name: string): void
    {
        let message: RoomWidgetMessage  = null;
        let hideMenu           = true;

        if(name)
        {
            if(name.startsWith('sign_'))
            {
                const sign = parseInt(name.split('_')[1]);

                this.widget.useSign(sign);
            }
            else
            {
                switch(name)
                {
                    case 'decorate':
                        if(this.widget.hasClub)
                        {
                            this.widget.isDecorating = true;
                        }
                        break;
                    case 'change_looks':
                        this.widget.openAvatarEditor();
                        break;
                    case 'expressions':
                        hideMenu = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_EXPRESSIONS);
                        break;
                    case 'sit':
                        message = new RoomWidgetChangePostureMessage(RoomWidgetChangePostureMessage._Str_2016);
                        break;
                    case 'stand':
                        message = new RoomWidgetChangePostureMessage(RoomWidgetChangePostureMessage._Str_1553);
                        break;
                    case 'wave':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum.WAVE);
                        break;
                    case 'blow':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum.BLOW);
                        break;
                    case 'laugh':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum.LAUGH);
                        break;
                    case 'idle':
                        message = new RoomWidgetAvatarExpressionMessage(AvatarExpressionEnum.IDLE);
                        break;
                    case 'dance_menu':
                        hideMenu = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_CLUB_DANCES);
                        break;
                    case 'dance':
                        message = new RoomWidgetDanceMessage(1);
                        break;
                    case 'dance_stop':
                        message = new RoomWidgetDanceMessage(0);
                        break;
                    case 'dance_1':
                    case 'dance_2':
                    case 'dance_3':
                    case 'dance_4':
                        message = new RoomWidgetDanceMessage(parseInt(name.charAt((name.length - 1))));
                        break;
                    case 'signs':
                        hideMenu = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_SIGNS);
                        break;
                    case 'back':
                        hideMenu = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_NORMAL);
                        break;
                    case 'more':
                        hideMenu = false;
                        //this.widget._Str_13909 = false;
                        this.setMode(RoomAvatarInfoOwnAvatarComponent.MODE_NORMAL);
                        break;
                    case 'drop_hand_item':
                        message = new RoomWidgetUserActionMessage(RoomWidgetUserActionMessage.RWUAM_DROP_CARRY_ITEM, this.userId);
                        break;
                }
            }

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
