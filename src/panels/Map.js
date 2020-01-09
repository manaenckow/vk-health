import React, { Component } from 'react';

import { Panel, PanelHeader, Spinner, Div, IS_PLATFORM_IOS, HeaderButton } from '@vkontakte/vkui';
import { YMaps, Map, Placemark, ZoomControl } from 'react-yandex-maps';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';


class MapW extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.api = this.props.api;
    }

//    componentDidMount() {}
    render() {
        const { id, goBack, state } = this.props;

        return (
            <Panel id={id}>
                <PanelHeader left={
                  <HeaderButton onClick={() => goBack()}>
			               {IS_PLATFORM_IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
		               </HeaderButton>}>Карта</PanelHeader>

                    { this.state.loading && <Div><Spinner/></Div> }

                   <YMaps>
                   <Map className={ IS_PLATFORM_IOS ? 'MapsCssIOS' : 'MapsCssAndroid'} onLoad={() => this.setState({ loading: false }) } width="100vw" height="100vh" defaultState={{ center: [state.lat, state.long], zoom: 14 }} >

                   <Placemark  geometry={[state.lat, state.long]} />
                   <ZoomControl options={{ float: 'right' }} />

                   </Map>
                   </YMaps>
            </Panel>
        );
    }
}

export default MapW;
