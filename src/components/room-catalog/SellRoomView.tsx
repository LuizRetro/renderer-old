import { ILinkEventTracker, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetRoomEngine, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';

export const SellRoomView: FC<{}> = props =>
{
    const sso = new URLSearchParams(window.location.search).get('sso');
    const [ isVisible, setIsVisible ] = useState(false)
    const [ coinType, setCoinType ] = useState("1");
    const [ coinPrice, setCoinPrice ]  = useState("1")
    const [ alertText, setAlertText ] = useState(null);
    const [ roomName,  setRoomName ]  = useState("");
    const [ roomId, setRoomId ] = useState("0")

    function sendPostRoomSell(){
        setAlertText(null);
        const texture = GetRoomEngine().createTextureFromRoom(GetRoomEngine().activeRoomId, 1);
        const image = new Image();
        image.src = TextureUtils.generateImageUrl(texture);
        if(coinType !== "1" && coinType !== "2" && coinType !== "3"){
            setAlertText("Necesitas seleccionar un tipo de moneda");
            return;
        } 

        if(coinPrice === ""){
            setAlertText("Debes rellenar los datos");
            return;
        }

        if(coinPrice === "0"){
            setAlertText("No puedes vender una sala en 0");
            return;
        }

        if(roomName === ""){
            setAlertText("Debes escribir un nombre.");
            return;
        }

        var fd = new FormData();
        fd.append("roomImage", image.src);
        fd.append("roomId", roomId);
        fd.append("roomName", roomName);
        fd.append("priceType", coinType);
        fd.append("priceQuantity", coinPrice);
        fd.append("sso", sso);

        fetch("https://hgalaxy.net/system/controllers/eha.php", {method:"POST", body: fd})
        .then(response => response.text())
        .then((response) => { 
            if(response === "on sale" || response.includes("on sale")) setAlertText("Esta sala ya se encuentra en venta");
            else{
                setAlertText(null);
                setIsVisible(false);
            }
        })
    }

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
                        setRoomId(GetRoomEngine().activeRoomId.toString())
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                }
            },
            eventUrlPrefix: 'sellroom/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    return (
        <>
            { isVisible &&
                <NitroCardView>
                <NitroCardHeaderView headerText="Vender tu sala"  onCloseClick={ event => setIsVisible(false) }/>
                <NitroCardContentView>
                    <div className="alert alert-primary text-center">
                        <b>Tu sala será publicada en el mercado de salas. ¡Suerte con la venta!</b>
                    </div>
                    {  alertText != null && <div className="alert alert-danger text-center"><b>{alertText}</b></div>}
                    <b style={{color: "var(--test-galaxytext)"}}>Moneda:</b>
                    <select value={coinType} onChange={(e) => setCoinType(e.target.value)} className="form-control">
                        <option value="1">Créditos</option>
                        <option value="2">Asteroides</option>
                        <option value="3">Cometas</option>
                    </select> <br/>
                    <b style={{color: "var(--test-galaxytext)"}}>Precio:</b>
                    <input onChange={e => setCoinPrice(e.target.value)} type="number" className="form-control" /> <br/>
                    <b style={{color: "var(--test-galaxytext)"}}>Nombre:</b>
                    <input onChange={e => setRoomName(e.target.value)} type="text" className="form-control" /> <br/>
                    <button onClick={() => sendPostRoomSell()} className="btn btn-success w-100">Publicar en el mercadillo</button>
                </NitroCardContentView>
            </NitroCardView>
            }
        </>
    );
}
