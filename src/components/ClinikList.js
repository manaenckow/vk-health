import React, { Component } from 'react';
import { Group, Div, Cell, List, Link, Button, Spinner, Separator, InfoRow } from '@vkontakte/vkui';

import connect from '@vkontakte/vk-connect';

import { getMessage } from '../js/helpers';
import '../css/App.css';

class ClinikList extends Component {

    render() {

        const { cliniks } = this.props;

        if(!cliniks) return <Div><Spinner/></Div>
        const goClinik = e => {
        const { setParentState, getSpecs } = this.props;

        setParentState({ clinik: e });
        getSpecs(e.id)
      }

      const goMap = e => {
      const { setParentState, goPanel } = this.props;

      setParentState({
        lat: e.latitide,
        long: e.longitude,
      });

      goPanel('map');
    }

        return (
          <>
                {
                    (cliniks && cliniks.length) ?
                        <>
                          <Group title="Выберите поликлинику"/>
                            {
                                cliniks.map((clinik, index) =>
                                <Group style={{ marginTop: 10 }} key={index} title={clinik.lpuFullName}>
                                <List>
                                  <Cell
                                      onClick={() => {
                                        let text = clinik.address.split(',').splice(1).join(',');
                                        connect.send("VKWebAppCopyText", { text: text });
                                      }}
                                      multiline
                                    >
                                  <InfoRow title={ getMessage('adress') }>
                                    {clinik.address.split(',').splice(1).join(',')}
                                  </InfoRow>
                                  </Cell>
                                  {/*
                                    <Cell multiline>
                                        <InfoRow title={ getMessage('desk') }>
                                          {clinik.description}
                                        </InfoRow>
                                      </Cell>
                                  */}
                                  <Cell multiline>
                                    <InfoRow title={ getMessage('phone') }>
                                      <Link href={clinik.phone.startsWith('(') ? `tel:+7${clinik.phone}` : `tel:${clinik.phone}`}>
                                      {clinik.phone.startsWith('(') ? `+7 ${clinik.phone}` : clinik.phone}
                                      </Link>
                                    </InfoRow>
                                  </Cell>
                                  {
                                    clinik.email !== null &&
                                    <Cell multiline>
                                    <InfoRow title={ getMessage('email') }>
                                    <Link href={`mailto:${clinik.email}`}>
                                      {clinik.email}
                                      </Link>
                                    </InfoRow>
                                  </Cell>
                                }
                                  <Cell multiline>
                                    <InfoRow title={ getMessage('lpuType') }>
                                      {clinik.lpuType ? clinik.lpuType : 'Неизвестно'}
                                    </InfoRow>
                                  </Cell>
                                </List>
                                <Separator/>
                                <Div style={{ display: 'flex' }}>
                                <Button stretched size="l" onClick={ () => goClinik(clinik) } level="primary">{getMessage('clinik_button')}</Button>
                                <Button style={{ marginLeft: 5 }} stretched size="l" onClick={ () =>  goMap(clinik) } level="secondary">{getMessage('map_clinik_button')}</Button>
                                </Div>
                              </Group>


                              )
                            }
                        </>
                        :
                        <Group><Div>В данном районе не найдено ни одной поликлиники</Div></Group>
                }
                </>
        )
    }
}

export default ClinikList;
