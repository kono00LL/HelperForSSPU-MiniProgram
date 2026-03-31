import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { Image as ExpoImage } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
interface Props {
  images: { uri: string }[];
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  onImageIndexChange?: (index: number) => void;
  currentIndex: number;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');
// const [currentIndex, setCurrentIndex] = useState(imageIndex);

export function ImageViewer({ images, imageIndex, visible, onRequestClose, onImageIndexChange, currentIndex }: Props) {
  const [saving, setSaving] = useState(false);
// TODO 诶我草怎么更新到expo55后下载不能用了
  const saveImage = async (uri: string) => {
    try {
      setSaving(true);
      const { status: perm } = await MediaLibrary.requestPermissionsAsync(false, ['photo']);
      if (perm !== "granted") {
        Alert.alert("提示", "需要相册权限才能保存图片");
        return;
      }
      const fileName = `img_${Date.now()}.jpg`;
      const localUri = `${FileSystem.cacheDirectory}${fileName}`;
      const { uri: savedUri } = await FileSystem.downloadAsync(uri, localUri);
      await MediaLibrary.saveToLibraryAsync(savedUri);
      Alert.alert('图片已保存到相册');
    } catch (e) {
      Alert.alert("保存失败，请重试");
      console.error(e);
    } finally {
      setSaving(false);
    }
  }
  
  if (!visible || images.length === 0) return null;
  return (
    <Modal
      visible={visible}
      transparent={false}
      onRequestClose={onRequestClose}
      statusBarTranslucent
      animationType="fade"
    >
      <View style={styles.container}>
        <PagerView
          style={styles.pager}
          initialPage={imageIndex}
          onPageSelected={e => onImageIndexChange?.(e.nativeEvent.position)}
        >
          {images.map((img, i) => (
            <View key={i} style={styles.page}>
              <ExpoImage
                source={{ uri: img.uri }}
                style={styles.image}
                contentFit="contain"
              />
            </View>
          ))}
        </PagerView>

        <TouchableOpacity style={styles.closeBtn} onPress={onRequestClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View className="w-full flex-row justify-end">
        <TouchableOpacity 
        onPress={() => saveImage(images[currentIndex]?.uri ?? '')}
        disabled={saving}
        className="right  mr-8 mb-8"
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="download-outline" size={24} color="#fff" />
          )}
  </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  pager: { flex: 1 },
  page: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: SCREEN_W, height: SCREEN_H * 0.9 },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: 18 },
});

export default ImageViewer;
