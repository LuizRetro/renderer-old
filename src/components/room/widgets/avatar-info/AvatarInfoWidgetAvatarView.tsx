import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RoomControllerLevel, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CreateLinkEvent, GetOwnRoomObject, GetUserProfile, LocalizeText, RoomWidgetMessage, RoomWidgetUpdateInfostandUserEvent, RoomWidgetUserActionMessage } from '../../../../api';
import { Base, Flex } from '../../../../common';
import { useFriends } from '../../../../hooks';
import { useRoomContext } from '../../RoomContext';
import { ContextMenuHeaderView } from '../context-menu/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../context-menu/ContextMenuListItemView';
import { ContextMenuView } from '../context-menu/ContextMenuView';

interface AvatarInfoWidgetAvatarViewProps
{
    userData: RoomWidgetUpdateInfostandUserEvent;
    close: () => void;
}

const MODE_NORMAL = 0;
const MODE_MODERATE = 1;
const MODE_MODERATE_BAN = 2;
const MODE_MODERATE_MUTE = 3;
const MODE_AMBASSADOR = 4;
const MODE_AMBASSADOR_MUTE = 5;
const MODE_RELATIONSHIP = 6;

export const AvatarInfoWidgetAvatarView: FC<AvatarInfoWidgetAvatarViewProps> = props =>
{
    const { userData = null, close = null } = props;
    const [ mode, setMode ] = useState(MODE_NORMAL);
    const [ respectsLeft, setRespectsLeft ] = useState(0);
    const { canRequestFriend = null } = useFriends();
    const { widgetHandler = null } = useRoomContext();

    const isShowGiveRights = useMemo(() =>
    {
        return (userData.amIOwner && (userData.targetRoomControllerLevel < RoomControllerLevel.GUEST) && !userData.isGuildRoom);
    }, [ userData ]);

    const isShowRemoveRights = useMemo(() =>
    {
        return (userData.amIOwner && (userData.targetRoomControllerLevel === RoomControllerLevel.GUEST) && !userData.isGuildRoom);
    }, [ userData ]);

    const moderateMenuHasContent = useMemo(() =>
    {
        return (userData.canBeKicked || userData.canBeBanned || userData.canBeMuted || isShowGiveRights || isShowRemoveRights);
    }, [ isShowGiveRights, isShowRemoveRights, userData ]);

    const canGiveHandItem = useMemo(() =>
    {
        let flag = false;

        const roomObject = GetOwnRoomObject();

        if(roomObject)
        {
            const carryId = roomObject.model.getValue<number>(RoomObjectVariable.FIGURE_CARRY_OBJECT);

            if((carryId > 0) && (carryId < 999999)) flag = true;
        }

        return flag;
    }, []);

    const processAction = useCallback((name: string) =>
    {
        let messageType: string = null;
        let message: RoomWidgetMessage = null;
        let hideMenu = true;

        if(name)
        {
            switch(name)
            {
                case 'moderate':
                    hideMenu = false;
                    setMode(MODE_MODERATE);
                    break;
                case 'ban':
                    hideMenu = false;
                    setMode(MODE_MODERATE_BAN);
                    break;
                case 'mute':
                    hideMenu = false;
                    setMode(MODE_MODERATE_MUTE);
                    break;
                case 'ambassador':
                    hideMenu = false;
                    setMode(MODE_AMBASSADOR);
                    break;
                case 'ambassador_mute':
                    hideMenu = false;
                    setMode(MODE_AMBASSADOR_MUTE);
                    break;
                case 'back_moderate':
                    hideMenu = false;
                    setMode(MODE_MODERATE);
                    break;
                case 'back_ambassador':
                    hideMenu = false;
                    setMode(MODE_AMBASSADOR);
                    break;
                case 'back':
                    hideMenu = false;
                    setMode(MODE_NORMAL);
                    break;
                case 'whisper':
                    messageType = RoomWidgetUserActionMessage.WHISPER_USER;
                    break;
                case 'friend':
                    CreateLinkEvent(`friends/request/${ userData.webID }/${ userData.name }`);
                    break;
                case 'relationship':
                    hideMenu = false;
                    setMode(MODE_RELATIONSHIP);
                    break;
                case 'respect': {
                    let newRespectsLeft = (respectsLeft - 1);
                    
                    setRespectsLeft(newRespectsLeft);

                    messageType = RoomWidgetUserActionMessage.RESPECT_USER;

                    if(newRespectsLeft > 0) hideMenu = false;
                    break;
                }
                case 'ignore':
                    messageType = RoomWidgetUserActionMessage.IGNORE_USER;
                    break;
                case 'unignore':
                    messageType = RoomWidgetUserActionMessage.UNIGNORE_USER;
                    break;
                case 'kick':
                    messageType = RoomWidgetUserActionMessage.KICK_USER;
                    break;
                case 'ban_hour':
                    messageType = RoomWidgetUserActionMessage.BAN_USER_HOUR;
                    break;
                case 'ban_day':
                    messageType = RoomWidgetUserActionMessage.BAN_USER_DAY;
                    break;
                case 'perm_ban':
                    messageType = RoomWidgetUserActionMessage.BAN_USER_PERM;
                    break;
                case 'mute_2min':
                    messageType = RoomWidgetUserActionMessage.MUTE_USER_2MIN;
                    break;
                case 'mute_5min':
                    messageType = RoomWidgetUserActionMessage.MUTE_USER_5MIN;
                    break;
                case 'mute_10min':
                    messageType = RoomWidgetUserActionMessage.MUTE_USER_10MIN;
                    break;
                case 'give_rights':
                    messageType = RoomWidgetUserActionMessage.GIVE_RIGHTS;
                    break;
                case 'remove_rights':
                    messageType = RoomWidgetUserActionMessage.TAKE_RIGHTS;
                    break;
                case 'trade':
                    messageType = RoomWidgetUserActionMessage.START_TRADING;
                    break;
                case 'report':
                    messageType = RoomWidgetUserActionMessage.REPORT_CFH_OTHER;
                    break;
                case 'pass_hand_item':
                    messageType = RoomWidgetUserActionMessage.PASS_CARRY_ITEM;
                    break;
                case 'ambassador_alert':
                    messageType = RoomWidgetUserActionMessage.AMBASSADOR_ALERT_USER;
                    break;
                case 'ambassador_kick':
                    messageType = RoomWidgetUserActionMessage.AMBASSADOR_KICK_USER;
                    break;
                case 'ambassador_mute_2min':
                    messageType = RoomWidgetUserActionMessage.MUTE_USER_2MIN;
                    break;
                case 'ambassador_mute_10min':
                    messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_10MIN;
                    break;
                case 'ambassador_mute_60min':
                    messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_60MIN;
                    break;
                case 'ambassador_mute_18hour':
                    messageType = RoomWidgetUserActionMessage.AMBASSADOR_MUTE_USER_18HOUR;
                    break;
                case 'rship_heart':
                    messageType = RoomWidgetUserActionMessage.RELATIONSHIP_HEART;
                    break;
                case 'rship_smile':
                    messageType = RoomWidgetUserActionMessage.RELATIONSHIP_SMILE;
                    break;
                case 'rship_bobba':
                    messageType = RoomWidgetUserActionMessage.RELATIONSHIP_BOBBA;
                    break;
                case 'rship_none':
                    messageType = RoomWidgetUserActionMessage.RELATIONSHIP_NONE;
                    break;
            }

            if(messageType) message = new RoomWidgetUserActionMessage(messageType, userData.webID);

            if(message) widgetHandler.processWidgetMessage(message);
        }

        if(hideMenu) close();
    }, [ userData, respectsLeft, widgetHandler, close, ]);

    useEffect(() =>
    {
        setMode(MODE_NORMAL);
        setRespectsLeft(userData.respectLeft);
    }, [ userData ]);

    return (
        <ContextMenuView objectId={ userData.roomIndex } category={ RoomObjectCategory.UNIT } userType={ userData.userType } close={ close } collapsable={ true }>
            <ContextMenuHeaderView className="cursor-pointer" onClick={ event => GetUserProfile(userData.webID) }>
                { userData.name }
            </ContextMenuHeaderView>
            { (mode === MODE_NORMAL) &&
                <>
                    { canRequestFriend(userData.webID) &&
                        <ContextMenuListItemView onClick={ event => processAction('friend') }>
                        <i className="icon icon-agregar" />{ LocalizeText('infostand.button.friend') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('trade') }>
                        <i className="icon icon-cambiar" />{ LocalizeText('infostand.button.trade') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('whisper') }>
                        <i className="icon icon-susurrar" />{ LocalizeText('infostand.button.whisper') }
                    </ContextMenuListItemView>
                    { (respectsLeft > 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('respect') }>
                            <i className="icon icon-respetos" />{ LocalizeText('infostand.button.respect', [ 'count' ], [ respectsLeft.toString() ]) }
                        </ContextMenuListItemView> }
                    { !canRequestFriend(userData.webID) &&
                        <ContextMenuListItemView onClick={ event => processAction('relationship') }>
                            <i className="icon icon-relacion" />{ LocalizeText('infostand.link.relationship') }
                            <FontAwesomeIcon icon="chevron-right" className="right" />
                        </ContextMenuListItemView> }
                    { !userData.isIgnored &&
                        <ContextMenuListItemView onClick={ event => processAction('ignore') }>
                            <i className="icon icon-ignorar" />{ LocalizeText('infostand.button.ignore') }
                        </ContextMenuListItemView> }
                    { userData.isIgnored &&
                        <ContextMenuListItemView onClick={ event => processAction('unignore') }>
                            <i className="icon icon-ignorar" />{ LocalizeText('infostand.button.unignore') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('report') }>
                        <i className="icon icon-reportar" />{ LocalizeText('infostand.button.report') }
                    </ContextMenuListItemView>
                    { moderateMenuHasContent &&
                        <ContextMenuListItemView onClick={ event => processAction('moderate') }>
                            <FontAwesomeIcon icon="chevron-right" className="right" />
                                <i className="icon icon-moderar" />{ LocalizeText('infostand.link.moderate') }
                        </ContextMenuListItemView> }
                    { userData.isAmbassador &&
                        <ContextMenuListItemView onClick={ event => processAction('ambassador') }>
                            <FontAwesomeIcon icon="chevron-right" className="right" />
                                <i className="icon icon-embajador" />{ LocalizeText('infostand.link.ambassador') }
                        </ContextMenuListItemView> }
                    { canGiveHandItem && <ContextMenuListItemView onClick={ event => processAction('pass_hand_item') }>
                        { LocalizeText('avatar.widget.pass_hand_item') }
                    </ContextMenuListItemView> }
                </> }
            { (mode === MODE_MODERATE) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('kick') }>
                        { LocalizeText('infostand.button.kick') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('mute') }>
                        <FontAwesomeIcon icon="chevron-right" className="right" />
                        { LocalizeText('infostand.button.mute') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('ban') }>
                        <FontAwesomeIcon icon="chevron-right" className="right" />
                        { LocalizeText('infostand.button.ban') }
                    </ContextMenuListItemView>
                    { isShowGiveRights &&
                        <ContextMenuListItemView onClick={ event => processAction('give_rights') }>
                            { LocalizeText('infostand.button.giverights') }
                        </ContextMenuListItemView> }
                    { isShowRemoveRights &&
                        <ContextMenuListItemView onClick={ event => processAction('remove_rights') }>
                            { LocalizeText('infostand.button.removerights') }
                        </ContextMenuListItemView> }
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <FontAwesomeIcon icon="chevron-left" className="left" />
                        { LocalizeText('generic.back') }
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_MODERATE_BAN) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('ban_hour') }>
                        { LocalizeText('infostand.button.ban_hour') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('ban_day') }>
                        { LocalizeText('infostand.button.ban_day') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('ban_perm') }>
                        { LocalizeText('infostand.button.perm_ban') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('back_moderate') }>
                        <FontAwesomeIcon icon="chevron-left" className="left" />
                        { LocalizeText('generic.back') }
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_MODERATE_MUTE) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('mute_2min') }>
                        { LocalizeText('infostand.button.mute_2min') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('mute_5min') }>
                        { LocalizeText('infostand.button.mute_5min') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('mute_10min') }>
                        { LocalizeText('infostand.button.mute_10min') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('back_moderate') }>
                        <FontAwesomeIcon icon="chevron-left" className="left" />
                        { LocalizeText('generic.back') }
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_AMBASSADOR) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('ambassador_alert') }>
                        { LocalizeText('infostand.button.alert') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('ambassador_kick') }>
                        { LocalizeText('infostand.button.kick') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('ambassador_mute') }>
                        { LocalizeText('infostand.button.mute') }
                        <FontAwesomeIcon icon="chevron-right" className="right" />
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <FontAwesomeIcon icon="chevron-left" className="left" />
                        { LocalizeText('generic.back') }
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_AMBASSADOR_MUTE) &&
                <>
                    <ContextMenuListItemView onClick={ event => processAction('ambassador_mute_2min') }>
                        { LocalizeText('infostand.button.mute_2min') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('ambassador_mute_10min') }>
                        { LocalizeText('infostand.button.mute_10min') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('ambassador_mute_60min') }>
                        { LocalizeText('infostand.button.mute_60min') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('ambassador_mute_18hr') }>
                        { LocalizeText('infostand.button.mute_18hour') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('back_ambassador') }>
                        <FontAwesomeIcon icon="chevron-left" className="left" />
                        { LocalizeText('generic.back') }
                    </ContextMenuListItemView>
                </> }
            { (mode === MODE_RELATIONSHIP) &&
                <>
                    <Flex className="menu-list-split-3">
                        <ContextMenuListItemView onClick={ event => processAction('rship_heart') }>
                            <Base pointer className="nitro-friends-spritesheet icon-heart" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('rship_smile') }>
                            <Base pointer className="nitro-friends-spritesheet icon-smile" />
                        </ContextMenuListItemView>
                        <ContextMenuListItemView onClick={ event => processAction('rship_bobba') }>
                            <Base pointer className="nitro-friends-spritesheet icon-bobba" />
                        </ContextMenuListItemView>
                    </Flex>
                    <ContextMenuListItemView onClick={ event => processAction('rship_none') }>
                        { LocalizeText('avatar.widget.clear_relationship') }
                    </ContextMenuListItemView>
                    <ContextMenuListItemView onClick={ event => processAction('back') }>
                        <FontAwesomeIcon icon="chevron-left" className="left" />
                        { LocalizeText('generic.back') }
                    </ContextMenuListItemView>
                </> }
        </ContextMenuView>
    );
}
