import React, { Component } from 'react';
import { Panel, PanelHeader, Footer /* HeaderButton */} from '@vkontakte/vkui';

//import connect from '@vkontakte/vk-connect';
import { getMessage } from '../js/helpers';

import DistrictList from '../components/DistrictList';

//import Icon24Place from '@vkontakte/icons/dist/24/place';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            districts: this.props.districts
        };

        this.api = this.props.api;
    }

    render() {
        const { id, setParentState } = this.props;

      /*  const onenGeoMap = e => {
          connect.send("VKWebAppGetGeodata", {});
        }*/
        return (
            <Panel id={id}>
                <PanelHeader /*left={
                  <HeaderButton onClick={ onenGeoMap }>
			               <Icon24Place/>
		               </HeaderButton>}*/>{ getMessage('home_panel_title') }</PanelHeader>
                        <DistrictList
                            {...this.props}
                            districts={ this.props.districts }
                            setParentState={ setParentState }
                        />
                        <Footer>version 4</Footer>
                	{this.props.state.snackbar}
            </Panel>
        );
    }
}

export default Home;
