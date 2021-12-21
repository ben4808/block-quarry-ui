import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import GetAllExplored from './components/GetAllExplored/GetAllExplored';
import { getQueryParam } from './lib/utils';
import AddBulkEntries from './components/AddBulkEntries/AddBulkEntries';

if (document.location.href.match("getAllExplored")) {
    let minQuality = +getQueryParam("minQuality") || 0;
    let minObscurity = +getQueryParam("minObscurity") || 0;
    let outputFormat = getQueryParam("outputFormat") || "dict";

    ReactDOM.render(
        <React.StrictMode>
            <GetAllExplored minQuality={minQuality} minObscurity={minObscurity} outputFormat={outputFormat} />
        </React.StrictMode>,
        document.getElementById('root')
    );
}
else if (document.location.href.match("addBulkEntries")) {
    ReactDOM.render(
        <React.StrictMode>
            <AddBulkEntries />
        </React.StrictMode>,
        document.getElementById('root')
    );
}
else {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
}
