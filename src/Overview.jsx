import React from 'react';
import Applicatoin from './app.jsx';
import './podman.scss';
class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showApp: false,
            showOverview: true,
        };
        this.handleStartPodman = this.handleStartPodman.bind(this);
    }

    handleStartPodman() {
        this.setState({
            showApp:true,
            showOverview: false
        })
    }

    //TODO： how to start podman socket???
    render() {
        const connect =
        <div key="startpodmanmessage" className="curtains-ct blank-slate-pf">
            <h1 translatable="yes">Podman is not installed or activated on the system</h1>
            <div key="handlestartpodman" className="blank-slate-pf-main-action">
                <button
                    key={"startpodmanbtn"}
                    className="btn btn-primary btn-lg"
                    translatable="yes"
                    data-action="docker-start"
                    onClick={this.handleStartPodman}
                >
                    Start Podman
                </button>
            </div>
        </div>;
        return(
            <div key="overview">
                {this.state.showOverview && connect}
                {this.state.showApp && <Applicatoin key={"app"}/>}
            </div>

        );
    }
}

export default Overview;