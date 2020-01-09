import React, {Component} from 'react';
import { Panel,PanelHeader } from '@vkontakte/vkui';
import { getMessage } from '../js/helpers';
import DistrictList from '../components/DistrictList';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

class Favorite extends Component {
    constructor(props) {
        super(props);

        this.state = {
            districts: this.props.userDistricts
        };

        this.api = this.props.api;
    }


    render() {
        const { id, setParentState } = this.props;

        return (
            <Panel id={id}>
                <PanelHeader>{ getMessage('favorite_panel_title') }</PanelHeader>

                        <DistrictList
                            districts={ this.props.userDistricts }
                            setParentState={ setParentState }
                        />
            </Panel>
        );
    }
}

export default Favorite;
