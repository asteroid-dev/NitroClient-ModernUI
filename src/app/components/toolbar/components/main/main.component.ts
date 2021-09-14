import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DesktopViewComposer, Dispose, DropBounce, EaseOut, FollowFriendComposer, JumpBy, Motions, Nitro, NitroToolbarAnimateIconEvent, NitroToolbarEvent, Queue, ToolbarIconEnum, Wait } from '@nitrots/nitro-renderer';
import * as $ from 'jquery';
import { SettingsService } from '../../../../core/settings/service';
import { SessionService } from '../../../../security/services/session.service';
import { AchievementsService } from '../../../achievements/services/achievements.service';
import { MessengerFriend } from '../../../friendlist/common/MessengerFriend';
import { FriendListService } from '../../../friendlist/services/friendlist.service';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { ModToolService } from '../../../mod-tool/services/mod-tool.service';
import { NavigatorService } from '../../../navigator/services/navigator.service';


@Component({
    selector: 'nitro-toolbar-component',
    templateUrl: './main.template.html',
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ bottom: '-100%' }),
                        animate('1s ease-out',
                            style({ bottom: 10 }))
                    ]
                ),
            ]
        )
    ]
})
export class ToolbarMainComponent implements OnInit, OnDestroy
{
    @Input()
    public isInRoom: boolean = false;

    @ViewChild('navigationList')
    public navigationList: ElementRef<HTMLElement>;

    constructor(
        private _inventoryService: InventoryService,
        private _navigatorService: NavigatorService,
        private _friendListService: FriendListService,
        private _achievementService: AchievementsService,
        private sessionService: SessionService,
        private settingsService: SettingsService,
        private _modToolsService: ModToolService,
        private ngZone: NgZone)
    {
        this.onNitroToolbarEvent = this.onNitroToolbarEvent.bind(this);
    }
    @ViewChild('listeitem') div;
    public acac = 'friend-box-kapali';
    public acikMi = false;

    private currentOpenedFriendOptions = 0;

