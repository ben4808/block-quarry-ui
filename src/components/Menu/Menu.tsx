import "./Menu.scss";
import { MenuProps } from './MenuProps';

function Menu(props: MenuProps) {
    function checkForEnter(event: any) {
        let key: string = event.key;

        if (key === "Enter") {
            let query = event.target.value as string;
            query = query.toUpperCase().replaceAll(/[^A-Z.]/g, "");
            if (query.length === 0) return;

            props.onNewQuery(query);
        }
    }

    return (
        <div id="Menu">
            <div className="site-title">Block Quarry</div>

            <div className="menu-label">Query: </div>
            <input type="text" className="form-control" id="queryTextbox" placeholder="B..CKQ..R.Y" onKeyDown={checkForEnter} />

            <a id="help-button" href="https://github.com/ben4808/block-quarry-ui/blob/main/README.md" target="_blank" rel="noreferrer">Help</a>
        </div>
    );
}

export default Menu;
