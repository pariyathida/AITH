import React from 'react';
import {
  StyleSheet,
  Button,
  View,
} from 'react-native';
const ButtonPlay = ({
  playing,
  onPress
}) => {
  return (
    <View style={ styles.buttomBar }>
      <Button 
        title="start game" 
        style={ styles.startButton } 
        onPress={ onPress }
        disabled={ playing }
      />
    </View>
  )
}

export default ButtonPlay

const styles = StyleSheet.create({
  buttomBar: {
    paddingTop: 20,
    flex: 1,
    alignItems: 'center',
  },
  startButton: {
    color: 'white',
    backgroundColor: 'darkblue',
    margin: 20,
    padding: 10,
  },
})