import React, {Component} from 'react'
import {Alert, AsyncStorage} from 'react-native'
import styled from 'styled-components/native'
import createContext from 'create-react-context'

// The key used to store the high score in AsyncStorage
const HIGH_SCORE_KEY = 'game:highScore'

// The default time limit defaults to ten ticks
const timeLimit = 10

// The rows in the game's grid
const gridRows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

// There are initially nine holes, all which defaults to false
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
  margin-top: 15px;
  flex-direction: row;
  flex: 1.5;
  align-items: center;
`

const DisplayContainer = styled.View`
  flex: 1;
  background-color: #000d1a;
  margin: 10px;
`

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

const Row = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: #00264d;
`

const HoleContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: #e6f2ff;
  margin: 10px;
  border-radius: 10px;
`

const HoleRows = styled.View`
  flex: 7;
  flex-direction: column;
  border-width: 1;
  width: 100%;
`

const BottomBar = styled.View`
  padding-top: 20px;
  flex: 1;
  align-items: center;
`

const StartButton = styled.Button`
  margin: 20px;
  padding: 10px;
`

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

const {Provider, Consumer} = createContext('turtle')

const Hole = ({hole}) => (
  <Consumer>
    {props => (
      <HoleContainer onPress={() => props.handleTouch(hole)}>
        <Turtle show={props.holes[hole]} />
      </HoleContainer>
    )}
  </Consumer>
)

const Display = ({title, value}) => (
  <DisplayContainer>
    <Title>{title}</Title>
    <Value>{value}</Value>
  </DisplayContainer>
)

export default class Game extends Component {
  state = {
    highScore: 0,
    currentScore: 0,
    timeout: 0,
    playing: false,
    holes: initialHoles,
  }

  async componentDidMount() {
    try {
      const highScore = await AsyncStorage.getItem(HIGH_SCORE_KEY)

      if (highScore) {
        console.log('Retrieved Previous High Score:', highScore)

        this.setState({highScore: parseInt(highScore)})
      }
    } catch (err) {
      console.warn('The previous high score cannot be retrieved:', err.message)
    }
  }

  startGame = () => {
    this.setState({
      timeout: timeLimit,
      isPlaying: true,
      currentScore: 0,
    })

    // Initiate the Game Timer and Appear Timer
    this.timer = setInterval(this.update, 1000)
    this.appearTimer = setInterval(this.showTurtles, 1000)
  }

  handleTouch = number => {
    const {holes} = this.state

    if (holes[number]) {
      holes[number] = false

      console.log('Hole', number, 'has been touched.')

      this.setState({
        currentScore: this.state.currentScore + 1,
        holes,
      })
    }
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

  update = async () => {
    const {timeout} = this.state

    if (timeout === 0) {
      await this.endGame()
    } else {
      this.setState({timeout: timeout - 1})
    }
  }

  endGame = async () => {
    const {currentScore, highScore} = this.state
    clearInterval(this.timer)

    this.setState({playing: false})

    if (currentScore > highScore) {
      Alert.alert('YEAH! you got a new high score.')

      this.setState({highScore: currentScore})
    }

    await this.save()
  }

  save = async () => {
    const {highScore} = this.state

    try {
      if (highScore) {
        // AsyncStorage requires all inputs to be a string on iOS
        await AsyncStorage.setItem(HIGH_SCORE_KEY, highScore.toString())
      }

      console.log('Your high score of', highScore, 'has been saved!')
    } catch (err) {
      console.warn('The high score cannot be saved:', err.message)
    }
  }

  render = () => {
    const {isPlaying, holes, currentScore, highScore, timeout} = this.state
    const context = {holes, handleTouch: this.handleTouch}

    return (
      <Provider value={context}>
        <Container>
          <TopBar>
            <Display title="High Score" value={highScore} />
            <Display title="Timeout" value={timeout} />
            <Display title="Current Score" value={currentScore} />
          </TopBar>
          <HoleRows>
            {gridRows.map((row, i) => (
              <Row key={i}>{row.map(col => <Hole key={col} hole={col} />)}</Row>
            ))}
          </HoleRows>
          <BottomBar>
            <StartButton
              color="#3498db"
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
