import React from 'react'
import styled from 'styled-components/native'

import Hole from './Hole'

const Container = styled.View`
  flex: 7;
  flex-direction: column;
  border-width: 1;
  width: 100%;
`

const Row = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: #00264d;
`

const Board = ({rows, ...props}) => (
  <Container>
    {rows.map((row, i) => (
      <Row key={i}>
        {row.map(col => <Hole key={col} hole={col} {...props} />)}
      </Row>
    ))}
  </Container>
)

export default Board