    public ngOnInit(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.addEventListener(NitroToolbarEvent.TOOLBAR_CLICK, this.onNitroToolbarEvent);
            Nitro.instance.roomEngine.events.addEventListener(NitroToolbarAnimateIconEvent.ANIMATE_ICON, this.onNitroToolbarEvent);
        });
        const slider = document.querySelector('.tbfl-main');

        $('.tbfl-right-button').click(function ()
        {
            console.log('xx');
            slider.scrollLeft += 144;
        });

        $('.tbfl-left-button').click(function ()
        {
            console.log('xx');
            slider.scrollLeft -= 144;
        });
        let xx = 0;


    }

    public ngOnDestroy(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.removeEventListener(NitroToolbarEvent.TOOLBAR_CLICK, this.onNitroToolbarEvent);
            Nitro.instance.roomEngine.events.removeEventListener(NitroToolbarAnimateIconEvent.ANIMATE_ICON, this.onNitroToolbarEvent);
        });
    }

    private onNitroToolbarEvent(event: NitroToolbarEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case NitroToolbarEvent.TOOLBAR_CLICK:
                this.clickIcon(event.iconName);
                return;
            case NitroToolbarAnimateIconEvent.ANIMATE_ICON: {
                const iconEvent = (event as NitroToolbarAnimateIconEvent);

                this.animateToIcon(iconEvent.iconName, iconEvent.image, iconEvent.x, iconEvent.y);
                return;
            }
        }
    }

    public clickIcon(name: string): void
    {
        if(!name || (name === '')) return;

        switch(name)
        {
            case ToolbarIconEnum.HOTEL_VIEW:
                this.visitDesktop();
                return;
            case ToolbarIconEnum.HOME_ROOM:
                this.visitHomeRoom();
                return;
            case ToolbarIconEnum.NAVIGATOR:
                this.toggleNavigator();
                return;
            case ToolbarIconEnum.CATALOG:
                this.toggleCatalog();
                return;
            case ToolbarIconEnum.INVENTORY:
                this.toggleInventory();
                return;
            case ToolbarIconEnum.FRIEND_LIST:
                this.toggleFriendList();
                return;
            case ToolbarIconEnum.ME_MENU:
                this.toggleMeMenu();

                Nitro.instance.roomEngine.events.dispatchEvent(new NitroToolbarEvent(NitroToolbarEvent.SELECT_OWN_AVATAR));
                return;
        }
    }

    public animateToIcon(iconName: string, image: HTMLImageElement, x: number, y: number): void
    {
        if(!iconName || !image || !this.navigationListElement) return;

        iconName  = this.getIconName(iconName);

        if(iconName === '') return;

        const target = (this.navigationListElement.getElementsByClassName(iconName)[0] as HTMLElement);

        if(target)
        {
            image.className         = 'toolbar-icon-animation';
            image.style.visibility  = 'visible';
            image.style.left        = (x + 'px');
            image.style.top         = (y + 'px');

            document.body.append(image);

            const targetBounds  = target.getBoundingClientRect();
            const imageBounds   = image.getBoundingClientRect();

            const left    = (imageBounds.x - targetBounds.x);
            const top     = (imageBounds.y - targetBounds.y);
            const squared = Math.sqrt(((left * left) + (top * top)));
            const wait    = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
            const height  = 20;

            const motionName = (`ToolbarBouncing[${ iconName }]`);

            if(!Motions.getMotionByTag(motionName))
            {
                Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
            }

            const _local_19 = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image));

            Motions.runMotion(_local_19);
        }
    }

    public getIconName(icon: string): string
    {
        switch(icon)
        {
            case ToolbarIconEnum.HOTEL_VIEW:
                return 'icon-hotelview';
            case ToolbarIconEnum.NAVIGATOR:
                return 'icon-navigator';
            case ToolbarIconEnum.CATALOG:
                return 'icon-catalog';
            case ToolbarIconEnum.INVENTORY:
                return 'icon-inventory';
            default:
                return '';
        }
    }

    public toggleCatalog(): void
    {
        this.settingsService.toggleCatalog();
    }

    public toggleInventory(): void
    {
        this.settingsService.toggleInventory();
    }

    public toggleFriendList(): void
    {
        this.settingsService.toggleFriendList();
        document.getElementById('newMessageArrivedIcon').classList.remove('newMessage');
    }

    public toggleNavigator(): void
    {
        this.settingsService.toggleNavigator();
    }

    public toggleMeMenu(): void
    {
        this.settingsService.toggleMeMenu();
    }

    public visitDesktop(): void
    {
        if(Nitro.instance.roomSessionManager.getSession(-1))
        {
            Nitro.instance.communication.connection.send(new DesktopViewComposer());

            Nitro.instance.roomSessionManager.removeSession(-1);
        }
    }

    public visitHomeRoom(): void
    {
        this._navigatorService.goToHomeRoom();
    }

    public get figure(): string
    {
        return this.sessionService.figure;
    }

    public get navigationListElement(): HTMLElement
    {
        return ((this.navigationList && this.navigationList.nativeElement) || null);
    }

    public get unseenInventoryCount(): number
    {
        return this._inventoryService.unseenCount;
    }

    public get unseenFriendListCount(): number
    {
        return this._friendListService.notificationCount;
    }

    public get unseenAchievementsCount(): number
    {
        return this._achievementService.unseenCount;
    }

    public yukselt(): void
    {
        if (this.acikMi == false)
        {
            this.acac = 'friends-box-acik';
            this.acikMi = true;
        }
        else
        {
            this.acac = 'friends-box-kapali';
            this.acikMi = false;
        }
    }

    public get friends(): MessengerFriend[]
    {
        const friends = Array.from(this._friendListService.friends.values());
        return friends.filter(friend =>
        {
            return friend.online;
        });
    }

    public openFriendsProfilePage(id: number)
    {
        Nitro.instance.createLinkEvent('profile/goto/' + id);
    }

    public followFriend(id: number)
    {
        Nitro.instance.communication.connection.send(new FollowFriendComposer(id));
    }

    public toggleFriendOptions(id: number)
    {
        if (this.currentOpenedFriendOptions != 0 && this.currentOpenedFriendOptions !== id)
        {
            document.getElementById('friends_' + this.currentOpenedFriendOptions).style.height = '36px';
            document.getElementById('friends_' + this.currentOpenedFriendOptions).style.bottom = '';
            document.getElementById('friends_' + this.currentOpenedFriendOptions).style.background = '';
            document.getElementById('friends_' + this.currentOpenedFriendOptions).style.borderTop = '';
            document.getElementById('friends_' + this.currentOpenedFriendOptions).style.borderBottom = '';
            document.getElementById('friends_' + this.currentOpenedFriendOptions).style.zIndex = '';
        }

        if (this.currentOpenedFriendOptions === id)
        {
            document.getElementById('friends_' + id).style.height = '';
            document.getElementById('friends_' + id).style.bottom = '';
            document.getElementById('friends_' + id).style.background = '';
            document.getElementById('friends_' + id).style.borderTop = '';
            document.getElementById('friends_' + id).style.borderBottom = '';
            document.getElementById('friends_' + id).style.zIndex = '';
            this.currentOpenedFriendOptions = 0;
        }
        else
        {
            document.getElementById('friends_' + id).style.height = '65px';
            document.getElementById('friends_' + id).style.bottom = '-11px';
            document.getElementById('friends_' + id).style.background = '#008427';
            document.getElementById('friends_' + id).style.borderTop = 'solid 4px #0abd1e6e';
            document.getElementById('friends_' + id).style.borderBottom = 'solid 4px #066321';
            document.getElementById('friends_' + id).style.zIndex = '1';
            this.currentOpenedFriendOptions = id;
        }
    }

    public openFriendChat(id: number)
    {
        const thread = this._friendListService.getMessageThread(id);
        this.settingsService.showFriendList();
        if (!thread) return;
        this._friendListService.component.selectThread(thread);
    }
}
