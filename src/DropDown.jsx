import React from 'react';

//TODO



class DropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.setShow = this.setShow.bind(this);
    }

    setShow() {
        this.setState((prevState) => ({
            show: !prevState.show
        }))
    }

    handleClick (props, event) {
        if (event.button !== 0)
            return;
        var action = props.actions[event.currentTarget.getAttribute('data-value')];
        if (!action.disabled && action.onActivate)
            action.onActivate();
    }
    render() {

        const choice = this.props.actions.map((action, index) => {
            return (
                <li key={index} className={ action.disabled ? 'disabled' : '' }>
                    <a data-value={index} role="link" tabIndex="0" onClick={(event) => this.handleClick(this.props, event)}>{action.label}</a>
                </li>
            );
        })
        const menu = <div>
                        <ul role="menu">
                            {choice}
                        </ul>
                    </div>;
        return (
            <div>
                <div className="btn-group">
                    <button className="btn btn-default" type="button" data-value="0" onClick={(event) => this.handleClick(this.props, event)}>
                        <span>{this.props.actions[0].label}</span>
                    </button>
                    <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" onClick={this.setShow}>
                        <div className="caret" />
                    </button>
                </div>
                {this.state.show && menu}
            </div>
        );
    }
}

DropDown.defaultProps = {
    actions: [ { label: '' } ]
};

export default DropDown;