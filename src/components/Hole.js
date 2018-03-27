import React from 'react'
import styled from 'styled-components/native'

const Emoji = styled.Text`
  text-align: center;
  font-size: 50px;
  padding-top: 25%;
`

const Touch = styled.View`
  flex: 1;
  border-radius: 10;
  justify-content: center;
`

const Turtle = ({onPress, show}) => (
  <Touch onPress={onPress}>{show && <Emoji>🐢</Emoji>}</Touch>
)

const HoleContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: #e6f2ff;
  margin: 10px;
  border-radius: 10px;
`

const Hole = ({hole, holes, handleTouch}) => (
  <HoleContainer onPress={() => handleTouch(hole)}>
    <Turtle show={holes[hole]} />
  </HoleContainer>
)

export default Hole
