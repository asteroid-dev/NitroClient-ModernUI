import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DesktopViewComposer, Nitro, RoomDataParser } from '@nitrots/nitro-renderer';
import { NavigatorService } from '../../services/navigator.service';

@Component({
    selector: '[nitro-navigator-room-doorbell-component]',
    templateUrl: './doorbell.template.html'
})
export class NavigatorDoorbellComponent
{
    @Input()
    public room: RoomDataParser = null;

    @Input()
    public isWaiting: boolean = false;

    @Input()
    public noAnswer: boolean = false;

    constructor(
        private _navigatorService: NavigatorService,
        private _activeModal: NgbActiveModal)
    {}

    public ring(): void
    {
        if(!this.room || this.isWaiting || this.noAnswer) return;

        this._navigatorService.goToRoom(this.room.roomId);

        this.hide();
    }

    public close(): void
    {
        this._navigatorService.component.closeRoomDoorbell();

        if(this.isWaiting)
        {
            Nitro.instance.communication.connection.send(new DesktopViewComposer());
        }
    }

    public hide(): void
    {
        this._activeModal.close();
    }
}
