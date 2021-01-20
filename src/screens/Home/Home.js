import React from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import { selectVideo } from '../../services';
import { Camera } from './Camera';

export const Home = () => {
  const onSelectVideo = async () => {
    try {
        const mediaOutput = selectVideo();
        if (!mediaOutput.error && !mediaOutput.cancelled) {
          console.log(mediaOutput)
        } else if (mediaOutput.error) {
          console.log(error)
        }
    } catch (e) {
        console.log(e);
    } finally {
        // setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Button
        title={'Native Camera'}
        color={'#303030'}
        onPress={onSelectVideo}
      />
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignItems: 'center',
  },
});
