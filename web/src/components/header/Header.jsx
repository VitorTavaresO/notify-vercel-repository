import React, { useState, useEffect, useRef } from "react";
import './Header.css';

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';


const Header = () => {

    const items = [
        {label: 'Início' },
        {label: 'Comunicados'},
        {label: 'Responsáveis'},
        {label: 'Servidores'},
    ];

    const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
    const userMenuRef = useRef(null);
    const userMenuItems = [
        {label: 'Perfil'},
        {label: 'Sair'},
    ];

    const toggleUserMenu = () => { setIsUserMenuVisible(prevState => !prevState);};

    const handleClickOutside = (event) => {

        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) { setIsUserMenuVisible(false);}
    };

    useEffect(() => {

        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    const start = (
        <div className="flex align-items-center ml-3 mr-3 logo">
            <img alt="logo" src="/images/logo_ifpr.png" height="46" />
        </div>
    );
    const end = (
        <div className="flex align-items-center mr-3 relative" ref={userMenuRef}>
            <Avatar 
                image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" 
                className="mr-2"         
                onClick={toggleUserMenu}
            />
            <Button icon="pi pi-chevron-down" className="p-button-text -ml-2 dropdown-icon" onClick={toggleUserMenu} />
            {isUserMenuVisible && ( <div className="user-menu">
                {userMenuItems.map((item, index) => (
                    <div key={index} className="user-menu-item"> {item.label} </div>
                ))}
            </div> )}
        </div>
    );

    return (
        <>
        <Menubar model={items} start={start} end={end} className="border-noround header"/>
        </>
    );
}; export default Header;