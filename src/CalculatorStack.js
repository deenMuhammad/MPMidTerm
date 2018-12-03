import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View , Image,Button } from 'react-native'
import { createStackNavigator } from 'react-navigation';
import CustomButton from './CustomButton';

/**
 * KeyboardInput
 */
class KeyboardInput extends React.Component {
  handleKeyDown(event) {
    if (this.props.onKeyDown)
      this.props.onKeyDown(event)
  }
  
  componentDidMount() {
    // Ah, auto-binding. I hardly knew ye.
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }
  
  componentWillUnmount() {
  }
  
  render() {
    return null
  }
}

let counter = 0
/**
 * CalculatorDisplay
 */
class CalculatorDisplay extends React.Component {
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      scale: 1
    }
  }
  
  handleTextLayout = (e) => {
    const { scale } = this.state
    const { width, x } = e.nativeEvent.layout
    const maxWidth = width + x
    const actualWidth = width / scale
    const newScale = maxWidth / actualWidth
    if (x < 0) {
      this.setState({ scale: newScale  })
    } else if (x > width) {
      this.setState({ scale: 1 })
    }
  };

  render() {
    const { value } = this.props
    const { scale } = this.state
    
    const language = navigator.language || 'en-US'
    let formattedValue = parseFloat(value).toLocaleString(language, {
      useGrouping: true,
      maximumFractionDigits: 6
    })
    
    const trailingZeros = value.match(/\.0*$/)
    
    if (trailingZeros)
      formattedValue += trailingZeros
    
    return (
      <View style={calculatorDisplayStyles.root}>
        <Text
          children={formattedValue}
          onLayout={this.handleTextLayout}
          style={[
            calculatorDisplayStyles.text,
            { transform: [ { scale }  ] }
          ]}
        />
      </View>
    )
  }
}

const calculatorDisplayStyles = StyleSheet.create({
  root: {
    backgroundColor: '#1c191c',
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    alignSelf: 'flex-end',
    color: 'white',
    //lineHeight: 130,
    fontSize: 50,
    paddingHorizontal: 30,
    //position: 'absolute',
    right: 0,
  }
})

/**
 * CalculatorKey
 */
class CalculatorKey extends React.Component {
  render() {
    const { children, onPress, style, textStyle } = this.props
    
    return (
      <TouchableHighlight
        accessibilityRole="button"
        onPress={onPress}
        style={[
          calculatorKeyStyles.root,
          style
        ]}
        underlayColor='rgba(0,0,0,0.25)'
      >
        <Text
          children={children}
          style={[
            calculatorKeyStyles.text,
            textStyle
          ]}
        />
      </TouchableHighlight>
    )
  }
}

const calculatorKeyStyles = StyleSheet.create({
  root: {
    borderRadius: 5,
    width: 93.7,
    height: 85,
    borderTopWidth: 1,
    borderTopColor: '#777',
    borderRightWidth: 1,
    borderRightColor: '#666',
  },
  text: {
    lineHeight: 80,
    textAlign: 'center'
  }
})

const CalculatorOperations = {
  '/': (prevValue, nextValue) => prevValue / nextValue,
  '*': (prevValue, nextValue) => prevValue * nextValue,
  '+': (prevValue, nextValue) => prevValue + nextValue,
  '-': (prevValue, nextValue) => prevValue - nextValue,
  '=': (prevValue, nextValue) => nextValue
}

/**
 * Calculator
 */
