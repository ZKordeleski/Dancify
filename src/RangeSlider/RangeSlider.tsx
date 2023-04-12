import React, { useState } from 'react';
import './RangeSlider.css'

interface RangeSliderProps {
  min: number,
  max: number,
  step: number,
  setBounds: (min: number, max: number, key: string) => void,
  name: string,
  color: string
}

//TODO: Could RangeSlider be responsible for managing the state here or does the parent have to handle it for rerender?
export function RangeSlider(props: RangeSliderProps) {
  const [minValue, setSliderMin] = useState(props.min);
  const [maxValue, setSliderMax] = useState(props.max);
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = parseFloat(event.target.value);
    // the new min value is the value from the event.
    // it should not exceed the current max value!
    const newMin = Math.min(value, maxValue - props.step);
    setSliderMin(newMin);
    props.setBounds(newMin, maxValue, props.name);
  };
  
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = parseFloat(event.target.value);
    // the new max value is the value from the event.
    // it must not be less than the current min value!
    const newMax = Math.max(value, minValue + props.step);
    setSliderMax(newMax);
    props.setBounds(minValue, newMax, props.name);
  };

  const minPos = ((minValue - props.min) / (props.max - props.min)) * 100;
  const maxPos = ((maxValue - props.min) / (props.max - props.min)) * 100;

  return (
    <div className="RangeSlider">
      <div className={"sliders-wrapper"} >
        <input
          name={props.name + ' minimum value'}
          className="min-slider"
          type="range"
          value={minValue}
          min={props.min}
          max={props.max}
          step={props.step}
          onChange={handleMinChange}
        />
        <input
          name={props.name + ' maximum value'}
          className="max-slider"
          type="range"
          value={maxValue}
          min={props.min}
          max={props.max}
          step={props.step}
          onChange={handleMaxChange}
        />
      </div>
      <div className="control-wrapper">
        <div className={"control"} style={{ left: `${minPos}%`, background: props.color}} />
        <div className="rail">
          <div
            className="inner-rail" 
            style={{ left: `${minPos}%`, right: `${100 - maxPos}%`, background: props.color}}
          />
        </div>
        <div className="control" style={{ left: `${maxPos}%`, background: props.color}} />
      </div>
    </div>
    
  );
};

export default RangeSlider;