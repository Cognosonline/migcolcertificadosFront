import {useNavigate, useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Loader from "./Loader";
import api from '../../axiosConfig';
import { useStateValue } from '../context/GlobalContext';

export default function Callback() {
    const location = useLocation();
    const navigate = useNavigate();
    const {singInUser} = useStateValue();

    async function fetchToken(){
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        
        try {
            const result = await api.post('/oauth/token',{
            code:code            
        })
       
        if(result.status == 200){
            const { token, userId } = result.data.payload;
            
            sessionStorage.setItem('token', token);
           
           await singInUser(userId);
            
            navigate('/home')
        }
        } catch (error) {
            console.log(error)
        }     
    }


    useEffect(() => {
        fetchToken()
    },[]);

    return(
        <>
            <Loader background={'white'} height={'100vh'} color={"#1091F4"} load={1}/>
        </>
    );
}