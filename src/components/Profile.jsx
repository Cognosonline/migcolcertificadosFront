import { useEffect } from 'react';
import { useStateValue } from '../context/GlobalContext';
import style from '../modulesCss/Profile.module.css'


const Profile = () => {
    const { user } = useStateValue();

    return (<>
        <div className={style.divContainer}>
            <div className={style.divCardProfile}>
                <div className={style.divAvatar}>
                    <label>{user.nombre.given.charAt(0) + user.nombre.family.charAt(0)}</label>
                </div>
                <div className={style.divInfoUser}>
                    <label >{user.nombre.given + ' ' + user.nombre.family}</label>
                    <label>{user.cedula}</label>
                </div>
            </div>
        </div>
    </>);
}

export default Profile;