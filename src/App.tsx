import React, { Component, MouseEvent, ChangeEvent } from 'react';
import * as CSS from 'csstype';
import { loadavg } from 'os';



interface Props {
  width:  number | null | string;
  height: number | null | string ;
  value:  number;
  max:    number;
  min:    number | null;
  text:   (argArray : any[]) => string;
}

interface Statement {
  interval :    NodeJS.Timeout;
  isTimerOn :   boolean;
  width:        number | string;
  value :       number;
  height:       number | string;
  max:          number;
  min:          number;
}

class ProgressBar extends Component<Props,object> {

  static defaultProps={
    width:  'inherit',
    height: 'inherit',
    min : 0,
    text : ([])=> ''
  };
  constructor(props : any) {
    super(props);
  }

  render() {
    const pBstyle={
      width:  this.props.width?.toString(),
      height: this.props.height?.toString(),
      backgroundColor: '#ddd'
    };
    
    const pVstyle :  CSS.Properties =  {
      width:  this.props.value/this.props.max * 100+'%',
      height: this.props.height?.toString(),
      backgroundColor : 'green',
      textAlign : 'center'
    };
    return (
      
        <div style={pBstyle} >
          <div style={pVstyle}>{this.props.text?.call(new Object(),[this.props.value])}</div>
        </div>
     
    );
  }
}

export class ProgressApp extends Component<Props, Statement> {

  static defaultProps={
    width:  'inherit',
    height: 'inherit',
    min : 0,
    text : ([]) => ''
  };

  constructor(props : any) {
    super(props);
    this.state={ interval : setInterval(() => this.tick(), 500),
       value: (this.props.value<(this.props.min||0))?
          (this.props.min||0):
          ((this.props.value>this.props.max)?this.props.max:this.props.value),
       isTimerOn : true,
       width : this.props.width || 'inherit',
       height : this.props.height || 'inherit',
       max: this.props.max,
       min: this.props.min||0
    };
    this.stopTimer=this.stopTimer.bind(this);
    this.startTimer=this.startTimer.bind(this);
    this.tick=this.tick.bind(this);
    this.resetTimer=this.resetTimer.bind(this);
    this.propChange=this.propChange.bind(this);
  }

  tick() {
    if(this.state.value<this.props.max){
      this.setState({value: this.state.value+1});
    }
    else{
      this.setState({isTimerOn: false});
      clearInterval(this.state.interval);
    }
  }

  stopTimer() {
    this.setState({isTimerOn: false});
    clearInterval(this.state.interval);
    
  }

  startTimer(){
    this.setState({interval: setInterval(() => this.tick(), 500), isTimerOn : true});
  }

  resetTimer(){
    if(!this.state.isTimerOn){
      this.setState({interval: setInterval(() => this.tick(), 500),isTimerOn : true});
    }
    this.setState({value: this.props.min || 0});
  }

  propChange(event : ChangeEvent<HTMLInputElement>){
    let tmp = event.target.value?.match(event.target.pattern);

      switch(event.target.name){
        case 'width':
          if((tmp?.length||0)!=0)
            this.setState({width: tmp?.shift()||this.state.width});
          break;

        case 'height':
          if((tmp?.length||0)!=0)
            this.setState({height: tmp?.shift()||this.state.height});
          break;

        case 'max':
          let val=parseInt(event.target.value);
          if(val<this.state.min){
            val=this.state.min;
          }
          this.setState({max : val, value : (this.state.value>val)?val:this.state.value});
          break;
        case 'min':
          let mn=parseInt(event.target.value);
          if(mn>this.state.max){
            mn=this.state.max;
          }
          this.setState({min : mn, value : (this.state.value<mn)?mn:this.state.value});
          break;
        case 'value':
          let v=parseInt(event.target.value);
          if(v<this.state.min)
            v=this.state.min;
          if(v>this.state.max)
            v=this.state.max;
          this.setState({value:v});
          break;
      }
    
  }

  render(){
    const divStyle :  CSS.Properties =  {
      paddingLeft : '1em',
      paddingTop : '1em',
      paddingRight : '1em'
    };

    let start = (!this.state.isTimerOn) ?
      <button className='ctrlBtn' onClick={this.startTimer}>Start</button> :
      null
    let stop = (this.state.isTimerOn) ?
      <button className='ctrlBtn' onClick={this.stopTimer}>Stop</button> :
      null
    let reset = <button className='ctrlBtn' onClick={this.resetTimer}>Reset</button>
      

    return (

      <div style={divStyle}>
        <form>
          <label htmlFor='width'>
            Width
          </label>
          <br/>
          <input name='width' onChange={this.propChange}
              pattern='([1-9]{1}[0-9]{0,3}(px|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%))|inherit|auto|initial' 
              placeholder='Přijimat jen ty hodnoty, které by fungovali v CSS (např. 156px, inherit atd.)'
          ></input>
          <br/>
          <label htmlFor='height'>
            Height
          </label>
          <br/>
          <input name='height' onChange={this.propChange}
              pattern='([1-9]{1}[0-9]{0,3}.?[0-9]{0,2}(px|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%))|inherit|auto|initial' 
              placeholder='Přijimat jen ty hodnoty, které by fungovali v CSS (např. 156px, inherit atd.)'
          ></input>
          <br/>
          <label htmlFor='max'>
            Max
          </label>
          <br/>
          <input name='max' onChange={this.propChange}
              onFocus={this.stopTimer}
              onBlur={this.startTimer}
              value={this.state.max}
              type='number'
          />
          <br/>
          <label htmlFor='min'>
            Min
          </label>
          <br/>
          <input name='min' onChange={this.propChange}
              onFocus={this.stopTimer}
              onBlur={this.startTimer}
              value={this.state.min}
              type='number'
          ></input>
          <br/>
          <label htmlFor='value'>
            Value
          </label>
          <br/>
          <input name='value' onChange={this.propChange}
              onFocus={this.stopTimer}
              onBlur={this.startTimer}
              value={this.state.value}
              type='number'
          ></input>
          <br/>
        </form>
        <ProgressBar  max={this.state.max}
        min={this.state.min}
        value={this.state.value}
        width={this.state.width}
        height={this.state.height}
        text={this.props.text}
        />
        <br/>
        {start}
        {stop}
        {reset}
      </div>
    );
  }

}


export default ProgressApp;