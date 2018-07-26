import React from 'react';
import cockpit from 'cockpit';
import Listing from '../lib/cockpit-components-listing.jsx';
import ContainerDetails from './ContainerDetails.js';
import Dropdown from './DropDown.js';

const _ = cockpit.gettext;

const navigateToContainer = (container) => {
	cockpit.location.go([container.ID]);
}

//TODO
const deleteContainer = (event, container) => {
	return undefined;
}

//TODO
const stopContainer = (container) => {
	return undefined;
}

//TODO
const startContainer = (container) => {
	return undefined;
}

//TODO
const restartContainer = (container) => {
	return undefined;
}


const renderRow = (containersStats, container) => {
	const isRunning = !!container.State.Running;
	//TODO: check container.Image == container.ImageID
	const image = container.ImageName;
	const state = container.State.Status;

	let columns = [
		{ name: container.Name, header: true },
		image,
		container.Config.Entrypoint === "" ? container.Config.Cmd.join(" ") : container.Config.Cmd.join(""),
		// TODO: CpuUsage
		"",
		// TODO: MemoryUsage, MemoryLimit
		"",
		state,

	];
	let tabs = [{
		name: _("Details"),
		renderer: ContainerDetails,
		data: { container: container }
	}];

	let startStopActions = [];
	if (isRunning)
		startStopActions.push({ label: _("Stop"), onActivate: () => stopContainer(container)});
	else
		startStopActions.push({ label: _("Start"), onActivate: () => startContainer(container)});

	startStopActions.push({
		label: _("Restart"),
		onActivate: restartContainer,
		disabled: !isRunning
	});

	var actions = [
		<button
			className="btn btn-danger btn-delete pficon pficon-delete"
			onClick={(event) => deleteContainer(container)} />,
		<button
			className="btn btn-default"
			disabled={isRunning}
			data-container-id={container.ID}
			data-toggle="modal" data-target="#container-commit-dialog"
		>
			{_("Commit")}
		</button>,
		// TODO: stop or start dropdown menu
		<Dropdown actions={startStopActions} />
	];

	return <Listing.ListingRow
				key={container.Id}
				columns={columns}
				tabRenderers={tabs}
				navigateToItem={() => navigateToContainer(container)}
				listingActions={actions}
			/>;
};

const Containers = (props) => {
	const columnTitles = [_("Name"), _("Image"), _("Command"), _("CPU"), _("Memory"), _("State")];
	//TODO: emptyCaption
	let emptyCaption = _("No running containers");
	//TODO: check filter text
	let filtered = props.containers.filter(container => (!props.onlyShowRunning || container.State.Running));
	let rows = filtered.map(function (container) {
		return renderRow(props.containersStats, container)
	});

	return (
		<div className="container-fluid ">
			<div>
				<Listing.Listing title={_("Containers")} columnTitles={columnTitles} emptyCaption={emptyCaption}>
					{rows}
				</Listing.Listing>
			</div>
		</div>
	);
}

export default Containers;
