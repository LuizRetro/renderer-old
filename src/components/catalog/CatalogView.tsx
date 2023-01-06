import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { Column, Grid, NitroCardContentView, NitroCardView } from '../../common';
import { useCatalog } from '../../hooks';
import { CatalogGiftView } from './views/gift/CatalogGiftView';
import { CatalogNavigationView } from './views/navigation/CatalogNavigationView';
import { GetCatalogLayout } from './views/page/layout/GetCatalogLayout';
import { MarketplacePostOfferView } from './views/page/layout/marketplace/MarketplacePostOfferView';

export const CatalogView: FC<{}> = props =>
{
    const { isVisible = false, setIsVisible = null, rootNode = null, currentPage = null, navigationHidden = false, setNavigationHidden = null, activeNodes = [], searchResult = null, setSearchResult = null, openPageByName = null, openPageByOfferId = null, activateNode = null } = useCatalog();

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
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                    case 'open':
                        if(parts.length > 2)
                        {
                            if(parts.length === 4)
                            {
                                switch(parts[2])
                                {
                                    case 'offerId':
                                        openPageByOfferId(parseInt(parts[3]));
                                        return;
                                }
                            }
                            else
                            {
                                openPageByName(parts[2]);
                            }
                        }
                        else
                        {
                            setIsVisible(true);
                        }
        
                        return;
                }
            },
            eventUrlPrefix: 'catalog/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible, openPageByOfferId, openPageByName ]);

    return (
        <>
            { isVisible &&
                <NitroCardView uniqueKey="catalog" className="nitro-catalog">
                    <div className="drag-handler" >
                        <div style={{padding: "10px", fontSize: "21px", fontWeight: "bold", color: "var(--test-galaxytext)", display: "inline-block"}}>Catálogo</div>
                            { rootNode && (rootNode.children.length > 0) && rootNode.children.map(child =>
                            {
                                if(!child.isVisible) return null;

                                return (
                                    <div style={{display: "inline-block", backgroundColor: "var(--test-galaxytwo)", padding: "4px", borderRadius: "4px", marginRight: "5px", cursor: "pointer"}} key={ child.pageId } onClick={ event =>
                                    {
                                        if(searchResult) setSearchResult(null);

                                        activateNode(child);
                                    } }>
                                        { child.localization }
                                    </div>
                                );
                            }) }
                        <div style={{display: "inline-block", float: "right", padding: "13px"}}>
                            <div style={{display: "inline-block", backgroundColor: "#a61c1c", padding: "4px", borderRadius: "4px", marginRight: "2px", cursor: "pointer"}} onClick={() => setIsVisible(!isVisible)}>
                                <FontAwesomeIcon icon="times" />
                            </div>
                        </div>
                    </div>
                    <NitroCardContentView>
                        <Grid>
                            { !navigationHidden &&
                                <Column size={ 3 } overflow="hidden">
                                    { activeNodes && (activeNodes.length > 0) &&
                                        <CatalogNavigationView node={ activeNodes[0] } /> }
                                </Column> }
                            <Column size={ !navigationHidden ? 9 : 12 } overflow="hidden">
                                { GetCatalogLayout(currentPage, () => setNavigationHidden(true)) }
                            </Column>
                        </Grid>
                    </NitroCardContentView>
                </NitroCardView> }
            <CatalogGiftView />
            <MarketplacePostOfferView />
        </>
    );
}
