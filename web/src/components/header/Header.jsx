import React, { useRef } from "react";
import './Header.css';

import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Menubar } from 'primereact/menubar';


const Header = () => {

    const menu = useRef(null);
    const items = [
        {label: 'Início' },
        {label: 'Comunicados'},
        {label: 'Responsáveis'},
        {label: 'Servidores'},
    ];
    const userMenuItems = [
        {label: 'Perfil'},
        {label: 'Sair'},
    ];

    const start = (
        <div className="flex align-items-center ml-3 mr-3">
            <img alt="logo" src="/images/LOGO_IF.png" height="46" />
        </div>
    );
    const end = (
        <div className="flex align-items-center mr-5">
            <Avatar 
                image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" 
                onClick={(e) => menu.current.toggle(e)} 
            />
            <Menu model={userMenuItems} popup ref={menu} className="mt-1"/>
        </div>
    );

    return (
        <>
        <Menubar model={items} start={start} end={end} className="border-noround header"/>
        </>
    );
}; export default Header;