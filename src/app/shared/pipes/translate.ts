import { Pipe, PipeTransform } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform
{
    public transform(key: string, parameter: string | string[] = null, replacement: string | string[] = null): string
    {
        if((parameter && Array.isArray(parameter)) && (replacement && Array.isArray(replacement)))
        {
            if(parameter.length === replacement.length) return Nitro.instance.getLocalizationWithParameters(key, parameter, replacement);
        }

        if(parameter && replacement) return Nitro.instance.getLocalizationWithParameter(key, (parameter as string), (replacement as string));

        return Nitro.instance.getLocalization(key);
    }
}
