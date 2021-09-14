import { Component, ElementRef, ViewChild } from '@angular/core';
import { AvatarContextInfoView } from '../../common/AvatarContextInfoView';
import { RoomAvatarInfoComponent } from '../main/main.component';

@Component({
    selector: 'nitro-room-avatarinfo-decorate-component',
    templateUrl: './decorate.template.html'
})
export class RoomAvatarInfoDecorateComponent extends AvatarContextInfoView
{
    @ViewChild('activeView')
    public activeView: ElementRef<HTMLDivElement>;

    public static setup(view: RoomAvatarInfoDecorateComponent, userId: number, userName: string, userType: number, roomIndex: number): void
    {
        view.willFade = false;

        AvatarContextInfoView.extendedSetup(view, userId, userName, userType, roomIndex);
    }

    public stopDecorating(): void
    {
        this.widget.isDecorating = false;
    }

    public get widget(): RoomAvatarInfoComponent
    {
        return (this.parent as RoomAvatarInfoComponent);
    }

    public get maximumOpacity(): number
    {
        return 0.8;
    }
}
