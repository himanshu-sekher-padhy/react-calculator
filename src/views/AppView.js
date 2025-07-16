import '../assets/styles/AppView.css'
import React from 'react';
import '../assets/styles/App.css';
import Button from '../components/Button';

var Parser = require('expr-eval').Parser;

class AppView extends React.Component {

state = {
    fullText: '0',
    resultText: '',
    isResultClicked : false,
    isResultInvalid: false
}

digitClick = (digit) => {
    if(this.state.isResultClicked){
        this.setState({ fullText : digit.toString(), resultText : '', isResultClicked: false});
    }else{
        let { fullText } = this.state;
        if(fullText === "0."){} 
        else if(parseFloat(fullText) === 0){
            fullText = "";
        }
        fullText = fullText + digit.toString();
        this.setState({ fullText });
    }
}

operationClick = (operationSign) =>{
    let { fullText, resultText } = this.state;
    if(resultText.length > 0){
        this.setState({ 
            fullText : resultText+operationSign, 
            isResultClicked: false,
            resultText : ''
        });
    }else{
        fullText = fullText + operationSign;
        this.setState({ fullText });
    }
}

dotClick = () => {
    if(this.state.isResultClicked){
        this.setState({ fullText : "0.", resultText : '', isResultClicked: false});
    }else{
        let { fullText } = this.state;
        fullText = fullText + ".";
        this.setState({ fullText });
    }
}

functionalButtonClick = (key) => {
    let { fullText, resultText } = this.state;

    switch (key) {
        case "AC":
            this.setState({ fullText : "0", resultText : "" });
            break;

        case "C":
            this.setState({ resultText : "" });
            if(fullText.length > 0 ){
                let newFullText = fullText.slice(0, -1);
                if(newFullText === ""){
                    newFullText = "0";
                }
                this.setState({ fullText : newFullText });
            }
            break;

        case "CUT_FIRST":
            this.setState({ resultText : "" });
            if(fullText.length > 0 ){
                let newFullText = fullText.substring(1);
                if(newFullText === ""){
                    newFullText = "0";
                }
                this.setState({ fullText : newFullText });
            }
            break;
        
        case "MC":
            localStorage.setItem('CALC_M', "0");
            break;

        case "MR":
            let memValue = localStorage.getItem('CALC_M') || "0";
            let newFullText = memValue;
            this.setState({ fullText : newFullText, resultText: '' });
            break;

        case "M+":
            let getMemoryValue = parseFloat(localStorage.getItem('CALC_M') || "0");
            let totalResult = parseFloat(resultText.length > 0 ? resultText : "0") + getMemoryValue;
            localStorage.setItem('CALC_M', totalResult.toString());
            break;

        case "M-":
            let memValue2 = parseFloat(localStorage.getItem('CALC_M') || "0");
            let totalResult2 = parseFloat(resultText.length > 0 ? resultText : "0") - memValue2;
            localStorage.setItem('CALC_M', totalResult2.toString());
            break;

        case "1/x":
            try {
                let fullTextNew = "(1/("+fullText+"))";
                let finalResult = this.parseCalculate(fullTextNew);
                this.setState({ fullText: fullTextNew, resultText : finalResult.toString() });
            } catch (error) {
                this.setState({ fullText: "", resultText : "" });
            }
            break;

        case "x^2":
            try {
                let fullTextNew = "("+fullText+")^2";
                let finalResult = this.parseCalculate(fullTextNew);
                this.setState({ fullText: fullTextNew, resultText : finalResult.toString() });
            } catch (error) {
                this.setState({ fullText: "", resultText : "" });
            }
            break;

        case "+-":
            try {
                let fullTextNew = "-("+fullText+")";
                this.setState({ fullText: fullTextNew, resultText : "" });
            } catch (error) {
                this.setState({ fullText: "", resultText : "" });
            }
            break;

        case "SQ_ROOT":
            try {
                let finalResult = this.parseCalculate(fullText);
                finalResult = Math.sqrt(finalResult);
                let fullTextNew = "√("+fullText+")";
                this.setState({ fullText: fullTextNew, resultText : finalResult.toString(), isResultInvalid : false });
            } catch (error) {
                this.setState({ fullText: "", resultText : "invalid", isResultInvalid : true });
            }
            break;
    
        default:
            break;
    }
}

equalClick = () => {
    try {
        let finalResult = this.parseCalculate(this.state.fullText);
        this.setState({ resultText: finalResult.toString(), isResultClicked : true, isResultInvalid : false });
    } catch (error) {
        this.setState({ resultText: "invalid", isResultClicked : true, isResultInvalid : true });
    }
}

parseCalculate = (fullText) => {
    return Parser.evaluate(fullText);
}

checkKeyboardEvent = (event) => {
    if(/[0-9]/.test(event.key)) {
        this.digitClick(parseInt(event.key));
    }else if(["+", "-", "*", "/"].includes(event.key)) {
        this.operationClick(event.key);
    }else if(event.key === "=" || event.key === "Enter"){
        this.equalClick();
    }else if(event.key === "Backspace"){
        this.functionalButtonClick("C");
    }
}

componentDidMount(){
    document.addEventListener("keydown", this.checkKeyboardEvent, false);
    localStorage.setItem('CALC_M', localStorage.getItem('CALC_M') || "0");
}

componentWillUnmount(){
    document.removeEventListener("keydown", this.checkKeyboardEvent, false);
}

printResultTextCSS = () => {
    let css = "resultArea ";
    let { fullText, resultText } = this.state;
    let totalLength = fullText.length + resultText.length;
    if(totalLength <= 18) css += "resultArea-md";
    else if(totalLength <= 35) css += "resultArea-sm";
    else if(totalLength <= 55) css += "resultArea-xsm";
    else css += "resultArea-xxsm";
    return css;
}

render() {
    const { fullText, resultText, isResultInvalid } = this.state;
    return (
        <div className="App">
            <div className="row justify-content-center">
              <div className="col-md-5">
                {/* <div className="app-header">
                    <span className="app-title">React Calculator</span>
                    <span className="badge badge-warning">React <small>js</small></span>
                </div> */}

                <div className="calculatorArea">
                  <div className="row">
                    <div className="col-md-12 calculator-header-part">
                      <div className={this.printResultTextCSS()}>
                        { fullText }
                        { isResultInvalid && resultText.length > 0 &&
                            <span className="text-danger">{ ' = ' + resultText }</span>
                        }
                        { !isResultInvalid && resultText.length > 0 &&
                            <span className="text-success">{ ' = ' + resultText }</span>
                        }
                      </div>
                    </div>

                    <div className="col-md-12 calculator-body-part">
                      <div className="row justify-content-center r-1">
                          <Button buttonClass="btn btn-primary top-button btn-1" onClick={() => this.functionalButtonClick("C")} textValue="↺"/>
                          <Button buttonClass="btn btn-primary top-button" onClick={() => this.functionalButtonClick("CUT_FIRST")} textValue="Del"/>
                          <Button buttonClass="btn btn-primary top-button text-bold" onClick={() => this.functionalButtonClick("C")} textValue="C"/>
                          <Button buttonClass="btn btn-primary top-button text-bold btn-2" onClick={() => this.functionalButtonClick("AC")} textValue="AC"/>
                      </div>

                      <div className="row justify-content-center r-1">
                          <Button buttonClass="btn btn-success btn-mem text-bold btn-1" onClick={() => this.functionalButtonClick('MC')} textValue="MC"/>
                          <Button buttonClass="btn btn-success btn-mem text-bold" onClick={() => this.functionalButtonClick('M+')} textValue="M+"/>
                          <Button buttonClass="btn btn-success btn-mem text-bold" onClick={() => this.functionalButtonClick('M-')} textValue="M-"/>
                          <Button buttonClass="btn btn-success btn-mem text-bold btn-2" onClick={() => this.functionalButtonClick('MR')} textValue="MR"/>
                      </div>

                      <div className="row justify-content-center mt-2">
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(7)} textValue="7"/>
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(8)} textValue="8"/>
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(9)} textValue="9"/>
                          <Button buttonClass="btn btn-primary btn-operation text-bold" onClick={() => this.operationClick('/')} textValue="÷"/>
                          <Button buttonClass="btn btn-primary btn-operation text-bold" onClick={() => this.functionalButtonClick("SQ_ROOT")} textValue="√"/>
                      </div>

                      <div className="row justify-content-center mt-2">
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(4)} textValue="4"/>
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(5)} textValue="5"/>
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(6)} textValue="6"/>
                          <Button buttonClass="btn btn-primary btn-operation text-bold" onClick={() => this.operationClick('*')} textValue="×"/>
                          <Button buttonClass="btn btn-primary btn-operation text-bold" onClick={() => this.functionalButtonClick('x^2')} textValue="x²"/>
                      </div>

                      <div className="row justify-content-center mt-2">
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(1)} textValue="1"/>
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(2)} textValue="2"/>
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(3)} textValue="3"/>
                          <Button buttonClass="btn btn-primary btn-operation text-bold" onClick={() => this.operationClick('-')} textValue="-"/>
                          <Button buttonClass="btn btn-primary btn-operation text-bold" onClick={() => this.functionalButtonClick('1/x')} textValue="1⁄x"/>
                      </div>

                      <div className="row justify-content-center mt-2">
                          <Button buttonClass="btn btn-primary btn-digit text-bold" onClick={() => this.digitClick(0)} textValue="0"/>
                          <Button buttonClass="btn btn-primary btn-operation text-bold" onClick={this.dotClick} textValue="."/>
                          <Button buttonClass="btn btn-primary btn-operation text-bold" onClick={() => this.functionalButtonClick('+-')} textValue="±"/>
                          <Button buttonClass="btn btn-primary btn-operation text-bold" onClick={() => this.operationClick('+')} textValue="+"/>
                          <Button buttonClass="btn btn-primary btn-equal text-bold" onClick={this.equalClick} textValue="="/>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="copy-right text-right">
                    &copy; 2025, <a href="https://github.com/himanshu-sekher-padhy" target="_blank" rel="noopener noreferrer">Himanshu Sekher Padhy</a>
                </p>
            </div>
            </div>
        </div>
    );
  }
}

export default AppView;