class Calculator extends React.Component {
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false
    }
  }
  
  clearAll() {
    this.setState({
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false
    })
  }

  clearDisplay() {
    this.setState({
      displayValue: '0'
    })
  }
  
  clearLastChar() {
    const { displayValue } = this.state
    
    this.setState({
      displayValue: displayValue.substring(0, displayValue.length - 1) || '0'
    })
  }
  
  toggleSign() {
    const { displayValue } = this.state
    const newValue = parseFloat(displayValue) * -1
    
    this.setState({
      displayValue: String(newValue)
    })
  }
  
  inputPercent() {
    const { displayValue } = this.state
    const currentValue = parseFloat(displayValue)
    
    if (currentValue === 0)
      return
    
    const fixedDigits = displayValue.replace(/^-?\d*\.?/, '')
    const newValue = parseFloat(displayValue) / 100
    
    this.setState({
      displayValue: String(newValue.toFixed(fixedDigits.length + 2))
    })
  }
  
  inputDot() {
    const { displayValue } = this.state
    
    if (!(/\./).test(displayValue)) {
      this.setState({
        displayValue: displayValue + '.',
        waitingForOperand: false
      })
    }
  }
  
  inputDigit(digit) {
    const { displayValue, waitingForOperand } = this.state
    
    if (waitingForOperand) {
      this.setState({
        displayValue: String(digit),
        waitingForOperand: false
      })
    } else {
      this.setState({
        displayValue: displayValue === '0' ? String(digit) : displayValue + digit
      })
    }
  }
  
  performOperation(nextOperator) {    
    const { value, displayValue, operator } = this.state
    const inputValue = parseFloat(displayValue)
    
    if (value == null) {
      this.setState({
        value: inputValue
      })
    } else if (operator) {
      const currentValue = value || 0
      const newValue = CalculatorOperations[operator](currentValue, inputValue)
      
      this.setState({
        value: newValue,
        displayValue: String(newValue)
      })
    }
    
    this.setState({
      waitingForOperand: true,
      operator: nextOperator
    })
  }
  
  handleKeyDown(event) {
    let { key } = event
    
    if (key === 'Enter')
      key = '='
    
    if ((/\d/).test(key)) {
      event.preventDefault()
      this.inputDigit(parseInt(key, 10))
    } else if (key in CalculatorOperations) {
      event.preventDefault()
      this.performOperation(key)
    } else if (key === '.') {
      event.preventDefault()
      this.inputDot()
    } else if (key === '%') {
      event.preventDefault()
      this.inputPercent()
    } else if (key === 'Backspace') {
      event.preventDefault()
      this.clearLastChar()
    } else if (key === 'Clear') {
      event.preventDefault()
      
      if (this.state.displayValue !== '0') {
        this.clearDisplay()
      } else {
        this.clearAll()
      }
    }
  }
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerLeft: (
        <CustomButton _borderRadius = {50} title = '+' _backgroundColor = '#ff9922' wiDth={20} _onPress={() => navigation.navigate('ModalScreen')}
        />
      ),
      headerTitle: (<View style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}><Image source = {require('./../img/calculator.png')} style={{ width: 33, height: 33 }} /><Text style={{fontFamily: "Arial"}}>Calculator World</Text></View>)
      /* the rest of this config is unchanged */
    };
  };
  render() {
    const {navigate} =this.props.navigation;
    const { displayValue } = this.state
    
    const clearDisplay = displayValue !== '0'
    const clearText = clearDisplay ? 'C' : 'AC'
    
    return (
      <View style={calculatorStyles.root}>
        <KeyboardInput onKeyDown={event => this.handleKeyDown(event)}/>
        <CalculatorDisplay value={displayValue}/>
        <View style={calculatorStyles.keypad}>
          <View style={calculatorStyles.inputKeys}>
            <View style={calculatorStyles.functionKeys}>
              <FunctionKey onPress={() => clearDisplay ? this.clearDisplay() : this.clearAll()}>{clearText}</FunctionKey>
              <FunctionKey onPress={() => this.toggleSign()} style={calculatorStyles.keySign}>±</FunctionKey>
              <FunctionKey onPress={() => this.inputPercent()} style={calculatorStyles.keyPercent}>%</FunctionKey>
            </View>
            <View style={calculatorStyles.digitKeys}>
              <DigitKey onPress={() => this.inputDigit(0)} style={calculatorStyles.key0} textStyle={{ textAlign: 'left' }}>0</DigitKey>
              <DigitKey onPress={() => this.inputDot()} style={calculatorStyles.keyDot} textStyle={calculatorStyles.keyDotText}>.</DigitKey>
              <DigitKey onPress={() => this.inputDigit(1)}>1</DigitKey>
              <DigitKey onPress={() => this.inputDigit(2)}>2</DigitKey>
              <DigitKey onPress={() => this.inputDigit(3)}>3</DigitKey>
              <DigitKey onPress={() => this.inputDigit(4)}>4</DigitKey>
              <DigitKey onPress={() => this.inputDigit(5)}>5</DigitKey>
              <DigitKey onPress={() => this.inputDigit(6)}>6</DigitKey>
              <DigitKey onPress={() => this.inputDigit(7)}>7</DigitKey>
              <DigitKey onPress={() => this.inputDigit(8)}>8</DigitKey>
              <DigitKey onPress={() => this.inputDigit(9)}>9</DigitKey>
            </View>
          </View>
          <View style={calculatorStyles.operatorKeys}>
            <OperatorKey onPress={() => this.performOperation('/')}>/</OperatorKey>
            <OperatorKey onPress={() => this.performOperation('*')}>×</OperatorKey>
            <OperatorKey onPress={() => this.performOperation('-')}>−</OperatorKey>
            <OperatorKey onPress={() => this.performOperation('+')}>+</OperatorKey>
            <OperatorKey onPress={() => this.performOperation('=')}>=</OperatorKey>
          </View>
        </View>
      </View>
    )
  }
}

