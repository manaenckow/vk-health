import React, {Component} from 'react';
import { Panel, PanelHeader, Div, Group, IS_PLATFORM_IOS, Select, FormLayout, HeaderButton } from '@vkontakte/vkui';

//import connect from '@vkontakte/vk-connect';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

import DocList from '../components/DocList';

class Clinik extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clinik: this.props.state.clinik,
            disabled: false
        };

        this.api = this.props.api;
    }

    componentDidMount() {}

    render() {
        const { id, goBack, setParentState, state, getDocs } = this.props;

        const clinik = `Клиника «${state.clinik.lpuShortName}»`;

        const onChange = (e) => {
          const { name, value } = e.currentTarget;
          setParentState({ [name]: value });
          getDocs(state.clinik.id, value);
        }

        return (
            <Panel id={id}>
                <PanelHeader left={
                  <HeaderButton onClick={() => goBack()}>
			               {IS_PLATFORM_IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
		               </HeaderButton>}>{clinik}</PanelHeader>
                   <Group>
                    <FormLayout>
                  {
                    state.specs[0] ?
                    <Select
                        placeholder={'Выберите специалиста'}
                        top={ 'Специалист' }
                        name="spec"
                        value={state.spec}
                        onChange={ onChange }
                    >

                                {
                                    state.specs.map((spec, index) =>
                                    <option key={index} value={spec.id}>{spec.name.toLowerCase()}</option>
                                  )
                                }

                    </Select>
                    : <Div>Произошла внутренняя ошибка сервера</Div>
                  }
                   {
                     state.spec && <DocList clinik2={state.clinik} {...this.props}/>
                   }
                    </FormLayout>
                    </Group>
            </Panel>
        );
    }
}

export default Clinik;
