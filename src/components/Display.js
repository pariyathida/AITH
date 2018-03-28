import React from 'react'
import styled from 'styled-components/native'

const Title = styled.Text`
  color: white;
  text-align: center;
`

const Value = styled.Text`
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  color: white;
`

const DisplayContainer = styled.View`
  flex: 1;
  background-color: #000d1a;
  margin: 10px;
`

const Display = ({title, value}) => (
  <DisplayContainer>
    <Title>{title}</Title>
    <Value>{value}</Value>
  </DisplayContainer>
)

export default Display
