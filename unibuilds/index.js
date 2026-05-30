import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App);
// Ele também garante que o app funcione corretamente no Expo Go e em builds nativos
registerRootComponent(App);
