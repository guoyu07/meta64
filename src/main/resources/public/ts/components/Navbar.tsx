import * as React from 'react';

import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { Nav } from "../Nav";

//todo-2: routers are disabled for now. Only basic SPA for now.
//import { Link } from 'react-router-dom';

let nav: Nav;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    nav = s.nav;
});

export class Navbar extends React.Component {

    render() {
        return (
            <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
                <div id="headerAppName" className="navbar-brand col-sm-3 col-md-2 mr-0" onClick={e => { nav.navPublicHome(); }}>SubNode</div>

                <div className="nav-item w-100">
                    <div style={{ 'float': 'right', 'margin-right': '8px' }}>
                        <button type="button" onClick={e => { nav.navUpLevel(); }} title="Go to Parent SubNode" className="btn" id="upLevelButton">Up Level</button>
                        <button type="button" onClick={e => { nav.navHome(); }} title="Go to Your Root SubNode" className="btn" id="navHomeButton"><i className="fa fa-home fa-lg" /></button>
                        <button type="button" onClick={e => { nav.preferences(); }} title="Modify your preferences" className="btn" id="userPreferencesMainAppButton"><i className="fa fa-gear fa-lg" /></button>
                        <button type="button" onClick={e => { nav.editMode(); }} title="Toggle Edit Mode on/off" className="btn" id="editModeButton"><i className="fa fa-pencil fa-lg" /></button>
                        <button type="button" onClick={e => { nav.signup(); }} title="Signup for a SubNode Account" className="btn" id="openSignupPgButton">Signup</button>
                        <button type="button" onClick={e => { nav.search(); }} title="Search under selected node" className="btn" id="searchMainAppButton"><i className="fa fa-search fa-lg" /></button>
                        <button type="button" onClick={e => { nav.timelineByModTime(); }} title="View Timeline of selected node (by Mod Time)" className="btn" id="timelineMainAppButton"><i className="fa fa-clock-o fa-lg" /></button>
                        <button type="button" onClick={e => { nav.login(); }} title="Login" className="btn" id="openLoginDlgButton"><i className="fa fa-sign-in fa-lg" /></button>
                        <button type="button" onClick={e => { nav.logout(); }} title="Logout" className="btn" id="navLogoutButton"><i className="fa fa-sign-out fa-lg" /></button>
                    
                     {/*                 
                    <!-- 
                    still experimenting, not ready to enable yet.
                    <div className="g-signin2" data-onsuccess="onSignIn"></div>
                    -->
                    */}
                    </div>
                </div>

            </nav>
        );
    }
}
