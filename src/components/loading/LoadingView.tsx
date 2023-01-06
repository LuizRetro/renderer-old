import { FC, useCallback, useEffect, useState } from 'react';
import { loadFull } from 'tsparticles';
import { NotificationUtilities } from '../../api';
import { Base, Column, LayoutProgressBar, Text } from '../../common';


interface LoadingViewProps
{
    isError: boolean;
    message: string;
    percent: number;
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '', percent = 0 } = props;
    const [photos, setPhotos] = useState(null); 

    const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
    }, []);

    useEffect(() => {
      fetch("https://hgalaxy.net/system/controllers/eha.php?getPhotos")
        .then(response => response.json())
        .then((response) => { 
            setPhotos(response);
        })
    }, []);

    useEffect(() =>
    {
        if(!isError) return;

        NotificationUtilities.simpleAlert(message, null, null, null, 'Connection Error');
    }, [ isError, message ]);
    
    return (
        <>
        
        <Column fullHeight position="relative" className="nitro-loading">

            { photos != null && <Base fullHeight className="container h-100">
                <Column fullHeight alignItems="center" justifyContent="end">
                    <div className="connecting-duck animate__animated animate__fadeIn animate__slower">
                      <img src="https://cdn.discordapp.com/attachments/888286259850653737/1015475755527962654/gifmio.gif" style={{position: "absolute", top: "-53px", right: "353px", zIndex: "99"}} />
                      <div style={{padding: "5px", backgroundColor: "#fff", border: "1px solid #000", display: "inline-block", borderRadius: "10%", transform: "rotate(-15deg)", position: "relative", left: "91px"}}>
                        <img src={photos[0]} style={{borderRadius: "10%"}} />
                      </div>
                      <div style={{padding: "5px", backgroundColor: "#fff", border: "1px solid #000", display: "inline-block", borderRadius: "10%",  zIndex: "98", position: "relative"}}>
                        <img src={photos[1]} style={{borderRadius: "10%"}}  />
                      </div>
                      <div style={{padding: "5px", backgroundColor: "#fff", border: "1px solid #000", display: "inline-block", borderRadius: "10%", transform: "rotate(15deg)", position: "relative", right: "91px"}}>
                        <img src={photos[2]} style={{borderRadius: "10%"}}  />
                      </div>
                      <h4 style={{textAlign: "center", marginTop: "40px"}}>¡Publica tus fotos en la web para salir en la pantalla de carga!</h4>
                    </div>
                    <Column size={ 6 } className="text-center py-4">
                        { isError && (message && message.length) ?
                            <Base className="fs-4 text-shadow">{ message }</Base>
                            :
                            <>
                                <Text fontSize={ 4 } variant="white" className="text-shadow">{ percent.toFixed() }%</Text>
                                <LayoutProgressBar progress={ percent } className="mt-2 large" />
                            </>
                        }
                        
                    </Column>
                </Column>
            </Base> }
        </Column>
        </>
    );
}
