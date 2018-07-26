import React from 'react';
import cockpit from 'cockpit';
import Listing from '../lib/cockpit-components-listing.jsx';
import ImageDetails from './ImageDetails.js';
import ContainersRunImageModal from './ContainersRunImageModal.js';
import ImageSecurity from './ImageSecurity.js';

const moment = require('moment');
const atomic = require('./atomic');
const _ = cockpit.gettext;

class Images extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageDetail: undefined,
			setRunContainer: false,
			vulnerableInfos: {}
		};
		this.vulnerableInfoChanged = this.vulnerableInfoChanged.bind(this);
		this.renderRow = this.renderRow.bind(this);
		this.navigateToImage = this.navigateToImage.bind(this);
		this.handleSearchImageClick = this.handleSearchImageClick.bind(this);
		this.showRunImageDialog = this.showRunImageDialog.bind(this);
		this.handleCancelRunImage = this.handleCancelRunImage.bind(this);
	}

	vulnerableInfoChanged(event, infos) {
		this.setState({ vulnerableInfos: infos });
	}

	componentDidMount() {
		atomic.addEventListener('vulnerableInfoChanged', this.vulnerableInfoChanged);
	}

	componentWillUnmount() {
		atomic.removeEventListener('vulnerableInfoChanged', this.vulnerableInfoChanged);
	}

	navigateToImage(image) {
		cockpit.location.go([ 'image', image.Id ]);
	}

	showRunImageDialog(e) {
		e.preventDefault()
		this.setState({
			setRunContainer: true
		});
	}

	renderRow(image) {
		let vulnerabilityColumn = '';
		let vulnerableInfo = this.state.vulnerableInfos[image.Id.replace(/^sha256:/, '')];
		let count;
		let tabs = [];

		if (vulnerableInfo) {
			count = vulnerableInfo.vulnerabilities.length;
			if (count > 0)
				vulnerabilityColumn = (
					<div>
						<span className="pficon pficon-warning-triangle-o" />
						&nbsp;
						{ cockpit.format(cockpit.ngettext('1 Vulnerability', '$0 Vulnerabilities', count), count) }
					</div>
			);
		}
		//TODO: image waiting if - else
		let element =
			<button
				className="btn btn-default btn-control-ct fa fa-play"
				onClick={ this.showRunImageDialog }
				data-image={image.id}
			/>
		let columns = [
			{name: image.RepoTags[0], header: true},
			vulnerabilityColumn,
			moment(image.Created).isValid() ? moment(image.Created).calendar() : image.Created,
			cockpit.format_bytes(image.VirtualSize),
			{
				element: element,
				tight: true
			}
		];

		tabs.push({
			name: _("Details"),
			renderer: ImageDetails,
			data: { image: image }
		});
		if (vulnerableInfo !== undefined) {
			tabs.push({
				name: _("Security"),
				renderer: ImageSecurity,
				data: {
					image: image,
					info: vulnerableInfo,
				}
			});
		}

		var actions = [
			<button
				className="btn btn-danger btn-delete pficon pficon-delete"
				// TODO: deleteImage
				onClick={undefined}
			/>
		];
		return <Listing.ListingRow
					key={image.Id}
					rowId={image.Id}
					columns={columns}
					tabRenderers={tabs}
					navigateToItem={this.navigateToImage(image)}
					listingActions={actions}
				/>;
	}

    handleSearchImageClick(event) {
			return undefined;
    }

    handleCancelRunImage() {
			this.setState(()=>({
				setRunContainer: false
			}));
    }

    render() {
			const columnTitles = [ _("Name"), _(''), _("Created"), _("Size"), _('') ];
			//TODO: emptyCaption = _("No Images");
			let emptyCaption = _("No images that match the current filter");
			const getNewImageAction =
				<a role="link" tabIndex="0" onClick={this.handleSearchImageClick} className="card-pf-link-with-icon pull-right">
					<span className="pficon pficon-add-circle-o" />{_("Get new image")}
				</a>;
			//TODO: filter images via filterText
			let filtered = this.props.images;
			let imageRows = filtered.map(this.renderRow);
			return(
				<div className="container-fluid" >
					<div>
						<Listing.Listing
							title={_("Images")}
							columnTitles={columnTitles}
							emptyCaption={emptyCaption}
							actions={getNewImageAction}>
							{imageRows}
						</Listing.Listing>
					{/* TODO: {pendingRows} */}
					</div>
						<ContainersRunImageModal
							show={this.state.setRunContainer}
							handleCancelRunImage={this.handleCancelRunImage}
						></ContainersRunImageModal>
				</div>
			);
    }
}

export default Images;
