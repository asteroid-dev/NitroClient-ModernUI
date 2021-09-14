import { IFurnitureData, Nitro, NitroEvent, ObjectDataFactory, PetFigureData, PetType, RoomAdsUpdateComposer, RoomControllerLevel, RoomModerationSettings, RoomObjectCategory, RoomObjectOperationType, RoomObjectType, RoomObjectVariable, RoomSessionPetInfoUpdateEvent, RoomSessionUserBadgesEvent, RoomTradingLevelEnum, RoomUnitDropHandItemComposer, RoomUnitGiveHandItemComposer, RoomUserData, RoomWidgetEnum, RoomWidgetEnumItemExtradataParameter, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { RoomObjectNameEvent } from '../events/RoomObjectNameEvent';
import { RoomWidgetChatInputContentUpdateEvent } from '../events/RoomWidgetChatInputContentUpdateEvent';
import { RoomWidgetFurniInfostandUpdateEvent } from '../events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetPetInfostandUpdateEvent } from '../events/RoomWidgetPetInfostandUpdateEvent';
import { RoomWidgetRentableBotInfostandUpdateEvent } from '../events/RoomWidgetRentableBotInfostandUpdateEvent';
import { RoomWidgetUpdateInfostandUserEvent } from '../events/RoomWidgetUpdateInfostandUserEvent';
import { RoomInfoStandMainComponent } from '../infostand/components/main/main.component';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetChangeMottoMessage } from '../messages/RoomWidgetChangeMottoMessage';
import { RoomWidgetFurniActionMessage } from '../messages/RoomWidgetFurniActionMessage';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetUserActionMessage } from '../messages/RoomWidgetUserActionMessage';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class InfoStandWidgetHandler implements IRoomWidgetHandler
{
    private static ACTIVITY_POINTS_DISPLAY_ENABLED: boolean = true;

    private _container: IRoomWidgetManager;
    private _widget: RoomInfoStandMainComponent;

    private _disposed: boolean;

    constructor()
    {
        this.container = null;
        this._widget    = null;

        this._disposed  = false;

        this.onRoomSessionPetInfoUpdateEvent = this.onRoomSessionPetInfoUpdateEvent.bind(this);
    }

    public dispose(): void
    {
        if(this.disposed) return;

        this.container = null;

        this._disposed  = true;
    }

    public update(): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || !this._container) return null;

        let userId                  = 0;
        let userData: RoomUserData  = null;

        if(message instanceof RoomWidgetUserActionMessage)
        {
            userId = message.userId;

            const petMessages = [
                RoomWidgetUserActionMessage.RWUAM_REQUEST_PET_UPDATE,
                RoomWidgetUserActionMessage.RWUAM_RESPECT_PET,
                RoomWidgetUserActionMessage.RWUAM_PICKUP_PET,
                RoomWidgetUserActionMessage.RWUAM_MOUNT_PET,
                RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_RIDING_PERMISSION,
                RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_BREEDING_PERMISSION,
                RoomWidgetUserActionMessage.RWUAM_DISMOUNT_PET,
                RoomWidgetUserActionMessage.RWUAM_SADDLE_OFF,
                RoomWidgetUserActionMessage.RWUAM_GIVE_CARRY_ITEM_TO_PET,
                RoomWidgetUserActionMessage.RWUAM_GIVE_WATER_TO_PET,
                RoomWidgetUserActionMessage.RWUAM_GIVE_LIGHT_TO_PET,
                RoomWidgetUserActionMessage.RWUAM_TREAT_PET
            ];

            if(petMessages.indexOf(message.type) >= 0)
            {
                userData = this._container.roomSession.userDataManager.getPetData(userId);
            }
            else
            {
                userData = this._container.roomSession.userDataManager.getUserData(userId);
            }

            if(!userData) return null;
        }

        let objectId        = 0;
        let objectCategory  = 0;

        if(message instanceof RoomWidgetFurniActionMessage)
        {
            objectId        = message.furniId;
            objectCategory  = message.furniCategory;
        }

        switch(message.type)
        {
            case RoomWidgetRoomObjectMessage.GET_OBJECT_INFO:
                return this.processObjectInfoMessage((message as RoomWidgetRoomObjectMessage));
            case RoomWidgetRoomObjectMessage.GET_OBJECT_NAME:
                return this.processObjectNameMessage((message as RoomWidgetRoomObjectMessage));
            case RoomWidgetUserActionMessage.RWUAM_SEND_FRIEND_REQUEST:
                this._container.friendService.sendFriendRequest(userId, userData.name);
                break;
            case RoomWidgetUserActionMessage.RWUAM_RESPECT_USER:
                this._container.sessionDataManager.giveRespect(userId);
                break;
            case RoomWidgetUserActionMessage.RWUAM_RESPECT_PET:
                this._container.sessionDataManager.givePetRespect(userId);
                break;
            case RoomWidgetUserActionMessage.RWUAM_WHISPER_USER:
                this._container.events.dispatchEvent(new RoomWidgetChatInputContentUpdateEvent(RoomWidgetChatInputContentUpdateEvent.WHISPER, userData.name));
                break;
            case RoomWidgetUserActionMessage.RWUAM_IGNORE_USER:
                this._container.sessionDataManager.ignoreUser(userData.name);
                break;
            case RoomWidgetUserActionMessage.RWUAM_UNIGNORE_USER:
                this._container.sessionDataManager.unignoreUser(userData.name);
                break;
            case RoomWidgetUserActionMessage.RWUAM_KICK_USER:
                this._container.roomSession.sendKickMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.RWUAM_BAN_USER_DAY:
            case RoomWidgetUserActionMessage.RWUAM_BAN_USER_HOUR:
            case RoomWidgetUserActionMessage.RWUAM_BAN_USER_PERM:
                this._container.roomSession.sendBanMessage((message as RoomWidgetUserActionMessage).userId, message.type);
                break;
            case RoomWidgetUserActionMessage.MUTE_USER_2MIN:
                this._container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 2);
                break;
            case RoomWidgetUserActionMessage.MUTE_USER_5MIN:
                this._container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 5);
                break;
            case RoomWidgetUserActionMessage.MUTE_USER_10MIN:
                this._container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 10);
                break;
            case RoomWidgetUserActionMessage.RWUAM_GIVE_RIGHTS:
                this._container.roomSession.sendGiveRightsMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.RWUAM_TAKE_RIGHTS:
                this._container.roomSession.sendTakeRightsMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.RWUAM_START_TRADING:
                if(userData) this._widget.inventoryTrading.startTrade(userData.roomIndex, userData.name);
                break;
            // case RoomWidgetUserActionMessage.RWUAM_OPEN_HOME_PAGE:
            //     this._container.sessionDataManager._Str_21275((message as RoomWidgetUserActionMessage).userId, _local_3.name);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_PICKUP_PET:
            //     this._container.roomSession._Str_13781(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_MOUNT_PET:
            //     this._container.roomSession._Str_21066(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_RIDING_PERMISSION:
            //     this._container.roomSession._Str_21025(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_BREEDING_PERMISSION:
            //     this._container.roomSession._Str_21562(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_DISMOUNT_PET:
            //     this._container.roomSession._Str_19075(_local_2);
            //     break;
            // case RoomWidgetUserActionMessage.RWUAM_SADDLE_OFF:
            //     this._container.roomSession._Str_21635(_local_2);
            //     break;
            case RoomWidgetUserActionMessage.RWUAM_PASS_CARRY_ITEM:
                this._container.connection.send(new RoomUnitGiveHandItemComposer(userId));
                break;
            case RoomWidgetUserActionMessage.RWUAM_GIVE_CARRY_ITEM_TO_PET:
                //this._container.connection.send(new RoomUnitGiveHandItemComposer(userId));
                break;
            case RoomWidgetUserActionMessage.RWUAM_GIVE_WATER_TO_PET:
                //this._container.connection.send(new _Str_7251(_local_2, PetSupplementEnum._Str_9473));
                break;
            case RoomWidgetUserActionMessage.RWUAM_GIVE_LIGHT_TO_PET:
                //this._container.connection.send(new _Str_7251(_local_2, PetSupplementEnum._Str_8421));
                break;
            case RoomWidgetUserActionMessage.RWUAM_TREAT_PET:
                //this._container.connection.send(new _Str_8184(_local_2));
                break;
            case RoomWidgetUserActionMessage.RWUAM_DROP_CARRY_ITEM:
                this._container.connection.send(new RoomUnitDropHandItemComposer());
                break;
            case RoomWidgetFurniActionMessage.RWFUAM_ROTATE:
                this._container.roomEngine.processRoomObjectOperation(objectId, objectCategory, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                break;
            case RoomWidgetFurniActionMessage.RWFAM_MOVE:
                this._container.roomEngine.processRoomObjectOperation(objectId, objectCategory, RoomObjectOperationType.OBJECT_MOVE);
                break;
            case RoomWidgetFurniActionMessage.RWFAM_PICKUP:
                this._container.roomEngine.processRoomObjectOperation(objectId, objectCategory, RoomObjectOperationType.OBJECT_PICKUP);
                break;
            case RoomWidgetFurniActionMessage.RWFAM_EJECT:
                this._container.roomEngine.processRoomObjectOperation(objectId, objectCategory, RoomObjectOperationType.OBJECT_EJECT);
                break;
            case RoomWidgetFurniActionMessage.RWFAM_USE:
                this._container.roomEngine.useRoomObject(objectId, objectCategory);
                break;
            case RoomWidgetChangeMottoMessage.RWVM_CHANGE_MOTTO_MESSAGE:
                this._container.roomSession.sendMottoMessage((message as RoomWidgetChangeMottoMessage).motto);
                return;
            case RoomWidgetFurniActionMessage.RWFAM_SAVE_STUFF_DATA: {
                const _local_10 = (message as RoomWidgetFurniActionMessage).objectData;
                if(_local_10)
                {
                    const _local_19 = new Map<string,string>();

                    const _local_20 = _local_10.split('\t');

                    if(_local_20)
                    {
                        for(const _local_21 of _local_20)
                        {
                            const _local_22 = _local_21.split('=', 2);

                            if(_local_22 && _local_22.length === 2)
                            {
                                const _local_23 = _local_22[0];
                                const _local_24 = _local_22[1];

                                _local_19.set(_local_23, _local_24);
                            }
                        }
                    }

                    this._container.roomEngine.processRoomObjectWallOperation(objectId, objectCategory, RoomObjectOperationType.OBJECT_SAVE_STUFF_DATA, _local_19);
                    this._Str_23922(_local_19);
                    _local_19.clear();
                }
                break;
            }
            case RoomWidgetUserActionMessage.RWUAM_REQUEST_PET_UPDATE:
                if(this._container.roomSession && this._container.roomSession.userDataManager) this._container.roomSession.userDataManager.requestPetInfo(userId);
                break;
            case RoomWidgetUserActionMessage.RWUAM_REPORT:
                break;
            case RoomWidgetUserActionMessage.RWUAM_REPORT_CFH_OTHER:
                break;
            case RoomWidgetUserActionMessage.RWUAM_AMBASSADOR_ALERT_USER:
                this._container.roomSession.sendAmbassadorAlertMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.RWUAM_AMBASSADOR_KICK_USER:
                this._container.roomSession.sendKickMessage((message as RoomWidgetUserActionMessage).userId);
                break;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_2MIN:
                this._container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 2);
                break;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_10MIN:
                this._container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 10);
                break;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_60MIN:
                this._container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 60);
                break;
            case RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_18HOUR:
                this._container.roomSession.sendMuteMessage((message as RoomWidgetUserActionMessage).userId, 1080);
                break;
        }

        return null;
    }

    public processEvent(k: NitroEvent): void
    {
        if(!event) return;

        switch(k.type)
        {
            case RoomSessionUserBadgesEvent.RSUBE_BADGES: {
                const badgesEvent = (k as RoomSessionUserBadgesEvent);

                this.widget.updateUserBadges(badgesEvent.userId, badgesEvent.badges);
                return;
            }
        }
    }

    private processObjectInfoMessage(message: RoomWidgetRoomObjectMessage): RoomWidgetUpdateEvent
    {
        const roomId = this._container.roomSession.roomId;

        switch(message.category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL:
                this._Str_23142(message, roomId);
                break;
            case RoomObjectCategory.UNIT: {
                if(!this._container.roomSession || !this._container.sessionDataManager || !this._container.events || !this._container.roomEngine) return null;

                const userData = this._container.roomSession.userDataManager.getUserDataByIndex(message.id);

                if(!userData) return null;

                switch(userData.type)
                {
                    case RoomObjectType.PET:
                        this.selectPet(userData.webID);
                        break;
                    case RoomObjectType.USER:
                        this._Str_22722(roomId, message.id, message.category, userData);
                        break;
                    case RoomObjectType.BOT:
                        this._Str_22312(roomId, message.id, message.category, userData);
                        break;
                    case RoomObjectType.RENTABLE_BOT:
                        this._Str_23115(roomId, message.id, message.category, userData);
                        break;
                }
                break;
            }
        }

        return null;
    }

    private processObjectNameMessage(k: RoomWidgetRoomObjectMessage): RoomWidgetUpdateEvent
    {
        const roomId = this._container.roomSession.roomId;

        let id          = 0;
        let name: string        = null;
        let type        = 0;
        let roomIndex   = 0;

        switch(k.category)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL: {
                if(!this._container.events || !this._container.roomEngine) return null;

                const roomObject    = this._container.roomEngine.getRoomObject(roomId, k.id, k.category);
                const objectType    = roomObject.type;

                if(objectType.indexOf('poster') === 0)
                {
                    id          = -1;
                    name        = ('${poster_' + parseInt(objectType.replace('poster', '')) + '_name}');
                    roomIndex   = roomObject.id;
                }
                else
                {
                    let furniData: IFurnitureData = null;

                    const typeId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

                    if(k.category === RoomObjectCategory.FLOOR)
                    {
                        furniData = this._container.sessionDataManager.getFloorItemData(typeId);
                    }

                    else if(k.category === RoomObjectCategory.WALL)
                    {
                        furniData = this._container.sessionDataManager.getWallItemData(typeId);
                    }

                    if(!furniData) return null;

                    id          = furniData.id;
                    name        = furniData.name;
                    roomIndex   = roomObject.id;
                }
                break;
            }
            case RoomObjectCategory.UNIT: {
                if(!this._container.roomSession || !this._container.roomSession.userDataManager) return null;

                const userData = this._container.roomSession.userDataManager.getUserDataByIndex(k.id);

                if(!userData) return null;

                id          = userData.webID;
                name        = userData.name;
                type        = userData.type;
                roomIndex   = userData.roomIndex;
                break;
            }
        }

        if(name) this._container.events.dispatchEvent(new RoomObjectNameEvent(id, k.category, name, type, roomIndex));

        return null;
    }

    private _Str_23142(k: RoomWidgetRoomObjectMessage, _arg_2: number): void
    {
        if(!this._container || !this._container.events || !this._container.roomEngine) return;

        if(k.id < 0) return;

        const infostandEvent = new RoomWidgetFurniInfostandUpdateEvent(RoomWidgetFurniInfostandUpdateEvent.FURNI);

        infostandEvent.id       = k.id;
        infostandEvent.category = k.category;

        const roomObject = this._container.roomEngine.getRoomObject(_arg_2, k.id, k.category);

        if(!roomObject) return;

        const model = roomObject.model;

        if(model.getValue<string>(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM))
        {
            infostandEvent.extraParam = model.getValue<string>(RoomWidgetEnumItemExtradataParameter.INFOSTAND_EXTRA_PARAM);
        }

        const dataFormat    = model.getValue<number>(RoomObjectVariable.FURNITURE_DATA_FORMAT);
        const objectData    = ObjectDataFactory.getData(dataFormat);

        objectData.initializeFromRoomObjectModel(model);

        infostandEvent.stuffData = objectData;

        const objectType = roomObject.type;

        if(objectType.indexOf('poster') === 0)
        {
            const _local_13 = parseInt(objectType.replace('poster', ''));

            infostandEvent.name         = (('${poster_' + _local_13) + '_name}');
            infostandEvent.description  = (('${poster_' + _local_13) + '_desc}');
        }
        else
        {
            const _local_14 = model.getValue<number>(RoomObjectVariable.FURNITURE_TYPE_ID);

            let furnitureData: IFurnitureData = null;

            if(k.category === RoomObjectCategory.FLOOR)
            {
                furnitureData = this._container.sessionDataManager.getFloorItemData(_local_14);
            }

            else if(k.category == RoomObjectCategory.WALL)
            {
                furnitureData = this._container.sessionDataManager.getWallItemData(_local_14);
            }

            if(furnitureData)
            {
                infostandEvent.name                         = furnitureData.name;
                infostandEvent.description                  = furnitureData.description;
                infostandEvent.purchaseOfferId              = furnitureData.purchaseOfferId;
                infostandEvent.purchaseCouldBeUsedForBuyout = furnitureData.purchaseCouldBeUsedForBuyout;
                infostandEvent.rentOfferId                  = furnitureData.rentOfferId;
                infostandEvent.rentCouldBeUsedForBuyout     = furnitureData.rentCouldBeUsedForBuyout;
                infostandEvent.availableForBuildersClub     = furnitureData.availableForBuildersClub;

                if(this._container.wiredService && (k.category === RoomObjectCategory.FLOOR))
                {
                    this._container.wiredService.selectFurniture(roomObject.id, furnitureData.name);
                }
            }
        }

        if(objectType.indexOf('post_it') > -1)
        {
            infostandEvent.isStickie = true;
        }

        const expiryTime        = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRY_TIME);
        const expiryTimestamp   = model.getValue<number>(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP);

        infostandEvent.expiration = ((expiryTime < 0) ? expiryTime : Math.max(0, (expiryTime - ((Nitro.instance.time - expiryTimestamp) / 1000))));

        let roomObjectImage = this._container.roomEngine.getRoomObjectImage(_arg_2, k.id, k.category, new Vector3d(180), 64, null);

        if(!roomObjectImage.data || (roomObjectImage.data.width > 140) || (roomObjectImage.data.height > 200))
        {
            roomObjectImage = this._container.roomEngine.getRoomObjectImage(_arg_2, k.id, k.category, new Vector3d(180), 1, null);
        }

        if(roomObjectImage && roomObjectImage.data)
        {
            const image = TextureUtils.generateImage(roomObjectImage.data);

            if(image) infostandEvent.image = image;
        }

        infostandEvent.isWallItem           = (k.category === RoomObjectCategory.WALL);
        infostandEvent.isRoomOwner          = this._container.roomSession.isRoomOwner;
        infostandEvent.roomControllerLevel  = this._container.roomSession.controllerLevel;
        infostandEvent.isAnyRoomOwner       = this._container.sessionDataManager.isModerator;
        infostandEvent.ownerId              = model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);
        infostandEvent.ownerName            = model.getValue<string>(RoomObjectVariable.FURNITURE_OWNER_NAME);
        infostandEvent.usagePolicy          = model.getValue<number>(RoomObjectVariable.FURNITURE_USAGE_POLICY);

        const guildId = model.getValue<number>(RoomObjectVariable.FURNITURE_GUILD_CUSTOMIZED_GUILD_ID);

        if(guildId !== 0)
        {
            infostandEvent.groupId = guildId;
            //this.container.connection.send(new _Str_2863(guildId, false));
        }

        if(this._container.isOwnerOfFurniture(roomObject))
        {
            infostandEvent.isOwner = true;
        }

        this._container.events.dispatchEvent(infostandEvent);

        // if (((!(infostandEvent._Str_2415 == null)) && (infostandEvent._Str_2415.length > 0)))
        // {
        //     _local_16 = -1;
        //     _local_17 = '';
        //     _local_18 = '';
        //     _local_19 = '';
        //     if (infostandEvent._Str_2415 == RoomWidgetEnumItemExtradataParameter.JUKEBOX)
        //     {
        //         _local_20 = this._musicController._Str_6500();
        //         if (_local_20 != null)
        //         {
        //             _local_16 = _local_20._Str_13794;
        //             _local_19 = RoomWidgetSongUpdateEvent.PLAYING_CHANGED;
        //         }
        //     }
        //     else
        //     {
        //         if (infostandEvent._Str_2415.indexOf(RoomWidgetEnumItemExtradataParameter.SONGDISK) == 0)
        //         {
        //             _local_21 = infostandEvent._Str_2415.substr(RoomWidgetEnumItemExtradataParameter.SONGDISK.length);
        //             _local_16 = parseInt(_local_21);
        //             _local_19 = RoomWidgetSongUpdateEvent.DATA_RECEIVED;
        //         }
        //     }
        //     if (_local_16 != -1)
        //     {
        //         _local_22 = this._musicController._Str_3255(_local_16);
        //         if (_local_22 != null)
        //         {
        //             _local_17 = _local_22.name;
        //             _local_18 = _local_22.creator;
        //         }
        //         this._container.events.dispatchEvent(new RoomWidgetSongUpdateEvent(_local_19, _local_16, _local_17, _local_18));
        //     }
        // }
    }

    private selectPet(id: number): void
    {
        this._container.roomSession.userDataManager.requestPetInfo(id);
    }

    private _Str_22722(roomId: number, roomIndex: number, category: number, _arg_4: RoomUserData): void
    {
        let eventType = RoomWidgetUpdateInfostandUserEvent.OWN_USER;

        if(_arg_4.webID !== this._container.sessionDataManager.userId)
        {
            eventType = RoomWidgetUpdateInfostandUserEvent.PEER;
        }

        const event = new RoomWidgetUpdateInfostandUserEvent(eventType);

        event.isSpectator   = this._container.roomSession.isSpectator;
        event.name          = _arg_4.name;
        event.motto         = _arg_4.custom;

        if(InfoStandWidgetHandler.ACTIVITY_POINTS_DISPLAY_ENABLED)
        {
            event.activityPoints = _arg_4.activityPoints;
        }

        event.webID     = _arg_4.webID;
        event.roomIndex = roomIndex;
        event.userType = RoomObjectType.USER;

        const roomObject = this._container.roomEngine.getRoomObject(roomId, roomIndex, category);

        if(roomObject)
        {
            event.carryId = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);
        }

        if(eventType == RoomWidgetUpdateInfostandUserEvent.OWN_USER)
        {
            event.realName = this._container.sessionDataManager.realName;
            event._Str_4330 = this._container.sessionDataManager.canChangeName;
        }

        event.isRoomOwner           = this._container.roomSession.isRoomOwner;
        event.isGuildRoom           = this._container.roomSession.isGuildRoom;
        event.roomControllerLevel   = this._container.roomSession.controllerLevel;
        event.isModerator           = this._container.sessionDataManager.isModerator;
        event.isAmbassador          = this._container.sessionDataManager.isAmbassador;

        if(eventType === RoomWidgetUpdateInfostandUserEvent.PEER)
        {
            event.canBeAskedForAFriend = this._container.friendService.canBeAskedForAFriend(_arg_4.webID);

            const friend = this._container.friendService.getFriend(_arg_4.webID);

            if(friend)
            {
                event.realName  = friend.realName;
                event.isFriend  = true;
            }

            if(roomObject)
            {
                const flatControl = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_FLAT_CONTROL);

                if(flatControl !== null) event.flatControl = flatControl;

                event._Str_6394 = this._Str_23100(event);
                event._Str_5990 = this._Str_22729(event);
                event._Str_6701 = this._Str_23573(event);
            }

            event.isIgnored     = this._container.sessionDataManager.isUserIgnored(_arg_4.name);
            event.respectLeft   = this._container.sessionDataManager.respectsLeft;

            const isShuttingDown    = this._container.sessionDataManager.isSystemShutdown;
            const tradeMode         = this._container.roomSession.tradeMode;

            if(isShuttingDown)
            {
                event.canTrade = false;
            }
            else
            {
                switch(tradeMode)
                {
                    case RoomTradingLevelEnum.ROOM_CONTROLLER_REQUIRED: {
                        const _local_15 = ((event.roomControllerLevel !== RoomControllerLevel.NONE) && (event.roomControllerLevel !== RoomControllerLevel.GUILD_MEMBER));
                        const _local_16 = ((event.flatControl !== RoomControllerLevel.NONE) && (event.flatControl !== RoomControllerLevel.GUILD_MEMBER));

                        event.canTrade = ((_local_15) || (_local_16));
                        break;
                    }
                    case RoomTradingLevelEnum.FREE_TRADING:
                        event.canTrade = true;
                        break;
                    default:
                        event.canTrade = false;
                        break;
                }
            }

            event._Str_6622 = RoomWidgetUpdateInfostandUserEvent._Str_18400;

            if(isShuttingDown) event._Str_6622 = RoomWidgetUpdateInfostandUserEvent._Str_14161;

            if(tradeMode !== RoomTradingLevelEnum.FREE_TRADING) event._Str_6622 = RoomWidgetUpdateInfostandUserEvent._Str_13798;

            // const _local_12 = this._container.sessionDataManager.userId;
            // _local_13 = this._container.sessionDataManager._Str_18437(_local_12);
            // this._Str_16287(_local_12, _local_13);
        }

        event.groupId = parseInt(_arg_4.guildId);
        //event._Str_5235 = this._container.sessionDataManager._Str_17173(int(_arg_4._Str_4592));
        event.groupName = _arg_4.groupName;
        event.badges = this._container.roomSession.userDataManager.getUserBadges(_arg_4.webID);
        event.figure = _arg_4.figure;
        this._container.events.dispatchEvent(event);
        //var _local_8:Array = this._container.sessionDataManager._Str_18437(_arg_4.webID);
        //this._Str_16287(_arg_4._Str_2394, _local_8);
        //this._container._Str_8097._Str_14387(_arg_4.webID);
        //this._container.connection.send(new _Str_8049(_arg_4._Str_2394));
    }

    private _Str_22312(roomId: number, roomIndex: number, category: number, _arg_4: RoomUserData): void
    {
        const event = new RoomWidgetUpdateInfostandUserEvent(RoomWidgetUpdateInfostandUserEvent.BOT);

        event.name          = _arg_4.name;
        event.motto         = _arg_4.custom;
        event.webID         = _arg_4.webID;
        event.roomIndex     = roomIndex;
        event.userType      = _arg_4.type;

        const roomObject = this._container.roomEngine.getRoomObject(roomId, roomIndex, category);

        if(roomObject)
        {
            event.carryId = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);
        }

        event.isRoomOwner           = this._container.roomSession.isRoomOwner;
        event.isGuildRoom           = this._container.roomSession.isGuildRoom;
        event.roomControllerLevel   = this._container.roomSession.controllerLevel;
        event.isModerator           = this._container.sessionDataManager.isModerator;
        event._Str_5990             = this._container.roomSession.isRoomOwner;
        event.badges                = [ RoomWidgetUpdateInfostandUserEvent._Str_7492 ];
        event.figure                = _arg_4.figure;

        this._container.events.dispatchEvent(event);
    }

    private _Str_23115(roomId: number, roomIndex: number, category: number, _arg_4: RoomUserData): void
    {
        const event = new RoomWidgetRentableBotInfostandUpdateEvent();

        event.name          = _arg_4.name;
        event.motto         = _arg_4.custom;
        event.id            = _arg_4.webID;
        event.roomIndex     = roomIndex;
        event.ownerId       = _arg_4.ownerId;
        event.ownerName     = _arg_4.ownerName;
        event.botSkills     = _arg_4.botSkills;

        const roomObject = this._container.roomEngine.getRoomObject(roomId, roomIndex, category);

        if(roomObject)
        {
            event.carryId = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);
        }

        event._Str_3246             = this._container.roomSession.isRoomOwner;
        event.roomControllerLevel   = this._container.roomSession.controllerLevel;
        event._Str_3529             = this._container.sessionDataManager.isModerator;
        event.badges                = [ RoomWidgetUpdateInfostandUserEvent._Str_7492 ];
        event.figure                = _arg_4.figure;

        this._container.events.dispatchEvent(event);
    }

    private _Str_9213(event: RoomWidgetUpdateInfostandUserEvent): boolean
    {
        if(event.isGuildRoom) return (event.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN);

        return (event.roomControllerLevel >= RoomControllerLevel.GUEST);
    }

    private _Str_23100(userInfo:RoomWidgetUpdateInfostandUserEvent): boolean
    {
        const settingsFunction = function (event: RoomWidgetUpdateInfostandUserEvent, moderation: RoomModerationSettings): boolean
        {
            switch(moderation.allowMute)
            {
                case RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS:
                    return this._Str_9213(event);
                default:
                    return (event.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }.bind(this);

        return this._Str_18027(userInfo, settingsFunction);
    }

    private _Str_22729(userInfo:RoomWidgetUpdateInfostandUserEvent): boolean
    {
        const settingsFunction = function(event: RoomWidgetUpdateInfostandUserEvent, _arg_2: RoomModerationSettings): boolean
        {
            switch(_arg_2.allowKick)
            {
                case RoomModerationSettings.MODERATION_LEVEL_ALL:
                    return true;
                case RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS:
                    return this._Str_9213(event);
                default:
                    return (event.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }.bind(this);

        return this._Str_18027(userInfo, settingsFunction);
    }

    private _Str_23573(userInfo:RoomWidgetUpdateInfostandUserEvent): boolean
    {
        const settingsFunction = function(event: RoomWidgetUpdateInfostandUserEvent, _arg_2: RoomModerationSettings): boolean
        {
            switch(_arg_2.allowBan)
            {
                case RoomModerationSettings.MODERATION_LEVEL_USER_WITH_RIGHTS:
                    return this._Str_9213(event);
                default:
                    return (event.roomControllerLevel >= RoomControllerLevel.ROOM_OWNER);
            }
        }.bind(this);

        return this._Str_18027(userInfo, settingsFunction);
    }

    private _Str_18027(event: RoomWidgetUpdateInfostandUserEvent, _arg_2: Function): boolean
    {
        if(!this._container.roomSession._Str_7411) return false;

        const moderationSettings = this._container.roomSession.moderationSettings;

        let flag = false;

        if(moderationSettings) flag = _arg_2(event, moderationSettings);

        return (flag && (event.flatControl < RoomControllerLevel.ROOM_OWNER));
    }

    // public  _Str_23922(k:Map):void
    public _Str_23922(k:Map<string,string>):void
    {
        if(!this._widget) return;

        if(this._container.sessionDataManager.hasSecurity(5))
        {
            // TODO: Map should be `k`
            this._container.connection.send(new RoomAdsUpdateComposer(this._widget.furniData.id, k));
        }
    }

    private onRoomSessionPetInfoUpdateEvent(event: RoomSessionPetInfoUpdateEvent): void
    {
        if(!event || !this._container || !this._container.events) return;

        const petData = event.petInfo;

        if(!petData) return;

        const roomUserData = this._container.roomSession.userDataManager.getPetData(petData.id);

        if(!roomUserData) return;

        const figure = roomUserData.figure;
        const figureData = new PetFigureData(figure);

        const _local_5 = this.getPetType(figure);
        const _local_6 = this.getPetBreed(figure);

        let _local_7: string = null;

        if(_local_5 === PetType.MONSTERPLANT)
        {
            if(petData.level >= petData.adultLevel) _local_7 = 'std';
            else _local_7 = ('grw' + petData.level);
        }

        // var _local_8:String = (_local_4 + ((_local_7 != null) ? ("/posture=" + _local_7) : ""));
        // var _local_9:BitmapData = (this._cachedPetImages.getValue(_local_8) as BitmapData);
        // if (_local_9 == null)
        // {
        //     _local_9 = this._Str_2641(_local_4, _local_7);
        //     this._cachedPetImages.add(_local_8, _local_9);
        // }

        const isOwner = (petData.ownerId === this._container.sessionDataManager.userId);
        const infostandEvent = new RoomWidgetPetInfostandUpdateEvent(_local_5, _local_6, roomUserData.name, petData.id, figureData, isOwner, petData.ownerId, petData.ownerName, roomUserData.roomIndex, petData.rarityLevel);

        infostandEvent.level               = petData.level;
        infostandEvent.maximumLevel        = petData.maximumLevel;
        infostandEvent.experience          = petData.experience;
        infostandEvent.levelExperienceGoal = petData.levelExperienceGoal;
        infostandEvent.energy              = petData.energy;
        infostandEvent.maximumEnergy       = petData.maximumEnergy;
        infostandEvent.happyness           = petData.happyness;
        infostandEvent.maximumHappyness    = petData.maximumHappyness;
        infostandEvent.respect             = petData.respect;
        infostandEvent._Str_2985           = this._container.sessionDataManager.respectsPetLeft;
        infostandEvent.age                 = petData.age;
        infostandEvent.saddle              = petData.saddle;
        infostandEvent.rider               = petData.rider;
        infostandEvent.breedable           = petData.breedable;
        infostandEvent.fullyGrown          = petData.fullyGrown;
        infostandEvent.dead                = petData.dead;
        infostandEvent.rarityLevel         = petData.rarityLevel;
        infostandEvent._Str_3307           = petData.skillTresholds;
        infostandEvent._Str_5114           = false;
        infostandEvent.publiclyRideable    = petData.publiclyRideable;
        infostandEvent.maximumTimeToLive   = petData.maximumTimeToLive;
        infostandEvent.remainingTimeToLive = petData.remainingTimeToLive;
        infostandEvent.remainingGrowTime   = petData.remainingGrowTime;
        infostandEvent.publiclyBreedable   = petData.publiclyBreedable;

        const roomSession = this._container.roomSession;

        if(isOwner)
        {
            infostandEvent._Str_5114 = true;
        }
        else
        {
            if(roomSession.isRoomOwner || this._container.sessionDataManager.isModerator || (roomSession.controllerLevel >= RoomControllerLevel.GUEST)) infostandEvent._Str_5114 = true;
        }

        this._container.events.dispatchEvent(infostandEvent);
    }

    private getPetType(figure: string): number
    {
        return this.getPetFigurePart(figure, 0);
    }

    private getPetBreed(figure: string): number
    {
        return this.getPetFigurePart(figure, 1);
    }

    private getPetFigurePart(figure: string, index: number): number
    {
        if(!figure || !figure.length) return -1;

        const parts = figure.split(' ');

        if(parts.length > 0) return parseInt(parts[index]);

        return -1;
    }

    public get type(): string
    {
        return RoomWidgetEnum.INFOSTAND;
    }

    public get messageTypes(): string[]
    {
        const types: string[] = [
            RoomWidgetRoomObjectMessage.GET_OBJECT_INFO,
            RoomWidgetRoomObjectMessage.GET_OBJECT_NAME,
            RoomWidgetUserActionMessage.RWUAM_SEND_FRIEND_REQUEST,
            RoomWidgetUserActionMessage.RWUAM_RESPECT_USER,
            RoomWidgetUserActionMessage.RWUAM_WHISPER_USER,
            RoomWidgetUserActionMessage.RWUAM_IGNORE_USER,
            RoomWidgetUserActionMessage.RWUAM_UNIGNORE_USER,
            RoomWidgetUserActionMessage.RWUAM_KICK_USER,
            RoomWidgetUserActionMessage.RWUAM_BAN_USER_DAY,
            RoomWidgetUserActionMessage.RWUAM_BAN_USER_HOUR,
            RoomWidgetUserActionMessage.RWUAM_BAN_USER_PERM,
            RoomWidgetUserActionMessage.MUTE_USER_2MIN,
            RoomWidgetUserActionMessage.MUTE_USER_5MIN,
            RoomWidgetUserActionMessage.MUTE_USER_10MIN,
            RoomWidgetUserActionMessage.RWUAM_GIVE_RIGHTS,
            RoomWidgetUserActionMessage.RWUAM_TAKE_RIGHTS,
            RoomWidgetUserActionMessage.RWUAM_START_TRADING,
            RoomWidgetUserActionMessage.RWUAM_OPEN_HOME_PAGE,
            RoomWidgetUserActionMessage.RWUAM_PASS_CARRY_ITEM,
            RoomWidgetUserActionMessage.RWUAM_GIVE_CARRY_ITEM_TO_PET,
            RoomWidgetUserActionMessage.RWUAM_DROP_CARRY_ITEM,
            RoomWidgetFurniActionMessage.RWFAM_MOVE,
            RoomWidgetFurniActionMessage.RWFUAM_ROTATE,
            RoomWidgetFurniActionMessage.RWFAM_EJECT,
            RoomWidgetFurniActionMessage.RWFAM_PICKUP,
            RoomWidgetFurniActionMessage.RWFAM_USE,
            RoomWidgetFurniActionMessage.RWFAM_SAVE_STUFF_DATA,
            RoomWidgetUserActionMessage.RWUAM_REPORT,
            RoomWidgetUserActionMessage.RWUAM_PICKUP_PET,
            RoomWidgetUserActionMessage.RWUAM_MOUNT_PET,
            RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_RIDING_PERMISSION,
            RoomWidgetUserActionMessage.RWUAM_TOGGLE_PET_BREEDING_PERMISSION,
            RoomWidgetUserActionMessage.RWUAM_DISMOUNT_PET,
            RoomWidgetUserActionMessage.RWUAM_SADDLE_OFF,
            RoomWidgetUserActionMessage.RWUAM_TRAIN_PET,
            RoomWidgetUserActionMessage.RWUAM_RESPECT_PET,
            RoomWidgetUserActionMessage.RWUAM_REQUEST_PET_UPDATE,
            RoomWidgetChangeMottoMessage.RWVM_CHANGE_MOTTO_MESSAGE,
            RoomWidgetUserActionMessage.RWUAM_GIVE_LIGHT_TO_PET,
            RoomWidgetUserActionMessage.RWUAM_GIVE_WATER_TO_PET,
            RoomWidgetUserActionMessage.RWUAM_TREAT_PET,
            RoomWidgetUserActionMessage.RWUAM_REPORT_CFH_OTHER,
            RoomWidgetUserActionMessage.RWUAM_AMBASSADOR_ALERT_USER,
            RoomWidgetUserActionMessage.RWUAM_AMBASSADOR_KICK_USER,
            RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_2MIN,
            RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_10MIN,
            RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_60MIN,
            RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_18HOUR
        ];
        //k.push(RoomWidgetPetCommandMessage.RWPCM_PET_COMMAND);
        //k.push(RoomWidgetPetCommandMessage.RWPCM_REQUEST_PET_COMMANDS);
        //k.push(RoomWidgetOpenProfileMessage.RWOPEM_OPEN_USER_PROFILE);
        //k.push(RoomWidgetPresentOpenMessage.RWPOM_OPEN_PRESENT);

        return types;
    }

    public get eventTypes(): string[]
    {
        return [ RoomSessionUserBadgesEvent.RSUBE_BADGES ];
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public set container(k: IRoomWidgetManager)
    {
        if(this._container)
        {
            if(this._container.roomSessionManager)
            {
                this._container.roomSessionManager.events.removeEventListener(RoomSessionPetInfoUpdateEvent.PET_INFO, this.onRoomSessionPetInfoUpdateEvent);
            }
        }

        this._container = k;

        if(this._container)
        {
            if(this._container.roomSessionManager)
            {
                this._container.roomSessionManager.events.addEventListener(RoomSessionPetInfoUpdateEvent.PET_INFO, this.onRoomSessionPetInfoUpdateEvent);
            }
        }
    }

    public get widget(): RoomInfoStandMainComponent
    {
        return this._widget;
    }

    public set widget(widget: RoomInfoStandMainComponent)
    {
        this._widget = widget;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}
