import { FC, useEffect, useState } from 'react';
import { CreateRoomSession, DoorStateType, GoToDesktop, LocalizeText } from '../../../api';
import { Button, Column, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../common';
import { useNavigatorContext } from '../NavigatorContext';

const VISIBLE_STATES = [ DoorStateType.START_DOORBELL, DoorStateType.STATE_WAITING, DoorStateType.STATE_NO_ANSWER, DoorStateType.START_PASSWORD, DoorStateType.STATE_WRONG_PASSWORD ];
const DOORBELL_STATES = [ DoorStateType.START_DOORBELL, DoorStateType.STATE_WAITING, DoorStateType.STATE_NO_ANSWER ];
const PASSWORD_STATES = [ DoorStateType.START_PASSWORD, DoorStateType.STATE_WRONG_PASSWORD ];

export const NavigatorDoorStateView: FC<{}> = props =>
{
    const [ password, setPassword ] = useState('');
    const { doorData = null, setDoorData = null } = useNavigatorContext();

    const close = () =>
    {
        if(doorData && (doorData.state === DoorStateType.STATE_WAITING)) GoToDesktop();

        setDoorData(null);
    }

    const ring = () =>
    {
        if(!doorData || !doorData.roomInfo) return;

        CreateRoomSession(doorData.roomInfo.roomId);
        
        setDoorData(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.state = DoorStateType.STATE_PENDING_SERVER;

            return newValue;
        });
    }

    const tryEntering = () =>
    {
        if(!doorData || !doorData.roomInfo) return;

        CreateRoomSession(doorData.roomInfo.roomId, password);

        setDoorData(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.state = DoorStateType.STATE_PENDING_SERVER;

            return newValue;
        });
    }

    useEffect(() =>
    {
        if(!doorData || (doorData.state !== DoorStateType.STATE_NO_ANSWER)) return;

        GoToDesktop();
    }, [ doorData ]);

    if(!doorData || (doorData.state === DoorStateType.NONE) || (VISIBLE_STATES.indexOf(doorData.state) === -1)) return null;

    const isDoorbell = (DOORBELL_STATES.indexOf(doorData.state) >= 0);

    return (
        <NitroCardView className="nitro-navigator-doorbell" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText(isDoorbell ? 'navigator.doorbell.title' : 'navigator.password.title') } onCloseClick={ close } />
            <NitroCardContentView>
                <Column gap={ 1 }>
                    <Text variant="none" style={{color: "var(--test-galaxytext)"}} bold>{ doorData && doorData.roomInfo && doorData.roomInfo.roomName }</Text>
                    { (doorData.state === DoorStateType.START_DOORBELL) &&
                        <Text variant="none" style={{color: "var(--test-galaxytext)"}}>{ LocalizeText('navigator.doorbell.info') }</Text> }
                    { (doorData.state === DoorStateType.STATE_WAITING) &&
                        <Text variant="none" style={{color: "var(--test-galaxytext)"}}>{ LocalizeText('navigator.doorbell.waiting') }</Text> }
                    { (doorData.state === DoorStateType.STATE_NO_ANSWER) &&
                        <Text variant="none" style={{color: "var(--test-galaxytext)"}}>{ LocalizeText('navigator.doorbell.no.answer') }</Text> }
                    { (doorData.state === DoorStateType.START_PASSWORD) &&
                        <Text variant="none" style={{color: "var(--test-galaxytext)"}}>{ LocalizeText('navigator.password.info') }</Text> }
                    { (doorData.state === DoorStateType.STATE_WRONG_PASSWORD) &&
                        <Text variant="none" style={{color: "var(--test-galaxytext)"}}>{ LocalizeText('navigator.password.retryinfo') }</Text> }
                </Column>
                { isDoorbell &&
                    <Column gap={ 1 }>
                        { (doorData.state === DoorStateType.START_DOORBELL) &&
                            <Button variant="success" onClick={ ring }>
                                { LocalizeText('navigator.doorbell.button.ring') }
                            </Button> }
                        <Button variant="danger" onClick={ close }>
                            { LocalizeText('generic.cancel') }
                        </Button>
                    </Column> }
                { !isDoorbell &&
                    <>
                        <Column gap={ 1 }>
                            <Text variant="none" style={{color: "var(--test-galaxytext)"}}>{ LocalizeText('navigator.password.enter') }</Text>
                            <input type="password" className="form-control form-control-sm" onChange={ event => setPassword(event.target.value) } />
                        </Column>
                        <Column gap={ 1 }>
                            <Button variant="success" onClick={ tryEntering }>
                                { LocalizeText('navigator.password.button.try') }
                            </Button>
                            <Button variant="danger" onClick={ close }>
                                { LocalizeText('generic.cancel') }
                            </Button>
                        </Column>
                    </> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
