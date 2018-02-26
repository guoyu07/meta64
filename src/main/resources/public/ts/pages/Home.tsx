import * as React from 'react';
import { Navbar } from '../components/Navbar';
import { Factory } from "../Factory";
import { Meta64Intf as Meta64 } from "../intf/Meta64Intf";
import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";

let meta64: Meta64;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    meta64 = s.meta64;
});

/* The entire SPA runs in this component (no router is currently in use) */
export class Home extends React.Component {

    render() {
        return (
            <div>
                <Navbar />

                <div className="container-fluid">
                    <div className="row">
                        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                            <div className="sidebar-sticky">
                                <div id="mainAppMenu" className="nav flex-column">
                                </div>
                            </div>
                        </nav>

                        <main id="mainScrollingArea" role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4" style={{ 'padding': '0px' }}>

                            <ul id="navTabs" className="nav nav-tabs">
                                <li className="nav-item">
                                    <a data-toggle="tab" className="nav-link" href="#mainTab">Main</a>
                                </li>
                                <li className="nav-item">
                                    <a data-toggle="tab" className="nav-link" href="#searchTab">Search</a>
                                </li>
                                <li className="nav-item">
                                    <a data-toggle="tab" className="nav-link" href="#timelineTab">Timeline</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div id="mainTab" className="tab-pane fade">
                                    <div id="mainNodeContent" style={{ 'marginTop': '.5rem' }}></div>
                                    <div id="listView"></div>
                                </div>
                                <div id="searchTab" className="tab-pane fade">
                                    <div id="searchResultsPanel">No search displaying.</div>
                                </div>
                                <div id="timelineTab" className="tab-pane fade in">
                                    <div id="timelineResultsPanel">No timeline displaying.</div>
                                </div>
                            </div>

                        </main>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        if (meta64) {
            meta64.rebuildMainMenu();
        }
    }
}
