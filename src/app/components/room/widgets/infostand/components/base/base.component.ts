import { RoomWidgetUpdateEvent } from '../../../RoomWidgetUpdateEvent';
import { RoomInfoStandMainComponent } from '../main/main.component';

export class RoomInfoStandBaseComponent
{
    public widget: RoomInfoStandMainComponent = null;

    public hide(): void
    {
        this.widget.close();
    }

    public update(event: RoomWidgetUpdateEvent): void
    {

    }

    public get type(): number
    {
        return -1;
    }
}
