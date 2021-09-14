import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomDataParser } from '@nitrots/nitro-renderer';
import { NavigatorService } from '../../services/navigator.service';

@Component({
    selector: '[nitro-navigator-room-password-component]',
    templateUrl: './password.template.html'
})
export class NavigatorPasswordComponent
{
    @Input()
    public room: RoomDataParser = null;

    @Input()
    public isWrongPassword: boolean = false;

    public password: string = '';

    constructor(
        private _navigatorService: NavigatorService,
        private _activeModal: NgbActiveModal)
    {}

    public tryPassword(): void
    {
        if(!this.room) return;

        if(!this.password) return;

        this._navigatorService.goToRoom(this.room.roomId, this.password);

        this.hide();
    }

    public close(): void
    {
        this._navigatorService.component.closeRoomPassword();
    }

    public hide(): void
    {
        this._activeModal.close();
    }
}
