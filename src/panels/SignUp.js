import React, { Component } from 'react';
import { Panel, PanelHeader, FormLayout, Checkbox, Input, Button, Group, IS_PLATFORM_IOS, HeaderButton } from '@vkontakte/vkui';

import connect from '@vkontakte/vk-connect';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

class Doc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requested: false
        };

        this.api = this.props.api;
    }

    componentDidMount() {}

    render() {
        const { id, goBack, setParentState, openDoneSnackbar, openErrorSnackbar, state } = this.props;
        const pDate = (date = new Date()) => {
            var dd = date.getDate();
            if (dd < 10) dd = '0' + dd;
            var mm = date.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;
            var yyyy = date.getFullYear();
            return yyyy + '-' + mm + '-' + dd;
        }
        const regExp = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        const onChange = (e) => {
          const { name, value } = e.currentTarget;
          setParentState({ [name]: value });
          if(name === 'accept') setParentState({ [name]: e.currentTarget.checked });
        }


        const submit = (e) => {
          if(!state.birthday || !state.first_name || !state.last_name
             || !state.phone ) {
              openErrorSnackbar('Вы не заполнили обязательные поля.')
              return
            } else if(state.email && !regExp.test(state.email)){
              openErrorSnackbar('Эл. почта введена неверно.')
              return
            } else if(!state.accept) {
              openErrorSnackbar('Вы не дали согласие на обработку персональных данных.')
              return
            }

          console.log({
            ДатаРождения: state.birthday,
            Имя: state.first_name,
            Фамилия: state.last_name,
            Отчество: state.middle_name,
            Номер: state.phone,
            Почта: state.email,
            Клиника: state.clinik.id,
            Согласие: state.accept,
            IDВремениЗаписи: state.dateSign,
            noty: state.noty
          });

          this.api.CheckPatient({
            lpu: state.clinik.id,
            firstName: state.first_name,
            lastName: state.last_name,
            middleName: state.middle_name,
            birthdate: state.birthday
          }).then(res => {
            if(res[0]) {
                connect.send("VKWebAppTapticNotificationOccurred", {"type": "success"});
                openDoneSnackbar('Вы успешно записались.');
                if(state.noty){
                  let mes = `${state.first_name} ${state.middle_name} ${state.last_name} записан на приём к ${state.currentDocName}.
                  ${state.visitInfo}`
                  this.api.Up().then(res => connect.send("VKWebAppSendPayload", {"group_id": 190034906, "payload": { mes } }))
                  console.log('noty')
                }
            } else {
              if(res[1]){
                openErrorSnackbar(res[1], 5000);
              }
              connect.send("VKWebAppTapticNotificationOccurred", {"type": "error"});
            }
          })

        }
        return (
            <Panel id={id}>
                <PanelHeader left={
                  <HeaderButton onClick={() => goBack()}>
			               {IS_PLATFORM_IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
		               </HeaderButton>}>Запись на приём</PanelHeader>
                   <Group>
                   <FormLayout>
                   <Input
                       required
                       type="text"
                       top={ `Имя` }
                       name="first_name"
                       value={state.first_name}
                       maxLength='20'
                       onChange={ onChange }
                   />
                   <Input
                       required
                       type="text"
                       top={ `Фамилия` }
                       name="last_name"
                       value={state.last_name}
                       maxLength='30'
                       onChange={ onChange }
                   />
                   <Input
                       type="text"
                       top={ `Отчество (при наличии)` }
                       name="middle_name"
                       value={state.middle_name}
                       maxLength='30'
                       onChange={ onChange }
                   />
                   <Input
                       required
                       type="date"
                       min="1910-01-01"
                       max={pDate()}
                       value={state.birthday}
                       top={ 'Дата рождения' }
                       name="birthday"
                       onChange={ onChange }
                   />
                   <Input
                       required
                       type="tel"
                       top={ `Номер телефона` }
                       name="phone"
                       value={state.phone}
                       readOnly
                       maxLength='30'
                       placeholder='+7 (999) 234 5678'
                       onChange={ onChange }
                       onClick={() => {
                           connect.send("VKWebAppGetPhoneNumber", {});
                       }}
                   />
                   <Input
                       type="email"
                       top={ `Эл. почта (при наличии)` }
                       name="email"
                       value={state.email}
                       maxLength='30'
                       placeholder='mymail@gmail.com'
                       onChange={ onChange }
                       onClick={() => {
                         if(!this.state.requested){
                           connect.send("VKWebAppGetEmail", {})
                           console.log('VKWebAppGetEmail');
                           this.setState({ requested: true });
                         }
                       }
                       }
                   />
                  <Checkbox
                      name='accept'
                      defaultChecked={state.accept}
                      value={state.accept}
                      onChange={ onChange }
                   >Я даю согласие на обработку своих персональных данных (имя, отчество, фамилия, дата рождения, почта, телефон) в соответствии с требованиями Федерального закона №152-ФЗ от 27.07.2006.</Checkbox>
                   <Checkbox
                       name='noty'
                    /*   defaultChecked={state.noty}*/
                       checked={state.noty}
                       onChange={ (e) => {
                         if(e.currentTarget.checked){
                           console.log('Запросили право на рассылку!)')
                           connect.send("VKWebAppAllowMessagesFromGroup", {"group_id": 190034906, "key": "noty"});
                         } else setParentState({ noty: false });
                       } }
                    >Отправить информацию по записи в личные сообщения</Checkbox>
                 <Button size="xl" onClick={ submit } level="primary">Записаться</Button>
                   </FormLayout>
                    </Group>
                    {state.snackbar}
            </Panel>
        );
    }
}

export default Doc;
