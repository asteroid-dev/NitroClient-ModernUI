import { Component, ElementRef, ViewChild } from '@angular/core';
import { AvatarContextInfoView } from '../../common/AvatarContextInfoView';

@Component({
    selector: 'nitro-room-avatarinfo-name-component',
    templateUrl: './name.template.html'
})
export class RoomAvatarInfoNameComponent extends AvatarContextInfoView
{
    @ViewChild('activeView')
    public activeView: ElementRef<HTMLDivElement>;

    public isFriend?: boolean = false;

    public static setup(view: RoomAvatarInfoNameComponent, userId: number, userName: string, userType: number, roomIndex: number, willFade: boolean = false): void
    {
        view.willFade = willFade;

        AvatarContextInfoView.extendedSetup(view, userId, userName, userType, roomIndex);
    }
}
