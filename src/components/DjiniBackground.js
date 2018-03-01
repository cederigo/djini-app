/* global setInterval, clearInterval */
import React, { Component } from 'react'
import { StyleSheet, Image, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const colors = [[101, 103, 255], [84, 172, 255], [145, 116, 247], [144, 74, 206]]
const gradientSpeed = 0.002

const WIDTH = Dimensions.get('window').width
const width = WIDTH + 230

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    position: 'absolute',
    width: width,
    height: width / 1.629
  }
})

// State ;-(
let step = 0
// color table indices for:
// current color left
// next color left
// current color right
// next color right
let colorIndices = [0, 1, 2, 3]

function getColor(step, currentColors) {
  var istep = 1 - step
  var r = Math.round(istep * currentColors[0][0] + step * currentColors[1][0])
  var g = Math.round(istep * currentColors[0][1] + step * currentColors[1][1])
  var b = Math.round(istep * currentColors[0][2] + step * currentColors[1][2])
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

function update() {
  step += gradientSpeed
  if (step >= 1) {
    step %= 1
    colorIndices[0] = colorIndices[1]
    colorIndices[2] = colorIndices[3]

    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] =
      (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length
    colorIndices[3] =
      (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length
  }
}

export default class DjiniBackground extends Component {
  constructor(props) {
    super(props)
    this.timer = undefined
    this.state = {
      colorTop: getColor(step, [colors[colorIndices[0]], colors[colorIndices[1]]]),
      colorBottom: getColor(step, [colors[colorIndices[2]], colors[colorIndices[3]]])
    }
  }

  componentDidMount() {
    if (!this.props.animated) {
      console.log('Skip bg animation')
      return
    }
    this.timer = setInterval(() => {
      const colorTop = getColor(step, [colors[colorIndices[0]], colors[colorIndices[1]]])
      const colorBottom = getColor(step, [colors[colorIndices[2]], colors[colorIndices[3]]])
      update()
      this.setState({ colorTop, colorBottom })
    }, 20)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  render() {
    const { offsetLeft, offsetBottom } = this.props
    return (
      <LinearGradient
        style={[this.props.style, styles.container]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[this.state.colorTop, this.state.colorBottom]}
      >
        <Image
          style={[styles.image, { left: offsetLeft, bottom: offsetBottom }]}
          resizeMode="stretch"
          source={require('../../img/clouds.png')}
        />
        {this.props.children}
      </LinearGradient>
    )
  }
}

DjiniBackground.defaultProps = {
  animated: true,
  offsetLeft: -110,
  offsetBottom: -50
}
