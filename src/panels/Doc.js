import React, { Component } from 'react';
import { Panel, PanelHeader, Div, Button, InfoRow, List, Cell, Group, IS_PLATFORM_IOS, HeaderButton } from '@vkontakte/vkui';

import moment from 'moment'

//import connect from '@vkontakte/vk-connect';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

require('moment/locale/ru');

class Doc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            doc: this.props.state.doc,
            disabled: false,
            dates: false
        };

        this.api = this.props.api;
    }

    componentDidMount() {}

    render() {
        const { id, goBack, goPanel, state, setParentState } = this.props;
        const doc = this.props.state.doc

        let room = ' ';

        if(doc[0] && doc[0].room){
           room = `в ${doc[0].room} кабинет`
        }
        const goSign = (id, visitDay, visitStart, visitEnd) => {
          setParentState({
            dateSign: id,
            visitInfo:`Приходить ${visitDay} по адресу ${state.clinik.address} ${room}. Приём продлится  с ${moment(visitStart).format('kk:mm')} до ${moment(visitEnd).format('kk:mm')}.`
           });
          goPanel('sign');
        }
        let day = false;
        return (
            <Panel id={id}>
                <PanelHeader left={
                  <HeaderButton onClick={() => goBack()}>
			               {IS_PLATFORM_IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
		               </HeaderButton>}>Расписание</PanelHeader>
                   {
                       (doc && doc.length) ?
                           <>
                           <Group>
                           <List>
                           {
                             doc[0].address &&
                             <Cell multiline>
                             <InfoRow title='Адрес'>
                                {doc[0].address}
                             </InfoRow>
                             </Cell>
                           }
                           {
                             state.currentDocName &&
                             <Cell multiline>
                             <InfoRow title='Врач'>
                                {state.currentDocName}
                             </InfoRow>
                             </Cell>
                           }
                            {
                              doc[0].room &&
                               <Cell multiline>
                              <InfoRow title='Кабинет:'>
                                 {doc[0].room}
                              </InfoRow>
                              </Cell>
                            }
                           </List>
                         </Group>
                          <Group>
                           {
                             doc.map((item, index) => (
                           <Group key={index}>

                           { +item.visitStart.slice(8, 10) !== +day &&
                           <Group title={ `${day = item.visitStart.slice(8, 10) } ${moment(item.visitStart).format('MMM')} ` }>


                             </Group>
                           }
                              <Div style={{ display: 'inline-flex', verticalAlign: 'center', alignItems: 'center'}}>
                              <div style={{ width: '100%' }}>
                              {`Приём с ${moment(item.visitStart).format('kk:mm')}
                              до ${moment(item.visitEnd).format('kk:mm')}`}
                              </div>
                              <Button
                                style={{ position: 'absolute', right: '20px' }}
                                onClick={ () => goSign(item.id, `${day = item.visitStart.slice(8, 10) } ${moment(item.visitStart).format('MMM')} `,
                                item.visitStart, item.visitEnd)}
                                level="primary"
                              >Выбрать
                              </Button>

                              </Div>
                           </Group>
                           ))
                          }
                          </Group>
                           </>
                           :
                           <Group><Div align='center'>Талонов не найдено</Div></Group>
                   }
            </Panel>
        );
    }
}

export default Doc;
