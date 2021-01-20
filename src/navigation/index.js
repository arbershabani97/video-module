import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Camera, Home, Preview } from '../screens';
import { navigationRef } from './navigation-service';

export const routes = {
  home: {
    screen: Home,
    routeName: 'home'
  },
  camera: {
    screen: Camera,
    routeName: 'camera'
  },
  preview: {
    screen: Preview,
    routeName: 'preview'
  },
}

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={routes.camera.routeName}
    >
      <HomeStack.Screen
        name={routes.home.routeName}
        component={routes.home.screen}
      />
      <HomeStack.Screen
        name={routes.camera.routeName}
        component={routes.camera.screen}
      />
      <HomeStack.Screen
        name={routes.preview.routeName}
        component={routes.preview.screen}
      />
    </HomeStack.Navigator>
  )
}

const AppContainer = () => {
    return (<NavigationContainer ref={navigationRef} >
      { <HomeNavigator /> }
    </NavigationContainer>)
}

export default AppContainer