class PrimeCalculator extends React.Component {
    constructor(props, context) {
      super(props, context)
      
      this.state = {
        value: null,
        displayValue: '0',
        operator: null,
        waitingForOperand: false
      }
    }
    
    clearAll() {
      this.setState({
        value: null,
        displayValue: '0',
        operator: null,
        waitingForOperand: false
      })
    }
  
    clearDisplay() {
      this.setState({
        displayValue: '0'
      })
    }
    
    clearLastChar() {
      const { displayValue } = this.state
      
      this.setState({
        displayValue: displayValue.substring(0, displayValue.length - 1) || '0'
      })
    }
    
    toggleSign() {
      const { displayValue } = this.state
      const newValue = parseFloat(displayValue) * -1
      
      this.setState({
        displayValue: String(newValue)
      })
    }
    
    isPrime() {
      const { displayValue } = this.state
      const currentValue = parseFloat(displayValue)
      
      if(this.reallyPrime(currentValue)){
          //if the number is prime
          this.setState({
            displayValue: '0'
          });
          alert(currentValue + ' is Prime Number')
      }
      else{
        this.setState({
            displayValue: "0"
          })
          //if the number is not prime
          alert(currentValue + ' is not Prime Number')
      } 
    }
    
    reallyPrime(n){
    //"""Returns True if n is prime."""
    if (n == 2)
        return true
    if (n == 3)
        return true
    if (n % 2 == 0)
        return false
    if (n % 3 == 0)
        return false

    i = 5
    w = 2

    while(i * i <= n){
        if (n % i == 0)
            return false

        i += w
        w = 6 - w
    }
    return true
    }
    inputDot() {
      const { displayValue } = this.state
      
      if (!(/\./).test(displayValue)) {
        this.setState({
          displayValue: displayValue + '.',
          waitingForOperand: false
        })
      }
    }
    
    inputDigit(digit) {
      const { displayValue, waitingForOperand } = this.state
      
      if (waitingForOperand) {
        this.setState({
          displayValue: String(digit),
          waitingForOperand: false
        })
      } else {
        this.setState({
          displayValue: displayValue === '0' ? String(digit) : displayValue + digit
        })
      }
    }
    
    performOperation(nextOperator) {    
      const { value, displayValue, operator } = this.state
      const inputValue = parseFloat(displayValue)
      
      if (value == null) {
        this.setState({
          value: inputValue
        })
      } else if (operator) {
        const currentValue = value || 0
        const newValue = CalculatorOperations[operator](currentValue, inputValue)
        
        this.setState({
          value: newValue,
          displayValue: String(newValue)
        })
      }
      
      this.setState({
        waitingForOperand: true,
        operator: nextOperator
      })
    }
    
