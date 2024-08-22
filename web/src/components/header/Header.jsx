import React from "react";
import './Header.css';

import { Avatar } from 'primereact/avatar';
import { Menubar } from 'primereact/menubar';


const Header = () => {

    const items = [
        {label: 'Início'},{label: 'Comunicados'},{label: 'Responsáveis'},{label: 'Servidores'}
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="ml-2"></img>;
    const end = <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" className="mr-5"/>;

    return (
        <>
        <Menubar model={items} start={start} end={end} />
        </>
    );
}; export default Header;