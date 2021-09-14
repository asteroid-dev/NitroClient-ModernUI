export class BadgeBaseAndLevel
{
    public constructor(private badgeId: string)
    {
        this.parseText();
    }

    private _base: string = '';

    private _level: number = 1;

    private  parseText() :void
    {
        let length = (this.badgeId.length - 1);

        while(length > 0 && this.isNumber(this.badgeId.charAt(length)))
        {
            length--;
        }

        this._base = this.badgeId.substr(0, (length + 1));

        const level = this.badgeId.substr((length + 1), this.badgeId.length);

        if(level && level != '')
        {
            this._level = Number.parseInt(level);
        }
    }

    private isNumber(text: string): boolean
    {
        const char = text.charCodeAt(0);

        return (char >= 49 && char <= 57);
    }

    public set level(k :number)
    {
        this._level = Math.max(1, k);
    }

    public get level()
    {
        return this._level;
    }

    public get getBadgeId(): string
    {
        return this._base + this._level;
    }

    public get base(): string
    {
        return this._base;
    }



}
