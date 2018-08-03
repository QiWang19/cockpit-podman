/*jshint esversion: 6 */
/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import cockpit from 'cockpit';
import React from 'react';
import './podman.scss';
import ContainerHeader from './ContainerHeader.jsx'
import Containers from './Containers.jsx';
import Images from './Images.jsx';
import * as utils from './util.js';

const _ = cockpit.gettext;

class Application extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			version: { version: "unknown" },
			images: [],
			containers: [],
			imagesMeta: [],
			containersMeta: [],
			containersStats:[],
			onlyShowRunning: true,
			dropDownValue: 'Everything',
		};
		this.onChange = this.onChange.bind(this);
		this.updateContainers = this.updateContainers.bind(this);
		this.updateImages = this.updateImages.bind(this);
	}

	onChange(value) {
		this.setState({
			onlyShowRunning: value == "all" ? false : true
		})
	}

	updateContainers(newContainers) {
		this.setState({
			containers: newContainers
		});
	}

	updateImages(newImages) {
		this.setState({
			images: newImages
		});
	}

    componentDidMount() {
		this._asyncRequestVersion = utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.GetVersion")
			.then(reply => {
				this._asyncRequestVersion = null;
				this.setState({ version: reply.version });
			})
			.catch(ex => console.error("Failed to do GetVersion call:", JSON.stringify(ex)));

		this._asyncRequestImages = utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.ListImages")
			.then(reply => {
				this._asyncRequestImages = null;
				this.setState({ imagesMeta: reply.images });
				this.state.imagesMeta.map((img)=>{
					utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.InspectImage", JSON.parse('{"name":"' + img.id + '"}'))
						.then(reply => {
							const temp_imgs = this.state.images;
							temp_imgs.push(JSON.parse(reply.image));
							this.setState({images: temp_imgs});
						})
						.catch(ex => console.error("Failed to do InspectImage call:", ex, JSON.stringify(ex)));
				})
			})
			.catch(ex => console.error("Failed to do ListImages call:", ex, JSON.stringify(ex)));

		// this.interval = setInterval(()=>{
			this._asyncRequestContainers = utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.ListContainers")
				.then(reply => {
					this._asyncRequestContainers = null;
					this.setState({containersMeta: reply.containers || []});
					this.state.containersMeta.map((container) => {
						utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.InspectContainer", JSON.parse('{"name":"' + container.id + '"}'))
							.then(reply => {
								const temp_containers = this.state.containers;
								temp_containers.push(JSON.parse(reply.container));
								this.setState({containers: temp_containers});
							})
							.catch(ex => console.error("Failed to do InspectImage call:", ex, JSON.stringify(ex)));
					});
					this.state.containersMeta.map((container) => {
						utils.varlinkCall(utils.PODMAN, "io.projectatomic.podman.GetContainerStats", JSON.parse('{"name":"' + container.id + '"}'))
							.then(reply => {
								const temp_container_stats = this.state.containersStats;
								if (reply.container) {
									temp_container_stats[container.id] = reply.container;
								}
								this.setState({containersStats: temp_container_stats});
							})
							.catch(ex => console.error("Failed to do GetContainerStats call:", ex, JSON.stringify(ex)));
					});
				})
				.catch(ex => console.error("Failed to do ListContainers call:", JSON.stringify(ex), ex.toString()));
			// this.setState({
			// 	containers:[],
			// 	containersStats:[]
			// })
		// }, 1000)
		this.setState({
			containers:[],
			containersStats:[]
		})
	}

    componentWillUnmount() {
		if (this._asyncRequestVersion) {
			this._asyncRequestVersion.cancel();
		}
		if (this._asyncRequestImages) {
			this._asyncRequestImages.cancel();
		}
		if (this._asyncRequestContainers) {
			this._asyncRequestContainers.cancel();
		}
		clearInterval(this.interval);
    }

    render() {
		let imageList;
		let containerList;
		imageList =
			<Images
				key={_("imageList")}
				images={this.state.images}
				updateImages={this.updateImages}
			></Images>;
		containerList=
			<Containers
				key={_("containerList")}
				containers={this.state.containers}
				containersStats={this.state.containersStats}
				onlyShowRunning={this.state.onlyShowRunning}
				updateContainers={this.updateContainers}
			></Containers>

		return (
			<div>
				<div className="content-filter">
					<ContainerHeader
						onlyShowRunning={this.state.onlyShowRunning}
						onChange={this.onChange}
					></ContainerHeader>
				</div>
				<div className="container-fluid">
					{/* List everything */}
					{containerList}
					{imageList}
				</div>
			</div>
		);
    }
}

export default Application;
