import * as React from 'react';

import { Singletons } from "../Singletons";
import { PubSub } from "../PubSub";
import { Constants } from "../Constants";
import { Nav } from "../Nav";

//todo-1: routers are disabled for now. Only basic SPA for now.
//import { Link } from 'react-router-dom';

let nav: Nav;
PubSub.sub(Constants.PUBSUB_SingletonsReady, (s: Singletons) => {
    nav = s.nav;
});

export class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">

                {/*}
                <Link className="navbar-brand" to="/">SubNode</Link>
                */}
                <div id="headerAppName" className="navbar-brand" onClick={e => { nav.navPublicHome(); }}>SubNode</div>

                <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse ml-auto" id="navbarsExampleDefault">
                    <div className="btn-group navbar-right ml-auto">
                        <button type="button" onClick={e => { nav.navUpLevel(); }} title="Go to Parent SubNode" className="btn navbar-btn" id="upLevelButton">Up Level</button>
                        <button type="button" onClick={e => { nav.navHome(); }} title="Go to Your Root SubNode" className="btn navbar-btn" id="navHomeButton"><i className="fa fa-home fa-lg"/></button>
                        <button type="button" onClick={e => { nav.preferences(); }} title="Modify your preferences" className="btn navbar-btn" id="userPreferencesMainAppButton"><i className="fa fa-gear fa-lg"/></button>
                        <button type="button" onClick={e => { nav.editMode(); }} title="Toggle Edit Mode on/off" className="btn navbar-btn" id="editModeButton"><i className="fa fa-pencil fa-lg"/></button>
                        <button type="button" onClick={e => { nav.signup(); }} title="Signup for a SubNode Account" className="btn navbar-btn" id="openSignupPgButton">Signup</button>
                        <button type="button" onClick={e => { nav.search(); }} title="Search under selected node" className="btn navbar-btn" id="searchMainAppButton"><i className="fa fa-search fa-lg"/></button>
                        <button type="button" onClick={e => { nav.timelineByModTime(); }} title="View Timeline of selected node (by Mod Time)" className="btn navbar-btn" id="timelineMainAppButton"><i className="fa fa-clock-o fa-lg"/></button>
                        <button type="button" onClick={e => { nav.login(); }} title="Login" className="btn navbar-btn" id="openLoginDlgButton"><i className="fa fa-sign-in fa-lg"/></button>
                        <button type="button" onClick={e => { nav.logout(); }} title="Logout" className="btn navbar-btn" id="navLogoutButton"><i className="fa fa-sign-out fa-lg"/></button>
                    </div>

                    {/*                 
                    <!-- 
                    still experimenting, not ready to enable yet.
                    <div class="g-signin2" data-onsuccess="onSignIn"></div>
                    -->
                    */}

                </div>
            </nav >
        );
    }
}
