import React, {Component} from 'react'
import {Alert, AsyncStorage} from 'react-native'
import styled from 'styled-components/native'

import Board from './Board'
import Display from './Display'

// The key used to store the high score in AsyncStorage
const HIGH_SCORE_KEY = 'game:highScore'

// The default time limit defaults to ten ticks
const timeLimit = 10

// The rows in the game's grid
const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

// There are initially nine holes, all which defaults to false
const initialHoles = [...Array(9)].map(() => false)

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

const BottomBar = styled.View`
  padding-top: 20px;
  flex: 1;
  align-items: center;
`

const StartButton = styled.Button`
  margin: 20px;
  padding: 10px;
`

export default class Game extends Component {
  state = {
    highScore: 0,
    currentScore: 0,
    timeout: 0,
    isPlaying: false,
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
    const {holes, isPlaying} = this.state
    const randomNumber = Math.floor(Math.random() * 9)

    if (!holes[randomNumber]) {
      holes[randomNumber] = true

      setTimeout(() => {
        holes[randomNumber] = false
      }, 2000)

      this.setState({holes})
    }

    if (!isPlaying) {
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

    this.setState({isPlaying: false})

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

    return (
      <Container>
        <TopBar>
          <Display title="High Score" value={highScore} />
          <Display title="Timeout" value={timeout} />
          <Display title="Current Score" value={currentScore} />
        </TopBar>

        <Board rows={rows} holes={holes} handleTouch={this.handleTouch} />

        <BottomBar>
          <StartButton
            color="#3498db"
            title="Start Game"
            onPress={this.startGame}
            disabled={isPlaying}
          />
        </BottomBar>
      </Container>
    )
  }
}
