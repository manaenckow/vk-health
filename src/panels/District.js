import React, { Component } from 'react';
import { Panel, PanelHeader,  IS_PLATFORM_IOS, HeaderButton } from '@vkontakte/vkui';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import CliniktList from '../components/ClinikList';
import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

class District extends Component {
    constructor(props) {
        super(props);

        this.state = {
            district: this.props.state.district,
            cliniks: this.props.state.cliniks,
            disabled: false
        };

        this.api = this.props.api;
    }

    componentDidMount() {
        this.props.getDistrict(this.state.district.id, false);
    }

    render() {
        const { id, goBack, setParentState} = this.props;

        const district = `${this.state.district.name} р-н`;

        return (
            <Panel id={id}>
                <PanelHeader left={
                  <HeaderButton onClick={() => goBack()}>
			               {IS_PLATFORM_IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
		               </HeaderButton>}>{district}</PanelHeader>
                    <CliniktList
                    {...this.props}
                    cliniks={ this.props.state.cliniks }
                    setParentState={ setParentState }
                    />
                    {this.props.state.snackbar}
            </Panel>
        );
    }
}

export default District;