    handleKeyDown(event) {
      let { key } = event
      
      if (key === 'Enter')
        key = '='
      
      if ((/\d/).test(key)) {
        event.preventDefault()
        this.inputDigit(parseInt(key, 10))
      } else if (key in CalculatorOperations) {
        event.preventDefault()
        this.performOperation(key)
      } else if (key === '.') {
        event.preventDefault()
        this.inputDot()
      } else if (key === '%') {
        event.preventDefault()
        this.inputPercent()
      } else if (key === 'Backspace') {
        event.preventDefault()
        this.clearLastChar()
      } else if (key === 'Clear') {
        event.preventDefault()
        
        if (this.state.displayValue !== '0') {
          this.clearDisplay()
        } else {
          this.clearAll()
        }
      }
    }
    root(){
        const { displayValue } = this.state;
        const inputValue = parseFloat(displayValue);
        var result = Math.sqrt(inputValue)
        this.setState({
            displayValue: String(result),
        });
      }
      squared(){
        const { displayValue } = this.state;
        const inputValue = parseFloat(displayValue);
        var result = Math.pow(inputValue, 2);
        this.setState({
            displayValue: String(result),
        });
      }
      sined(){
        const { displayValue } = this.state;
        const inputValue = parseFloat(displayValue);
        var result = Math.sin(inputValue);
        this.setState({
            displayValue: String(result),
        });
      }
      cosined(){
        const { displayValue } = this.state;
        const inputValue = parseFloat(displayValue);
        var result = Math.cos(inputValue);
        this.setState({
            displayValue: String(result),
        });
      }
    render() {
      const { displayValue } = this.state
      
      const clearDisplay = displayValue !== '0'
      const clearText = clearDisplay ? 'C' : 'AC'
      
      return (
        <View style={PrimecalculatorStyles.root}>
          <KeyboardInput onKeyDown={event => this.handleKeyDown(event)}/>
          <CalculatorDisplay value={displayValue}/>
          <View style={PrimecalculatorStyles.keypad}>
            <View style={PrimecalculatorStyles.inputKeys}>
              <View style={PrimecalculatorStyles.functionKeys}>
                <FunctionKey onPress={() => clearDisplay ? this.clearDisplay() : this.clearAll()}>{clearText}</FunctionKey>
                <FunctionKey onPress={() => this.toggleSign()} style={PrimecalculatorStyles.keySign}>±</FunctionKey>
                <FunctionKey onPress={() => this.isPrime()} style={PrimecalculatorStyles.keyPercent}>Prime?</FunctionKey>
              </View>
              <View style={PrimecalculatorStyles.digitKeys}>
                <DigitKey onPress={() => this.inputDigit(0)} style={PrimecalculatorStyles.key0} textStyle={{ textAlign: 'left' }}>0</DigitKey>
                <DigitKey onPress={() => this.inputDot()} style={PrimecalculatorStyles.keyDot} textStyle={PrimecalculatorStyles.keyDotText}>.</DigitKey>
                <DigitKey onPress={() => this.inputDigit(1)}>1</DigitKey>
                <DigitKey onPress={() => this.inputDigit(2)}>2</DigitKey>
                <DigitKey onPress={() => this.inputDigit(3)}>3</DigitKey>
                <DigitKey onPress={() => this.inputDigit(4)}>4</DigitKey>
                <DigitKey onPress={() => this.inputDigit(5)}>5</DigitKey>
                <DigitKey onPress={() => this.inputDigit(6)}>6</DigitKey>
                <DigitKey onPress={() => this.inputDigit(7)}>7</DigitKey>
                <DigitKey onPress={() => this.inputDigit(8)}>8</DigitKey>
                <DigitKey onPress={() => this.inputDigit(9)}>9</DigitKey>
              </View>
            </View>
            <View style={PrimecalculatorStyles.operatorKeys}>
              <OperatorKey onPress={() => this.root()}>√</OperatorKey>
              <OperatorKey onPress={() => this.squared()}>x^2</OperatorKey>
              <OperatorKey onPress={() => this.sined()}>sin</OperatorKey>
              <OperatorKey onPress={() => this.cosined()}>cos</OperatorKey>
              <OperatorKey onPress={() => this.performOperation('=')}>=</OperatorKey>
            </View>
          </View>
        </View>
      )
    }
  }

