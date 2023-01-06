import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';

export const RoomCatalogView : FC<{}> = props =>
{
    const sso = new URLSearchParams(window.location.search).get('sso');
    const [ isVisible, setIsVisible ] = useState(false)
    const [allRooms, setAllRooms] = useState(null);
    const [allCreditRooms, setAllCreditRooms] = useState(null);
    const [allDucketRooms, setAllDucketRooms] = useState(null);
    const [allDiamondRooms, setAllDiamondRooms] = useState(null);
    const [allMyRooms, setAllMyRooms] = useState(null);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'show':
                        fetch("https://hgalaxy.net/system/controllers/eha.php?getRoomsOnSale")
                        .then(response => response.json())
                        .then((response) => { 
                            setAllRooms(response);
                        })

                        fetch("https://hgalaxy.net/system/controllers/eha.php?getRoomsOnSaleCredits")
                        .then(response => response.json())
                        .then((response) => { 
                            setAllCreditRooms(response);
                        })

                        fetch("https://hgalaxy.net/system/controllers/eha.php?getRoomsOnSaleDuckets")
                        .then(response => response.json())
                        .then((response) => { 
                            setAllDucketRooms(response);
                        })

                        fetch("https://hgalaxy.net/system/controllers/eha.php?getRoomsOnSaleDiamonds")
                        .then(response => response.json())
                        .then((response) => { 
                            setAllDiamondRooms(response);
                        })

                        fetch("https://hgalaxy.net/system/controllers/eha.php?getRoomsOnSaleUser&sso="+sso)
                        .then(response => response.json())
                        .then((response) => { 
                            setAllMyRooms(response);
                        })
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                }
            },
            eventUrlPrefix: 'roomcatalog/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    function getNameOfCoin(type){
        if(type === 1) return "créditos";
        else if(type  === 2) return "asteroides";
        else return "cometas";
    }

    function goToRoom(roomId){
        fetch("https://hgalaxy.net/system/controllers/eha.php?roomId="+roomId+"&sso="+sso);
        setIsVisible(false);
    }

    function deleteRoomOffer(roomId){
        fetch("https://hgalaxy.net/system/controllers/eha.php?deleteRoomOnSale="+roomId);
        setIsVisible(false);
    }

    function buyRoomOffer(roomId, roomOwner, type, quantity){
        fetch("https://hgalaxy.net/system/controllers/eha.php?roomOwner="+roomOwner+"&roomId="+roomId+"&coinType="+type+"&coinQuantity="+quantity+"&sso="+sso);
        setIsVisible(false);
    }

    return (
        <>
            { isVisible &&
                <NitroCardView style={{width: "750px", height: "550px"}}>
                <NitroCardHeaderView headerText="Mercadillo de salas"  onCloseClick={ event => setIsVisible(false) }/>
                <NitroCardContentView className="text-dark">
                    <Tabs defaultActiveKey="all" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="all" title="Salas en venta" style={{color: "var(--test-galaxytext)"}}>
                            <div className="row">
                                { allRooms != null &&
                                <>
                                    { allRooms.map((room) => 
                                        <div className="col-md-4" style={{marginBottom: "10px"}}>
                                            <div className="card">
                                                <img src={room.image}  style={{height: "150px"}} />
                                                <div className="card-body">
                                                    <span style={{marginBottom: "5px"}} className="badge bg-dark">{room.name}</span><br/>
                                                    <span className="badge bg-light text-dark">{room.owner}</span>&nbsp;<span className="badge bg-info">{room.price} {getNameOfCoin(room.type)}</span><br/>
                                                    <div style={{marginTop: "5px"}}>
                                                        <button onClick={() => goToRoom(room.room_id)} className="btn btn-primary btn-sm w-100">Visitar sala</button>
                                                        <button onClick={() => buyRoomOffer(room.room_id, room.owner, room.type, room.price)} style={{marginTop: "2px"}} className="btn btn-success btn-sm w-100">Comprar sala</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>}
                            </div>
                        </Tab>
                        <Tab eventKey="cometas" title="Salas por cometas" style={{color: "var(--test-galaxytext)"}}>
                            <div className="row">
                                { allDiamondRooms != null &&
                                <>
                                    { allDiamondRooms.map((room) => 
                                        <div className="col-md-4" style={{marginBottom: "10px"}}>
                                            <div className="card">
                                                <img src={room.image}  style={{height: "150px"}} />
                                                <div className="card-body">
                                                    <span style={{marginBottom: "5px"}} className="badge bg-dark">{room.name}</span><br/>
                                                    <span className="badge bg-light text-dark">{room.owner}</span>&nbsp;<span className="badge bg-info">{room.price} {getNameOfCoin(room.type)}</span><br/>
                                                    <div style={{marginTop: "5px"}}>
                                                        <button onClick={() => goToRoom(room.room_id)} className="btn btn-primary btn-sm w-100">Visitar sala</button>
                                                        <button onClick={() => buyRoomOffer(room.room_id, room.owner, room.type, room.quantity)} style={{marginTop: "2px"}} className="btn btn-success btn-sm w-100">Comprar sala</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>}
                            </div>
                        </Tab>
                        <Tab eventKey="asteroides" title="Salas por asteroides" style={{color: "var(--test-galaxytext)"}}>
                            <div className="row">
                                { allDucketRooms != null &&
                                <>
                                    { allDucketRooms.map((room) => 
                                        <div className="col-md-4" style={{marginBottom: "10px"}}>
                                            <div className="card">
                                                <img src={room.image}  style={{height: "150px"}} />
                                                <div className="card-body">
                                                    <span style={{marginBottom: "5px"}} className="badge bg-dark">{room.name}</span><br/>
                                                    <span className="badge bg-light text-dark">{room.owner}</span>&nbsp;<span className="badge bg-info">{room.price} {getNameOfCoin(room.type)}</span><br/>
                                                    <div style={{marginTop: "5px"}}>
                                                        <button onClick={() => goToRoom(room.room_id)} className="btn btn-primary btn-sm w-100">Visitar sala</button>
                                                        <button onClick={() => buyRoomOffer(room.room_id, room.owner, room.type, room.quantity)}  style={{marginTop: "2px"}} className="btn btn-success btn-sm w-100">Comprar sala</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>}
                            </div>
                        </Tab>
                        <Tab eventKey="creditos" title="Salas por créditos" style={{color: "var(--test-galaxytext)"}}>
                            <div className="row">
                                { allCreditRooms != null &&
                                <>
                                    { allCreditRooms.map((room) => 
                                        <div className="col-md-4" style={{marginBottom: "10px"}}>
                                            <div className="card">
                                                <img src={room.image}  style={{height: "150px"}} />
                                                <div className="card-body">
                                                    <span style={{marginBottom: "5px"}} className="badge bg-dark">{room.name}</span><br/>
                                                    <span className="badge bg-light text-dark">{room.owner}</span>&nbsp;<span className="badge bg-info">{room.price} {getNameOfCoin(room.type)}</span><br/>
                                                    <div style={{marginTop: "5px"}}>
                                                        <button onClick={() => goToRoom(room.room_id)} className="btn btn-primary btn-sm w-100">Visitar sala</button>
                                                        <button onClick={() => buyRoomOffer(room.room_id, room.owner, room.type, room.quantity)}  style={{marginTop: "2px"}} className="btn btn-success btn-sm w-100">Comprar sala</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>}
                            </div>
                        </Tab>
                        <Tab eventKey="megass" title="Mis salas en venta" style={{color: "var(--test-galaxytext)"}}>
                            <div className="row">
                                { allMyRooms != null &&
                                <>
                                    { allMyRooms.map((room) => 
                                        <div className="col-md-4" style={{marginBottom: "10px"}}>
                                            <div className="card">
                                                <img src={room.image}  style={{height: "150px"}} />
                                                <div className="card-body">
                                                    <span style={{marginBottom: "5px"}} className="badge bg-dark">{room.name}</span><br/>
                                                    <span className="badge bg-light text-dark">{room.owner}</span>&nbsp;<span className="badge bg-info">{room.price} {getNameOfCoin(room.type)}</span><br/>
                                                    <div style={{marginTop: "5px"}}>
                                                        <button onClick={() => goToRoom(room.room_id)} className="btn btn-primary btn-sm w-100">Visitar sala</button>
                                                        <button onClick={() => deleteRoomOffer(room.room_id)} style={{marginTop: "2px"}} className="btn btn-danger btn-sm w-100">Borrar oferta</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>}
                            </div>
                        </Tab>
                    </Tabs>
                </NitroCardContentView>
            </NitroCardView>
            }
        </>
    );
}
