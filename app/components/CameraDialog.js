import React, { Component } from 'react';
import {StyleSheet, View, Image, Modal, TouchableOpacity, Text, Button, Clipboard} from 'react-native';

import {PictureService} from '../services/PictureService';
import {RNCamera} from 'react-native-camera';

class CameraDialog extends Component {
  static defautlProps = {
    isOpen: false,
    onClose: () => {}
  }

  state = {
    currentImage: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
  }

  save = async () => {
    const result = await PictureService.save(this.state.currentImage);
    this.props.onClose(result);
  }

  shot = async () => {
        if(this.camera){
            const options = {quality: 0.5, base64: true},
                data = await this.camera.takePictureAsync(options);
            this.setState({currentImage: data.uri});
        }
    }

  getImageFromClipboard = async () => {
    const imageUrl = await Clipboard.getString(),
      extensions = ['png', 'jpg', 'jpge'],
      isImage = extensions.some(extension => imageUrl.toLowerCase().includes(extension));
      
    if (isImage) {
      this.setState({currentImage: imageUrl});
    }
  }

  render() {
    const {props} = this;
    const {state} = this;
    const keyExtractor = item => item.id;

    return (
      <Modal visible={props.isOpen} transparent={false} animationType="slide">
        <View style={styles.modalView}>
          <View style={styles.previewContainer}>
            <Image source={{uri: state.currentImage}} style={styles.preview} />
            <TouchableOpacity onPress={props.onClose}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cameraContainer}>
            <RNCamera
               ref={ref => { this.camera = ref; }}
               style={styles.camera}
               type={RNCamera.Constants.Type.front}
               flashMode={RNCamera.Constants.FlashMode.on}

            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Salvar"
              onPress={this.save}
              color="#0062cc"
            />
            <Button
              title="Tirar"
              onPress={this.shot}
              color="#0062cc"
            />
            <Button
              title="Colar"
              onPress={this.getImageFromClipboard}
              color="#0062cc"
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1
  },
  previewContainer: {
    backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  preview: {
    width: 100,
    height: 75,
    borderWidth: 2,
    borderColor: '#000'
  },
  closeButton: {
    padding: 15,
    backgroundColor: 'red',
    fontSize: 20,
    color: '#fff'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    backgroundColor: 'gray'
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  camera: {
    flex: 1,
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

export default CameraDialog;