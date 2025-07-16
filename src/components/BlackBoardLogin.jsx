
import Loader from './Loader';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';



export default function BlackBoardLogin() {

    const location = useLocation();
    //const params = new URLSearchParams(location.search);

    useEffect(() => {

        const clientId = import.meta.env.VITE_CLIENT_ID;
        const redirectUrl = import.meta.env.VITE_REDIRECT_URL;
        const instanceUrl = import.meta.env.VITE_INSTANCE_BLACKBOARD;

        const authUrl = `${instanceUrl}/learn/api/public/v1/oauth2/authorizationcode?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=read`;
        window.location.href = authUrl;

    }, [])

    return (
        <>
            <Loader background={'white'} height={'100vh'} color={"#1091F4"} load= {1} />
        </>
    );
}