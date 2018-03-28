import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} from 'react-native';
const Turtle = ({
  onPress,
  show,
  blockSize,
}) => {
  return (
    <View>
      { blockSize.map( (col, rowKey) => {
        <View key={ rowKey } style={ styles.row }>
          { col.map( (id, colkey) => {
            return (
              <View key={ colkey } style={ styles.hole }>
                <TouchableHighlight  style={ styles.touch } onPress={ onPress(id) }>
                  <Text style={ styles.icon }>{ show[id] && '🐢' }</Text>
                </TouchableHighlight>
              </View>
            )
          })}
        </View>
      })}
    </View>
  )
}

export default Turtle

const styles = StyleSheet.create({
  row:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#00264d'
 },
  hole:{
    flex: 1,
    backgroundColor: '#e6f2ff',
    margin: 10,
     borderRadius: 10,
  },
  icon: {
      textAlign: 'center',
      fontSize: 50,
      paddingTop: '25%',
  },
  touch: {
      flex:1,
      borderRadius: 10,
      justifyContent: 'center',
  }
});
