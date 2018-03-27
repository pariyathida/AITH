import React, {Component} from 'react'
import {Alert, AsyncStorage} from 'react-native'
import styled from 'styled-components/native'
import createContext from 'create-react-context'

const STORAGE_KEY = '@Game:data'
const timeLimit = 10
const grids = [...Array(3)].map((_, i) => i)
const initialHoles = [...Array(9)].map(() => false)

const Turtle = ({onPress, show}) => (
  <Touch onPress={onPress}>{show && <Emoji>🐢</Emoji>}</Touch>
)

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #000d1a;
`

const TopBar = styled.View`
  marginTop: 15,
  flexDirection: 'row',
  flex: 1.5,
  alignItems: 'center',
`

const HighScore = styled.View`
  flex: 1;
  background-color: #000d1a;
  margin: 10;
`

const Timeout = styled.View`
  flex: 1,
  background-color: #000d1a;
  margin: 10;
`

const CurrentScore = styled.Text`
  flex: 1,
  background-color: #000d1a;
  margin: 10;
`

const Title = styled.Text`
  text-align: center;
  color: white;
`

const Value = styled.Text`
  text-align: center;
  font-size: 30;
  font-weight: bold;
  color: white;
`

const Row = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: #00264d;
`

const HoleContainer = styled.View`
  flex: 1,
  backgroundColor: '#e6f2ff',
  margin: 10,
  borderRadius: 10,
`

const HoleRows = styled.View`
  flex: 7;
  flex-direction: column;
  border-width: 1;
  width: 100%;
`

const BottomBar = styled.View`
  padding-top: 20;
  flex: 1;
  align-items: 'center';
`

const StartButton = styled.View`
  color: white;
  background-color: darkblue;
  margin: 20;
  padding: 10;
`

const Emoji = styled.Text`
  text-align: center;
  font-size: 50;
  padding-top: 25%;
`

const Touch = styled.View`
  flex: 1;
  border-radius: 10;
  justify-content: center;
`

const {Provider, Consumer} = createContext('turtle')

const Hole = ({hole}) => (
  <Consumer>
    {props => (
      <HoleContainer>
        <Turtle
          show={props.holes[hole]}
          onPress={() => props.handleTouch(hole)}
        />
      </HoleContainer>
    )}
  </Consumer>
)

const Display = ({title, value, is: Base}) => (
  <Base>
    <Title>{title}</Title>
    <Value>{title}</Value>
  </Base>
)

export default class Game extends Component {
  state = {
    highScore: 0,
    currentScore: 0,
    timeout: 0,
    playing: false,
    holes: initialHoles,
  }

  showTurtles = () => {
    const {holes, playing} = this.state
    const randomNumber = Math.floor(Math.random() * 9)

    if (!holes[randomNumber]) {
      holes[randomNumber] = true

      setTimeout(() => {
        holes[randomNumber] = false
      }, 2000)

      this.setState({holes})
    }

    if (!playing) {
      clearInterval(this.appearTimer)

      this.setState({holes: initialHoles})
    }
  }

  update = () => {
    const {timeout} = this.state

    this.setState({timeout: timeout - 1})

    if (timeout === 0) {
      this.endGame()
    }
  }

  startGame = () => {
    this.setState({
      timeout: timeLimit,
      isPlaying: true,
      currentScore: 0,
    })

    this.appearTimer = setInterval(this.showTurtles, 1000)

    this.gameTimer = setInterval(this.update, 1000)
  }

  handleTouch = holeNumber => {
    const {holes} = this.state

    if (holes[holeNumber]) {
      holes[holeNumber] = false

      this.setState({
        currentScore: this.state.currentScore + 1,
        holes,
      })
    }
  }

  endGame() {
    const {currentScore, highScore} = this.state

    clearInterval(this.timer)

    this.setState({playing: false})

    if (currentScore > highScore) {
      Alert.alert('YEAH! you got a new high score.')

      this.setState({highScore: '' + currentScore})
    }

    this.save()
  }

  save = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, this.state.highScore)

      console.log('Data has been saved!')
    } catch (err) {
      console.warn('The high score cannot be saved:', err.message)
    }
  }

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY)

      this.setState({
        highScore: value,
      })
    } catch (err) {
      console.warn('The previous high score cannot be retrieved:', err.message)
    }
  }

  render = () => {
    const {
      isPlaying,
      holes,
      handleTouch,
      currentScore,
      highScore,
      timeout,
    } = this.state

    return (
      <Provider values={{holes, handleTouch}}>
        <Container>
          <TopBar>
            <Display label="High Score" value={highScore} is={HighScore} />
            <Display label="Timeout" value={timeout} is={Timeout} />
            <Display
              label="Current Score"
              value={currentScore}
              is={CurrentScore}
            />
          </TopBar>
          <HoleRows>
            {grids.map(i => (
              <Row key={i}>{grids.map(j => <Hole key={j} hole={i + j} />)}</Row>
            ))}
          </HoleRows>
          <BottomBar>
            <StartButton
              title="Start Game"
              onPress={this.startGame}
              disabled={isPlaying}
            />
          </BottomBar>
        </Container>
      </Provider>
    )
  }
}
