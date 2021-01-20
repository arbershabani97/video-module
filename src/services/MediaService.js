import { Platform } from 'react-native';
import { ProcessingManager, VideoPlayer } from 'react-native-video-processing';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

const VIDEO_OPTIONS_BASE = {
  mediaType: 'video',
  durationLimit: 120,
  allowsEditing: true,
  storageOptions: {
      path: 'videomodule'
  }
};

const RESIZE_OPTIONS = {
  vertical: {
      width: 720,
      height: 1280,
      bitrateMultiplier: 3,
      minimumBitrate: 300000
  },
  horizontal: {
      width: 1280,
      height: 720,
      bitrateMultiplier: 3,
      minimumBitrate: 300000
  }
};

export const getVideoInfo = async (source) =>  {
  let output = null;
  output = await ProcessingManager.getVideoInfo(source);
  return output;
}

export const getFileSizeByUri = async (uri) => {
  const resultUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
  const result = await RNFetchBlob.fs.stat(resultUri);
  return Number(result.size);
}

export const compressVideo = (uri) => {
  return new Promise(async (resolve) => {
    const output = {
        uri: null,
        path: null,
        error: null,
        cancelled: false,
        extension: '.mp4',
        mime: 'video/mp4',
        type: 'VIDEO'
    };
  
    const videoOptions = {
        ...VIDEO_OPTIONS_BASE,
        title: 'Select video',
        takePhotoButtonTitle: 'Take a video',
        chooseFromLibraryButtonTitle: 'Choose from Library'
    };
  
    output.uri = uri;
    const videoInfo = await getVideoInfo(output.uri);
    if (!videoInfo) {
        output.error = 'Something was wrong';
        return resolve(output);
    }

    if (videoInfo.duration >= 121) {
        output.error = 'The maximum duration for a video is 1 minute';
        return resolve(output);
    }

    const isVertical = videoInfo.size.height > videoInfo.size.width;

    if ((isVertical && videoInfo.size.width > 720) || (!isVertical && videoInfo.size.height > 720)) {
        try {
            output.uri = await ProcessingManager.compress(
              output.uri,
              RESIZE_OPTIONS[isVertical ? 'vertical' : 'horizontal']
            );
        } catch (e) {
            console.log(e);
        }
    }

    const fileSize = output.uri && await getFileSizeByUri(output.uri);
    // Filesize is measured in bytes
    if (fileSize && fileSize >= Number(250 * 2 ** 20)) {
        output.error = 'The maximum video file size is 250mb';
        return resolve(output);
    }
    return resolve(output);
  });
}

export const selectVideo = () => {
  return new Promise((resolve) => {
    const output = {
        uri: null,
        path: null,
        error: null,
        cancelled: false,
        extension: '.mp4',
        mime: 'video/mp4',
        type: 'VIDEO'
    };
  
    const videoOptions = {
        ...VIDEO_OPTIONS_BASE,
        title: 'Select video',
        takePhotoButtonTitle: 'Take a video',
        chooseFromLibraryButtonTitle: 'Choose from Library'
    };
  
    launchCamera(videoOptions, async (response) => {
      // startProcessing();
      if (response.didCancel) {
          output.cancelled = true;
          return resolve(output);
      }

      if (response.error) {
          output.error = response.error;
          return resolve(output);
      }
      output.path = response.path || null;
      output.uri = response.uri;
      const videoInfo = await getVideoInfo(output.path || output.uri);
      if (!videoInfo) {
          output.error = 'Something was wrong';
          return resolve(output);
      }

      if (videoInfo.duration >= 121) {
          output.error = 'The maximum duration for a video is 1 minute';
          return resolve(output);
      }

      const isVertical = videoInfo.size.height > videoInfo.size.width;

      if ((isVertical && videoInfo.size.width > 720) || (!isVertical && videoInfo.size.height > 720)) {
          try {
              output.uri = await ProcessingManager.compress(
                  output.uri,
                  RESIZE_OPTIONS[isVertical ? 'vertical' : 'horizontal']
              );
          } catch (e) {
              console.log(e);
          }
      }

      const fileSize = output.uri && await getFileSizeByUri(output.uri);

      // Filesize is measured in bytes
      if (fileSize && fileSize >= Number(250 * 2 ** 20)) {
          output.error = 'The maximum video file size is 250mb';
          return resolve(output);
      }
      return resolve(output);
    });
  });
}