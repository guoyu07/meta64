import * as React from 'react';
import { Navbar } from '../components/Navbar';

/* This code was part of my original experiment that used a 'router' but i am not currently
using a router and the entire SPA runs at Home.tsx
*/
export class Timeline extends React.Component {
    render() {
        return (
            <div>
                <header>
                    <Navbar />
                </header>

                <div className="container-fluid">
                    <div className="row">
                        <main role="main" className="col-sm-9 ml-sm-auto col-md-10 pt-3">
                            <h1>Timeline Content</h1>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}
