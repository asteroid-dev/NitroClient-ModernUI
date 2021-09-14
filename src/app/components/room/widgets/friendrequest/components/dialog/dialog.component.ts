import { Component, ElementRef, ViewChild } from '@angular/core';
import { Nitro, NitroPoint, NitroRectangle } from '@nitrots/nitro-renderer';
import { ContextInfoView } from '../../../contextmenu/ContextInfoView';
import { FriendRequestMainComponent } from '../main/main.component';

@Component({
    templateUrl: './dialog.template.html'
})
export class FriendRequestDialogComponent
{
    @ViewChild('activeView')
    public activeView: ElementRef<HTMLDivElement>;

    public parent: FriendRequestMainComponent = null;

    public requestId: number = 0;
    public userId: number = 0;
    public userName: string = '';

    public update(rectangle: NitroRectangle, point: NitroPoint): void
    {
        if(!rectangle)
        {
            this.hide();

            return;
        }

        let left    = Math.round(((rectangle.left + (rectangle.width / 2)) - (this.activeViewElement.offsetWidth / 2)));
        let top     = Math.round((rectangle.top - this.activeViewElement.offsetHeight) + 10);

        if(top <= 0) top = ContextInfoView.SPACE_AROUND_EDGES;

        if(top >= (Nitro.instance.height - this.activeViewElement.offsetHeight)) top = ((Nitro.instance.height - this.activeViewElement.offsetHeight) - ContextInfoView.SPACE_AROUND_EDGES);

        if(left >= (Nitro.instance.width - this.activeViewElement.offsetWidth)) left = ((Nitro.instance.width - this.activeViewElement.offsetWidth) - ContextInfoView.SPACE_AROUND_EDGES);

        this.activeViewElement.style.left = (left + 'px');
        this.activeViewElement.style.top  = (top + 'px');
    }

    public hide(): void
    {
        if(!this.parent) return;

        this.parent.removeFriendRequest(this.requestId);
    }

    public acceptFriendRequest(): void
    {
        if(!this.parent) return;

        this.parent.acceptFriendRequest(this.requestId);
    }

    public declineFriendRequest(): void
    {
        if(!this.parent) return;

        this.parent.declineFriendRequest(this.requestId);
    }

    public get activeViewElement(): HTMLDivElement
    {
        return ((this.activeView && this.activeView.nativeElement) || null);
    }
}
