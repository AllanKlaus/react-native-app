/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { StyleSheet, View, Button } from 'react-native';

import PictureList from './app/components/PictureList';
import CameraDialog from './app/components/CameraDialog';

import {StorageService} from './app/services/StorageService';
import { PictureService } from './app/services/PictureService';

class App extends Component {
  state = {
    pictureList: [],
    isModalOpen: false
  }

  async componentDidMount() {
    // await StorageService.set('pictureList', [{
    //   id: '1',
    //   url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
    // }, {
    //   id: '2',
    //   url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
    // }, {
    //   id: '3',
    //   url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
    // }, {
    //   id: '4',
    //   url: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
    // }]);

    const pictureList = await StorageService.get('pictureList') || [];
    this.setState({pictureList});
  }

  onPictureSelect = (item) => {
    PictureService.selectPicture(item, this.onRemove)
  }

  onRemove = async (item) => {
    const pictureList = this.state.pictureList.filter(itemList => itemList.id !== item.id);
    await StorageService.set('pictureList', pictureList);
    this.setState({pictureList});
  }

  openModal = () => {
    this.setState({isModalOpen: true});
  }

  closeModal = (response) => {
    const toUpdate = {
      isModalOpen: false
    };

    if (typeof response === 'string') {
      const newItem = {url: response, id: (Date.now()).toString()},
      pictureList = [...this.state.pictureList, newItem];
      
      toUpdate.pictureList = pictureList;
      StorageService.set('pictureList', pictureList);
    }

    this.setState(toUpdate);
  }

  render() {
    const {state} = this;

    return (
      <View style={styles.container}>
        <PictureList list={state.pictureList} onClick={this.onPictureSelect} />
        <View style={styles.footer}>
          <Button
              onPress={this.openModal}
              title="Nova Foto"
              color="#f00"
          />
        </View>
        <CameraDialog isOpen={state.isModalOpen} onClose={this.closeModal} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  footer: {
    padding: 15,
    backgroundColor: '#000',
    width: '100%',
    textAlign: 'center'
  }
});

export default App;
