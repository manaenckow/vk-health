import React, { Component } from 'react';

import { Panel, PanelHeader, Search, Footer } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';


class SearchPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: false
        };

        this.api = this.props.api;
    }

    componentDidMount() {}

    render() {

        return (
            <Panel id={this.props.id}>
                <PanelHeader>Поиск</PanelHeader>
                <Search/>
                <Footer>Введите название медицинского учреждения</Footer>
            </Panel>
        );
    }
}

export default SearchPanel;
