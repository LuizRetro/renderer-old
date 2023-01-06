import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, RemoveLinkEventTracker } from '../../api';
import Logo from "./images/logo.gif";
import "./LoginView.scss";

export const LoginView: FC<{}> = props =>
{
    const sso = new URLSearchParams(window.location.search).get('sso');
    const [ isVisible, setIsVisible ] = useState(true)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function login(){
        fetch("https://hgalaxy.net/system/controllers/eha.php?userNitro="+username+"&passNitro="+password)
        .then(response => response.text())
        .then((response) => { 
            if(response.includes("error") || response === "error") console.log("invalid login");
            else window.location.href = "/index?sso="+response;
        })
    }

    useEffect(() => {
        setTimeout(function(){
            setTimeout(function(){
                if(document.getElementById("habbo") != null) document.getElementById("habbo").classList.add("active");
            }, 700)
    
            setTimeout(function(){
                if(document.getElementById("box_1") != null)document.getElementById("box_1").classList.add("active");
            }, 1200)
    
            setTimeout(function(){
                if(document.getElementById("habbo") != null) document.getElementById("habbo").classList.add("change");
            }, 1500)
    
            setTimeout(function(){
                if(document.getElementById("box_1") != null) document.getElementById("box_1").classList.remove("active");
            }, 9000)
    
            setTimeout(function(){
                if(document.getElementById("room_2") != null) document.getElementById("room_2").classList.add("active");
            }, 9500)
    
            setTimeout(function(){
                if(document.getElementById("room_1") != null) document.getElementById("room_1").classList.remove("active");
            }, 9500)
    
            setTimeout(function(){
                if(document.getElementById("box_2") != null) document.getElementById("box_2").classList.add("active");
            }, 10000)
    
            setTimeout(function(){
                if(document.getElementById("room_3") != null) document.getElementById("room_3").classList.add("active");
            }, 10500)
    
            setTimeout(function(){
                if(document.getElementById("box_2") != null) document.getElementById("box_2").classList.remove("active");
            }, 16700)
    
            setTimeout(function(){
                if(document.getElementById("box_3") != null) document.getElementById("box_3").classList.add("active");
            }, 17200)
    
            setTimeout(function(){
                if(document.getElementById("furni") != null) document.getElementById("furni").classList.add("active");
            }, 17000)
    
            setTimeout(function(){
                if(document.getElementById("box_3") != null) document.getElementById("box_3").classList.remove("active");
            }, 22600)
    
            setTimeout(function(){
                if(document.getElementById("box_4") != null) document.getElementById("box_4").classList.add("active");
            }, 23000)
    
            setTimeout(function(){
                if(document.getElementById("friends") != null) document.getElementById("friends").classList.add("active");
            }, 23500)
        }, 0)
    },[])
    
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
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                }
            },
            eventUrlPrefix: 'login/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    function startRegister(){
        document.getElementById("loginCard").style.display = "none";
        CreateLinkEvent('regavatar-editor/show');
    }

    return (
        <>
            { isVisible &&
                <>
                    <div className="lulz">
                        <div className="landing-view" style={{zIndex: "999"}}>
                        <div className="bg-left" style={{backgroundImage: "url(https://i.imgur.com/t1r0WIz.png)"}} />
                        <div className="bg-left-car" style={{backgroundImage: "url(https://cdn.discordapp.com/attachments/873588752252026920/1019129317755723806/t1r0WIz_copy.png)", zIndex:"999999999999", backgroundRepeat:"no-repeat"  }} />
                        <div className="bg-left-car-blue" style={{backgroundImage: "url(https://cdn.discordapp.com/attachments/734957811879903254/1019252742977507441/carblue.png)", zIndex:"999999999999", backgroundRepeat:"no-repeat"  }} />
                        <div className="bg-left-car-silver" style={{backgroundImage: "url(https://cdn.discordapp.com/attachments/734957811879903254/1019254595349913670/carsilverleft.png)", zIndex:"999999999999", backgroundRepeat:"no-repeat"  }} />
                            <div className="bg-right" />
                            <div className="left" />
                            <div className="right" />
                        </div>
                        <div id="loginCard" className="container center-screen" style={{zIndex: "99999"}}>
                            <div className="row" style={{zIndex: "99999", float: "right"}}>
                                <div className="col-md-4 animate__animated animate__fadeInRight animate__slow" style={{zIndex: "99999"}}>
                                    <div>
                                        <div style={{width: "500px", zIndex: "99999"}}>
                                            <img src={Logo} className="img-center" style={{zIndex: "99999", marginBottom: "40px"}} />
                                            <button onClick={ event => startRegister() } style={{fontSize: "24px", marginBottom: "20px"}} className="btn btn-success btn-lg w-100 animate__animated animate__headShake animate__infinite">¿Eres nuevo? ¡Únete haciendo click aquí!</button>
                                            <div className="card">
                                                <div className="card-title bg-primary text-white text-center">
                                                    <h4 style={{marginTop: "5px"}}>Iniciar sesión</h4>
                                                </div>
                                                <div className="card-body text-dark">
                                                    <b>Nombre de usuario</b>
                                                    <input className="form-control" type="text" onChange={(e) => setUsername(e.target.value)} /> <br/>
                                                    <b>Contraseña</b>
                                                    <input className="form-control" type="password" onChange={(e) => setPassword(e.target.value)} /><br/>
                                                    <button onClick={() => login()} className="btn btn-success w-100">Entrar al hotel</button>
                                                    <button style={{marginTop: "3px"}} className="btn btn-primary w-100">Crearme una cuenta nueva</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>                               
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
}
