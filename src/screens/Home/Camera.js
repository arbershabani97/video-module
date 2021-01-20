import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNVideoEditor from 'react-native-video-editor';
import { routes } from '../../navigation';
import navigationService from '../../navigation/navigation-service';
import { selectVideo, getFileSizeByUri, getVideoInfo, compressVideo } from '../../services';
import { ProcessingManager } from 'react-native-video-processing';

const CAMERA_OPTIONS_BASE = {
  quality: RNCamera.Constants.VideoQuality['720p'],
  videoBitrate: 40 * 1000 * 1000,
  maxDuration: 60,
  maxFileSize: 250 * 2 ** 20,
  mirrorVideo: false,
};

export const Camera = () => {
  const [cameraOptions, setCameraOptions] = useState(CAMERA_OPTIONS_BASE)
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back)
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.on)
  const [recordData, setRecordData] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecodingFinished, setIsRecordingFinished] = useState(false);

  const camera = useRef(null);

  useEffect(() => {
    if (!isRecording && recordData.length > 0 && isRecodingFinished ) {
      recordData.map(async (item) => {
        const videoInfo = await getVideoInfo(item.uri);
        console.log(videoInfo)
      });
      const videos = recordData.map((item) => {
        return item.uri
      });
      try {
        RNVideoEditor.merge(
          videos,
          (results) => {
            console.log(results);
          },
          async (results, file) => {
            const videoInfo = await getVideoInfo(file);
            if (file && videoInfo && videoInfo.duration > 0) {
              navigationService.navigate(routes.preview.routeName, {video: file})
              setRecordData([])
            }
          }
        );
      } catch (error) {
        console.log(error)
      }
    }
  }, [recordData, isRecording, isRecodingFinished])

  useEffect(() => {
    if (cameraType === RNCamera.Constants.Type.front) setCameraOptions({...CAMERA_OPTIONS_BASE, mirrorVideo: false})
    else setCameraOptions(CAMERA_OPTIONS_BASE)
  }, [cameraType])

  const takePicture = async () => {
    if (camera && !isRecording) {
      setIsRecording(true);
      setIsRecordingFinished(false);
      const data = await camera.current.recordAsync(cameraOptions);
      setIsRecordingFinished(true);
      setRecordData([...recordData, data])
    } else {
      if (camera) {
        camera.current.stopRecording()
      }
      setIsRecording(false);
    }
  };

  const changeCamera = async () => {
    if (cameraType === RNCamera.Constants.Type.back){
      setCameraType(RNCamera.Constants.Type.front)
    } else {
      setCameraType(RNCamera.Constants.Type.back)
    }
  };

  const onCameraReady = async () => {
    if (isRecording) {
      try {
        setIsRecordingFinished(false);
        const data = await camera.current.recordAsync(cameraOptions);
        setIsRecordingFinished(true);
        setRecordData([...recordData, data])
      } catch (error) {
        console.log(error)
      }
    }
  }

  const changeFlashMode = () => {

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity onPress={changeFlashMode} style={styles.capture}>
          <Text style={{ fontSize: 14, color: '#000' }}> Flash </Text>
        </TouchableOpacity>
      </View>
      <RNCamera
        ref={camera}
        style={styles.preview}
        type={cameraType}
        flashMode={flashMode}
        onCameraReady={onCameraReady}
      />
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity onPress={takePicture} style={styles.capture}>
          {
            <Text style={{ fontSize: 14, color: '#000' }}>
              {
                !isRecording ? 'START' : 'STOP' 
              }
            </Text>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={changeCamera} style={styles.capture}>
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
