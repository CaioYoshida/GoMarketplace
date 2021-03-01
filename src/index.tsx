import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';

import Routes from './routes';
import AppContainer from './hooks';

const App: React.FC = () => (
  <View style={{ backgroundColor: '#ccc', flex: 1 }}>
    <AppContainer>
      <StatusBar barStyle="light-content" backgroundColor="#ccc" />
      <Routes />
    </AppContainer>
  </View>
);

export default App;