const DigitKey = (props) => (
  <CalculatorKey
    {...props}
    style={[PrimecalculatorStyles.digitKey, props.style]}
    textStyle={[PrimecalculatorStyles.digitKeyText, props.textStyle]}
  />
)

const FunctionKey = (props) => (
  <CalculatorKey
    {...props}
    style={[PrimecalculatorStyles.functionKey, props.style]}
    textStyle={[PrimecalculatorStyles.functionKeyText, props.textStyle]}
  />
)

const OperatorKey = (props) => (
  <CalculatorKey
    {...props}
    style={[PrimecalculatorStyles.operatorKey, props.style]}
    textStyle={[PrimecalculatorStyles.operatorKeyText, props.textStyle]}
  />
)

const calculatorStyles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  keypad: {
    height: '76%',
    flexDirection: 'row'
  },
  inputKeys: {
    width: '75%'
  },
  calculatorKeyText: {
    fontSize: 2
  },
  functionKeys: {
    flexDirection: 'row'
  },
  functionKey: {
    backgroundColor: '#f0f0f7',
    fontSize: 20
  },
  digitKeys: {
    backgroundColor: '#e0e0e7',
    flexDirection: 'row',
    flexWrap: 'wrap-reverse'
  },
  digitKeyText: {
    fontSize: 20                                
  },
  operatorKeys: {
      backgroundColor: '#ffb24f',
  },
  operatorKey: {
    borderRightWidth: 0
  },
  operatorKeyText: {
    color: 'white',
    fontSize: 21
  },
  keyMultiplyText: {
    lineHeight: 50
  },
  key0: {
    paddingLeft: 32,
    width: 177
  },
  keyDot: {
    width: 104,
    overflow: 'hidden'
  },
  keyDotText: {
    fontSize: 20,
    marginTop: -10
  }
})

const PrimecalculatorStyles = StyleSheet.create({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
    },
    keypad: {
      height: '76%',
      flexDirection: 'row'
    },
    inputKeys: {
      width: '75%'
    },
    calculatorKeyText: {
      fontSize: 2
    },
    functionKeys: {
      flexDirection: 'row'
    },
    functionKey: {
      backgroundColor: '#f0f0ff',
      fontSize: 20
    },
    digitKeys: {
      backgroundColor: '#e0e0e7',
      flexDirection: 'row',
      flexWrap: 'wrap-reverse'
    },
    digitKeyText: {
      fontSize: 20                                
    },
    operatorKeys: {
        backgroundColor: '#ffb24f',
    },
    operatorKey: {
      borderRightWidth: 0
    },
    operatorKeyText: {
      color: 'white',
      fontSize: 21
    },
    keyMultiplyText: {
      lineHeight: 50
    },
    key0: {
      paddingLeft: 32,
      width: 177
    },
    keyDot: {
      width: 104,
      overflow: 'hidden'
    },
    keyDotText: {
      fontSize: 20,
      marginTop: -10
    }
  })

var styles = StyleSheet.create({
    containerModal: {backgroundColor: "rgba(74, 214, 193, 0.1)", flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'flex-start', marginTop: 20, opacity: 1}
});
class Prime extends React.Component{
    render(){
      return(
        <View transparent = {true}  opacity={.3} style = {styles.containerModal}>
        <TouchableHighlight onPress = {()=>{this.props.navigation.goBack()}}>
        <View backgroundColor = "rgba(74, 214, 193, 0.1)" width = {400} alignItems = 'center' opacity = {.5} >
        <Image
        source = {require('./../img/drag_down.png')}
        style = {{width: 20, height: 20, top: 0}}
        />
        </View></TouchableHighlight>
          <PrimeCalculator />
        </View>
      );
    }
  }

  const CalculatorStack = createStackNavigator(
    {
        MainScreen: {
           screen: Calculator,
           navigationOptions: {
           } 
        }
    },
    {
        navigationOptions: {
            headerStyle: { 
                backgroundColor: '#6060FF'
            }
        },
        initialRouteName: 'MainScreen'
    }
);

export default RootStack = createStackNavigator(
    {
      Main: CalculatorStack,
      ModalScreen: Prime
    },
    {
      mode: 'modal',
      headerMode: 'none',
    }
  )
