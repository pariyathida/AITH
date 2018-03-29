/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    TouchableHighlight,
    AsyncStorage
} from "react-native";
const STORAGE_KEY = "@Game:data";
var timeLimit = 10;
var timer = null;
var Turtle = React.createClass({
    render() {
        return (
            <TouchableHighlight
                style={styles.touch}
                onPress={this.props.onPress}
            >
                <Text style={styles.icon}>{this.props.show ? "🐢" : ""}</Text>
            </TouchableHighlight>
        );
    }
});

export default class Game extends Component {
    constructor() {
        super();
        this.state = {
            highScore: 0,
            currentScore: 0,
            timeout: 0,
            playing: false,
            holes: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ]
        };
    }

    _startGame() {
        this.setState({
            timeout: timeLimit,
            playing: true,
            currentScore: 0
        });

        appear = setInterval(() => {
            var currentHoles = this.state.holes;
            var randomNumber = Math.floor(Math.random() * 9);
            if (currentHoles[randomNumber] == false) {
                currentHoles[randomNumber] = true;
                setTimeout(function() {
                    currentHoles[randomNumber] = false;
                }, 2000);
                // if(!Math.floor(Math.random()*3)){
                //     currentHoles = [false, false, false, false, false, false, false, false, false];
                // }
                this.setState({ holes: currentHoles });
            }

            if (!this.state.playing) {
                clearInterval(appear);
                this.setState({
                    holes: [
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false
                    ]
                });
            }
        }, 1000);

        timer = setInterval(() => {
            this.setState({
                timeout: this.state.timeout - 1
            });
            if (this.state.timeout == 0) {
                this._stopGame();
            }
        }, 1000);
    }

    _handleTouch(holeNumber) {
        currentHoles = this.state.holes;
        if (currentHoles[holeNumber] == true) {
            currentHoles[holeNumber] = false;
            this.setState({
                currentScore: this.state.currentScore + 1,
                holes: currentHoles
            });
        }
    }

    _stopGame() {
        clearInterval(timer);
        this.setState({
            playing: false
        });
        if (this.state.currentScore > this.state.highScore) {
            alert("YEAH! you got a new high score");
            this.setState({
                highScore: "" + this.state.currentScore
            });
        }
        this._save();
    }

    _save() {
        AsyncStorage.setItem(STORAGE_KEY, this.state.highScore)
            .then(() => console.log("data has been saved"))
            .catch(error => console.log("AsyncStorage: " + error.message))
            .done();
    }

    componentDidMount() {
        AsyncStorage.getItem(STORAGE_KEY)
            .then(value => {
                this.setState({
                    highScore: value
                });
            })
            .catch(error => console.log("AsyncStorage: " + error.message))
            .done();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <View style={styles.highScore}>
                        <Text style={styles.title}>High Score</Text>
                        <Text style={styles.number}>
                            {this.state.highScore}
                        </Text>
                    </View>
                    <View style={styles.timeout}>
                        <Text style={styles.title}>Timeout</Text>
                        <Text style={styles.number}>{this.state.timeout}</Text>
                    </View>
                    <View style={styles.currentScore}>
                        <Text style={styles.title}>Score</Text>
                        <Text style={styles.number}>
                            {this.state.currentScore}
                        </Text>
                    </View>
                </View>
                <View style={styles.holeRows}>
                    <View style={styles.row}>
                        <View style={styles.hole}>
                            <Turtle
                                show={this.state.holes[0]}
                                onPress={() => this._handleTouch(0)}
                            />
                        </View>
                        <View style={styles.hole}>
                            <Turtle
                                show={this.state.holes[1]}
                                onPress={() => this._handleTouch(1)}
                            />
                        </View>
                        <View style={styles.hole}>
                            <Turtle
                                show={this.state.holes[2]}
                                onPress={() => this._handleTouch(2)}
                            />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.hole}>
                            <Turtle
                                show={this.state.holes[3]}
                                onPress={() => this._handleTouch(3)}
                            />
                        </View>
                        <View style={styles.hole}>
                            <Turtle
                                show={this.state.holes[4]}
                                onPress={() => this._handleTouch(4)}
                            />
                        </View>
                        <View style={styles.hole}>
                            <Turtle
                                show={this.state.holes[5]}
                                onPress={() => this._handleTouch(5)}
                            />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.hole}>
                            <Turtle
                                show={this.state.holes[6]}
                                onPress={() => this._handleTouch(6)}
                            />
                        </View>
                        <View style={styles.hole}>
                            <Turtle
                                show={this.state.holes[7]}
                                onPress={() => this._handleTouch(7)}
                            />
                        </View>
                        <View style={styles.hole}>
                            <Turtle
                                show={this.state.holes[8]}
                                onPress={() => this._handleTouch(8)}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.buttomBar}>
                    <Button
                        title="start game"
                        style={styles.startButton}
                        onPress={this._startGame.bind(this)}
                        disabled={this.state.playing}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000d1a"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    },
    topBar: {
        marginTop: 15,
        flexDirection: "row",
        flex: 1.5,
        alignItems: "center"
    },
    highScore: {
        flex: 1,
        backgroundColor: "#000d1a",

        margin: 10
    },
    timeout: {
        flex: 1,
        backgroundColor: "#000d1a",

        margin: 10
    },
    currentScore: {
        flex: 1,
        backgroundColor: "#000d1a",

        margin: 10
    },
    title: {
        textAlign: "center",
        color: "white"
    },
    number: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    holeRows: {
        flex: 7,
        flexDirection: "column",
        borderWidth: 1,
        width: "100%"
    },
    row: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#00264d"
    },
    hole: {
        flex: 1,
        backgroundColor: "#e6f2ff",
        margin: 10,
        borderRadius: 10
    },
    buttomBar: {
        paddingTop: 20,
        flex: 1,
        alignItems: "center"
    },
    startButton: {
        color: "white",
        backgroundColor: "darkblue",
        margin: 20,
        padding: 10
    },
    icon: {
        textAlign: "center",
        fontSize: 50,
        paddingTop: "25%"
    },
    touch: {
        flex: 1,
        borderRadius: 10,
        justifyContent: "center"
    }
});
