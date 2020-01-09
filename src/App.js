import React from 'react';
import connect from '@vkontakte/vk-connect';
import { View, ScreenSpinner, ConfigProvider, /*TabbarItem, Tabbar,*/ Epic, Avatar, Snackbar } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';

import './css/App.css';

import API from './js/api';
import { showAlert } from './js/helpers';

//import Icon24Search from '@vkontakte/icons/dist/24/search';
//import Icon24List from '@vkontakte/icons/dist/24/list';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';

import Home from './panels/Home';
import District from './panels/District';
import Map from './panels/Map';
import Clinik from './panels/Clinik';
import Doc from './panels/Doc';
import SignUp from './panels/SignUp';
import Search from './panels/Search';
import Offline from './panels/Offline';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'districts',
			activeStory: 'home',
			history: ["districts"],
			fetchedUser: {
				first_name: 'Test',
				last_name: 'User'
			},
			popout: null,
			snackbar: null,
			offline: false,
			districts: false,
			district: false,
			cliniks: false,
			clinik: false,
			specs: false,
			doc: false,
			docs: false,
			currentDistrictId: false,
			userDistricts: false,
			dateSign: '',
			visitInfo: '',
			birthday: '',
			phone: '',
			first_name: '',
			last_name: '',
			email: '',
			middle_name: '',
			accept: '',
			noty: '',
			lat: '',
			long: ''
		};

		this.initApp();

		this.onStoryChange 	= this.onStoryChange.bind(this);
	}

		initApp = () => {

		window.showOfflinePage = (e) => {
            this.setState({ offline: e });
		};

		window.showAlert = (message, title, actions) => {
            showAlert(this.setState.bind(this), message, title, actions);
		};

		window.showLoader = (show) => {
            this.setState({ popout: show ? <ScreenSpinner /> : null });
		};

		this.api = new API();
	}

	componentDidMount() {
		window.addEventListener('popstate', e => {
			e.preventDefault();
			this.goBack(e);
		});
		window.history.pushState({ panel: 'districts' }, `districts`)
		connect.subscribe((e) => {
			if(e.detail.data) console.log(e.detail.type, e.detail.data)
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					this.setState({
						fetchedUser: e.detail.data,
						last_name: e.detail.data.last_name,
						first_name: e.detail.data.first_name
					 });
					break;
					case 'VKWebAppUpdateConfig':
					const schemeAttribute = document.createAttribute('scheme');
					schemeAttribute.value = e.detail.data.scheme ? e.detail.data.scheme : 'client_light';
					document.body.attributes.setNamedItem(schemeAttribute);
					break;
					case 'VKWebAppGetPhoneNumberResult':
					connect.send("VKWebAppTapticNotificationOccurred", {"type": "success"});
					this.setState({ phone: e.detail.data.phone_number });
					console.log(this.state)
					break;
					case 'VKWebAppAllowMessagesFromGroupResult':
					this.setState({ noty: e.detail.data.result });
					break;
					case 'VKWebAppGetEmailResult':
					connect.send("VKWebAppTapticNotificationOccurred", {"type": "success"});
					this.setState({ email: e.detail.data.email });
					break;
					case 'VKWebAppViewHide':
					window.showLoader(false);
					break;
					case 'VKWebAppCopyTextResult':
					this.openDoneSnackbar('Скопировано');
					break;
					case 'VKWebAppGeodataResult':
					this.setState({
						activePanel: 'map',
						lat: e.detail.data.lat,
						long: e.detail.data.long,
					});
					break;
					case 'VKWebAppGeodataFailed':
					this.openErrorSnackbar('Доступ к геолокации запрещён.')
					break;
				default:
					// code
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
		setInterval(() => this.checkOnline(), 1500)
		this.getDistricts()
	}
	onStoryChange = (story, panel) => {
			this.setState({
				activeStory: story,
				activePanel: panel
			});
	}
	goPanel = (panel) => {
			if(panel === 'home'){
				this.setState({ cliniks: false });
			}
        window.history.pushState({ panel: panel }, panel)
        this.setState({
            activePanel: panel,
            history: [...this.state.history, panel]
        });
    }
	goBack = () => {
			 this.setState({ snackbar: null });
			 window.showLoader(false);
			 let history = [...this.state.history];
	     history.pop();
	     let activePanel = history[history.length - 1];
			 if(!activePanel) activePanel = 'districts';
	     if (activePanel === 'districts') {
	       connect.send('VKWebAppDisableSwipeBack');
	     } else if(activePanel === 'district'){
				 this.setState({ spec: false });
			 } else if (activePanel === 'home'){
				 this.setState({ cliniks: false });
			 }
			 if(history.length === 0) {
				 connect.send("VKWebAppClose", { "status": "success", "text": "Не болейте!" });
				 console.log('close')
			 }
	     this.setState({ history, activePanel });
   }
	checkOnline = e => {
		if(window.navigator.onLine){
			window.showOfflinePage(false)
		} else window.showOfflinePage(true)
	}

	getDistricts = async (id) => {
			this.setState({ districts: false });
			const districts = await this.api.GetDistricts(id);
			this.setState({ districts });
	}
	getDistrict = async (id, goPanel = true) => {
			const cliniks = await this.api.GetDistrict(id);
			this.setState({ cliniks });
	}
	getSpecs = async (id, goPanel = true) => {
			window.showLoader(true);
			this.setState({ specs: false });
			const specs = await this.api.GetSpecs(id);
			this.setState({ specs });
			window.showLoader(false);
			if(goPanel) this.goPanel('clinik')
	}
	getDocs = async (lpu, spec) => {
			this.setState({ docs: false });
			const docs = await this.api.GetDocs(lpu, spec)
			this.setState({ docs });
			window.showLoader(false);
	}
	getDoc = async (lpu, docId) => {
			window.showLoader(true);
			this.setState({ doc: false });
			const doc = await this.api.GetDoc(lpu, docId)
			this.setState({ doc });
			window.showLoader(false);
			if(doc.length !== 0){
				this.goPanel('doc');
			} else this.openErrorSnackbar('Произошла ошибка');
	}
 	openDoneSnackbar = e => {
		this.setState({
			snackbar: <Snackbar
										duration={2000}
										layout="vertical"
										onClose={() => this.setState({ snackbar: null })}
										before={<Avatar size={24} style={{ backgroundColor: '#4bb34b' }}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
								>
									{e}
								</Snackbar>
		});
	}
	openErrorSnackbar = (e, time = 2000) => {
		this.setState({
			snackbar: <Snackbar
										duration={time}
										layout="vertical"
										onClose={() => this.setState({ snackbar: null })}
										before={<Avatar size={24} style={{backgroundColor: '#FF0000'}}><Icon16Clear fill="#fff" width={14} height={14} /></Avatar>}
										>
										{e}
								</Snackbar>
		});
	}


	render() {
		const { api, state, goPanel, goBack, onStoryChange, openDoneSnackbar,
			openErrorSnackbar, getDistricts, getDistrict, getSpecs, getDocs, getDoc } = this;

		const { offline, popout, activeStory, specs, districts, activePanel, fetchedUser, docs } = this.state;
		const props = { api, state, openDoneSnackbar, openErrorSnackbar, activeStory,
			 getDistricts, districts, specs, docs, goBack, goPanel, onStoryChange,
			 getSpecs, getDistrict, getDocs, getDoc, fetchedUser, setParentState: this.setState.bind(this) };

		const views = { popout, activePanel, };

		return (
			<ConfigProvider isWebView={true}>
				{
					offline ?
						<View id="offline" popout={ popout } activePanel="offline">
							<Offline id="offline" { ...props } />
						</View>
						:
						<Epic activeStory={ activeStory }/* tabbar={

						  <Tabbar>
							<TabbarItem
								onClick={ () => this.setState({
									activePanel: 'districts',
									activeStory: 'home'
								}) }
								selected={ activeStory === 'home' }
							><Icon24List /></TabbarItem>
							<TabbarItem
								onClick={ () => this.setState({
									activePanel: 'search',
									activeStory: 'search'
								}) }
								selected={ activeStory === 'search' }
							><Icon24Search /></TabbarItem>
							</Tabbar>
						}*/>

								<View id="search" popout={ popout } activePanel="search">
									<Search id="search" { ...props } />
								</View>

								 <View id="home" 	onSwipeBack={this.goBack} history={this.state.history} { ...views } >
									<Home id="districts" { ...props } />
									<District id="district" { ...props } />
									<Map id="map" { ...props } />
									<Clinik id="clinik" { ...props } />
									<Doc id="doc" { ...props } />
									<SignUp id="sign" { ...props } />
								</View>
							</Epic>

				}
			</ConfigProvider>
		);
	}
}

export default App;
