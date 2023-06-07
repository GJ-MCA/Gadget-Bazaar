import { HelmetProvider,Helmet } from 'react-helmet-async';

export const setPageTitle = (title=null)=>{
    return (<HelmetProvider><Helmet>
        {title ? (
            <title>{`${title} | Gadget Bazaar`}</title>
        ):
            <title>{`Gadget Bazaar`}</title>
        }
    </Helmet></HelmetProvider>)
}