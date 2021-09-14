export class UserToolUser
{

    private readonly _id: number;
    private readonly _username: string;
    private readonly _gender: string;
    private readonly _figure: string;

    constructor(id: number, username: string, figure: string = null, gender: string = null)
    {
        this._id = id;
        this._username = username;
        this._figure = figure;
        this._gender = gender;
    }

    public get id(): number
    {
        return this._id;
    }

    public get username(): string
    {
        return this._username;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get gender(): string
    {
        return this._gender;
    }
}
