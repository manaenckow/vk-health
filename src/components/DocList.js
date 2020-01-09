import React, { Component } from 'react';
import { Div, Cell, List, Spinner, Button, Separator, InfoRow } from '@vkontakte/vkui';

import '../css/App.css';

class DocList extends Component {

    render() {

        const { docs } = this.props;

        if(!docs) return <Spinner/>
        const goDoc = e => {
        const { setParentState, getDoc, clinik2 } = this.props;
        getDoc(clinik2.id, e.id);
        setParentState({
          doc: e,
          currentDocName: e.name
          });
      }
        return (
          <>
                {/*
                  docs &&   <Group title="Выберите доктора"/>
                */}
                {
                    (docs && docs.length) ?
                        <>
                            {
                                docs.map((doc, index) =>
                                <Div key={index}>
                                <List>
                                  <Cell multiline>
                                  <InfoRow style={{ fontSize: 15 , color: '#999'}} title={''/*{ `Врач: ${doc.name}` }*/}>
                                  { `Врач: ${doc.name}` }
                                  </InfoRow>
                                  </Cell>

                                  { doc.freeParticipantCount > 0 &&
                                    <Cell multiline>
                                    <InfoRow style={{ fontSize: 15, color: '#999' }} title={''/*{ `Свободные талоны: ${doc.freeParticipantCount}` }*/}>
                                    { `Свободные талоны: ${doc.freeParticipantCount}` }
                                    </InfoRow>
                                    </Cell>
                                  }
                                </List>
                                {/*<Separator/>*/}
                                <Div style={{ display: 'flex' }}>
                                <Button
                                  stretched
                                  size="l"
                                  disabled={/*!(doc.freeTicketCount > 0 || */!doc.freeParticipantCount > 0/*)*/}
                                  onClick={ () => goDoc(doc) }
                                  level="secondary">{/*doc.freeTicketCount > 0 ||*/ doc.freeParticipantCount > 0 ? 'Выбрать талон' : 'Доступных талонов нет'}
                                </Button>
                                </Div>
                                {  docs.length - 1 > index && <Separator wide/>}
                                </Div>
                              )
                            }
                        </>
                        :
                        <Div>В данном направлении не найдено врачей.</Div>
                }
                </>
        )
    }
}

export default DocList;
