import React from 'react';
import moment from '../node_modules/moment/src/moment.js';
// const moment = require('moment');

let containerTerminal = <div id="container-terminal" />;

const HelpPage = (props) => (
    <div id="container-details" className="container-fluid" >
        <div className="content-filter">
            <h3>
                <i className="fa fa-cube fa-fw" />
                <span />  {props.container.Name}
            </h3>
            <a translatable="yes">Show all containers</a>
        </div>
        <div className="panel-default panel">
            <div className="panel-heading">
                <div className="pull-right">
                    <button className="btn btn-default" id="container-details-start" translate>Start</button>
                    <button className="btn btn-default" id="container-details-stop" translate>Stop</button>
                    <button className="btn btn-default" id="container-details-restart" translate>Restart</button>
                    <button className="btn btn-danger" id="container-details-delete" translate>Delete</button>
                    <button className="btn btn-default" id="container-details-commit"
                  data-toggle="modal" data-target="#container-commit-dialog" translate>Commit</button>
                </div>
                <span translate>Container:</span>
                <span id="container-details-names" />{props.container.Name}
            </div>
            <div className="panel-body">
                <table className="info-table-ct">
                    <tbody>
                        <tr>
                            <td className="nav-label" translate>Id:</td>
                            <td colSpan="3" id="container-details-id">{props.container.ID}</td>
                        </tr>
                        <tr>
                            <td className="nav-label" translate>Created:</td>
                            <td colSpan="3" id="container-details-created">{moment(props.container.Created).isValid() ? moment(props.container.Created).calendar() : props.container.Created}</td>
                        </tr>
                        <tr>
                            <td className="nav-label" valign="top" translate>Image:</td>
                            <td colSpan="3">
                                <div id="container-details-image">{props.container.ImageName}</div>
                                <div id="container-details-image-id">{props.container.Image}</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="nav-label" translate>Command:</td>
                            <td colSpan="3" id="container-details-command" />
                        </tr>
                        <tr>
                            <td className="nav-label" translate>State:</td>
                            <td colSpan="3" id="container-details-state" />
                        </tr>
                        <tr>
                            <td className="nav-label" translate>Restart Policy:</td>
                            <td colSpan="3" id="container-details-restart-policy" />
                        </tr>
                        <tr>
                            <td className="nav-label" translatable="yes">IP Address:</td>
                            <td colSpan="3" id="container-details-ipaddr" />
                        </tr>
                        <tr>
                            <td className="nav-label" translatable="yes">IP Prefix Length:</td>
                            <td colSpan="3" id="container-details-ipprefixlen" />
                        </tr>
                        <tr>
                            <td className="nav-label" translatable="yes">Gateway:</td>
                            <td colSpan="3" id="container-details-gateway" />
                        </tr>
                        <tr>
                            <td className="nav-label" translatable="yes">MAC Address:</td>
                            <td colSpan="3" id="container-details-macaddr" />
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default HelpPage;
