import { Triggerable, WiredActionDefinition } from '@nitrots/nitro-renderer';
import { WiredFurniture } from '../../WiredFurniture';

export class WiredAction extends WiredFurniture
{
    public delay: number = 0;

    public onEditStart(trigger: Triggerable): void
    {
        this.delay = (trigger as WiredActionDefinition).delayInPulses;
    }
}
