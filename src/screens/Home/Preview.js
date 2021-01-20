import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNVideoEditor from 'react-native-video-editor';
import { selectVideo } from '../../services';
import Video from 'react-native-video';
import { VideoPlayer, Trimmer } from 'react-native-video-processing';

export const Preview = (props) => {
  const { video  } = props.route.params 
  console.log(video)

  const onError = (props) => {
    console.log('error = ', props)
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity style={styles.capture}>
          <Text style={{ fontSize: 14, color: '#000' }}> Flash </Text>
        </TouchableOpacity>
      </View>
      {
        video && 
        <Video
          source={{uri: video}}
          onError={onError}
          style={{flex: 1, backgroundColor: '#444'}}
          repeat
          resizeMode="contain"
          playWhenInactive={false}
          playInBackground={false}
          fullscreen={false}
        />
      }
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity style={styles.capture}>
          <Text style={{ fontSize: 14, color: '#000' }}>START</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.capture}>
          <Text style={{ fontSize: 14, color: '#000' }}> CHANGE </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
});
