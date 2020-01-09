import { messages } from "./messages";
import React from 'react';
import { Alert } from '@vkontakte/vkui';
// import connect from '@vkontakte/vk-connect';

export const isDev = (window.location.hash === '#debug') ? true : false;
export const isLocal = (window.location.port === '8080') ? true : false;

export const sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

export const initLazyLoad = () => {
    window.onscroll = () => {
        const moreButton = document.getElementById('lazy-more');

        if (moreButton && moreButton.disabled === false) {
            if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 300)) {
                moreButton.click();
            }
        }
    };
};

export const getMessage = (k, d) => {
    if (messages && messages[k]) {
        return messages[k];
    } else {
        return d || '—';
    }
}

export const showAlert = (setState, title, message, actions) => {
    actions = actions ? actions : [{
        title: 'Ок',
        autoclose: true,
        style: 'cancel'
    }];

    setState({
        loader: null,
        disable: false,
        popout: <Alert
                    actionsLayout="vertical"
                    actions={actions}
                    onClose={ () => {
                        setState({ popout: null })
                    }}
                >
                    { title ? <h2>{ title }</h2> : <h2>{ getMessage('oops') }</h2> }
                    <p>{ message || getMessage('wtf') }</p>
                </Alert>
    });
}

export const formatNumber = (number) => {
     if (number === null) return 0;
  return `${number}`.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
};

export const shortNumber = count => {
  if(count > 1000){
    return formatNumber(Math.floor(count/1000)) + 'K участников'
  } else if(count > 0){
    return `${count} участников`
  } else return 'Участников нет'
}

export const dd = (...m) => {
    if (isDev || isLocal) console.log(...m);
}
