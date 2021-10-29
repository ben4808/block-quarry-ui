import React from 'react';
import "./Menu.scss";
import { MenuProps } from './MenuProps';

function Menu(props: MenuProps) {
    function checkForEnter(event: any) {
        let key: string = event.key.toUpperCase();

        if (key === "Enter") {
            let query = event.target.value as string;
            query = query.toUpperCase().replaceAll(/[^A-Z\.]/, "");
            if (query.length === 0) return;

            props.onNewQuery(query);
        }
    }

    return (
        <div id="Menu">
            <div className="site-title">Block Quarry</div>

            <div className="menu-label">Query: </div>
            <input type="text" className="form-control" id="queryTextbox" placeholder="B..CKQ..R.Y" onKeyDown={checkForEnter} />
        </div>
    );
}

export default Menu;
