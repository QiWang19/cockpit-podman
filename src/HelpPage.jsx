import React from 'react';

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
                <span translate>Container: </span>
                <span id="container-details-names" />{props.container.Name}
            </div>
            <div className="panel-body">
                <table className="info-table-ct">
                    <tbody>
                        <tr>
                            <td translate>Id:</td>
                            <td colSpan="3" id="container-details-id" /> {props.container.ID}
                        </tr>
                        <tr>
                            <td translate>Created:</td>
                            <td colSpan="3" id="container-details-created" />
                        </tr>
                        <tr>
                            <td translate>Image:</td>
                            <td colSpan="3">
                                <div id="container-details-image" />
                                <div id="container-details-image-id" />
                            </td>
                        </tr>
                        <tr>
                            <td translate>Command:</td>
                            <td colSpan="3" id="container-details-command" />
                        </tr>
                        <tr>
                            <td translate>State:</td>
                            <td colSpan="3" id="container-details-state" />
                        </tr>
                        <tr>
                            <td translate>Restart Policy:</td>
                            <td colSpan="3" id="container-details-restart-policy" />
                        </tr>
                        <tr>
                            <td translatable="yes">IP Address:</td>
                            <td colSpan="3" id="container-details-ipaddr" />
                        </tr>
                        <tr>
                            <td translatable="yes">IP Prefix Length:</td>
                            <td colSpan="3" id="container-details-ipprefixlen" />
                        </tr>
                        <tr>
                            <td translatable="yes">Gateway:</td>
                            <td colSpan="3" id="container-details-gateway" />
                        </tr>
                        <tr>
                            <td translatable="yes">MAC Address:</td>
                            <td colSpan="3" id="container-details-macaddr" />
                        </tr>
                        <tr id="container-details-ports-row" hidden>
                            <td translate>Ports:</td>
                            <td colSpan="3" id="container-details-ports" />
                        </tr>
                        <tr id="container-details-links-row" hidden>
                            <td translate>Links:</td>
                            <td colSpan="3" id="container-details-links" />
                        </tr>
                        <tr id="container-details-volumes-row" hidden>
                            <td translate>Volumes:</td>
                            <td colSpan="3" id="container-details-volumes" />
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>
                                <div className="bar-row hidden" graph="container-details" value="0/100000000" />
                            </td>
                        </tr>
                        <tr id="container-details-memory-row" className="interactive" hidden>
                            <td translate>Memory usage:</td>
                            <td colSpan="2" id="container-details-memory">
                                <div className="bar-row" graph="container-details" />
                            </td>
                            <td className="shrink resource-value" id="container-details-memory-text" />
                        </tr>
                        <tr id="container-details-cpu-row" className="interactive" hidden>
                            <td translate>CPU usage:</td>
                            <td colSpan="2">
                                <span className="cpu-usage" />
                            </td>
                            <td className="shrink resource-value">
                                <span className="cpu-shares" />
                            </td>
                        </tr>
                        <tr id="container-details-resource-row" hidden>
                            <td />
                            <td>
                                <button className="btn btn-default resource-button" data-toggle="modal"
                      data-target="#container-resources-dialog" translate>Change resource limits</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="container-terminal" />
            </div>
        </div>
    </div>
);

export default HelpPage;
