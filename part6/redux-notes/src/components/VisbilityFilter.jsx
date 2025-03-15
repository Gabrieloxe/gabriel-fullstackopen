import { filterChange } from '../reducers/fiilterReducer';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Radio } from 'antd';

export const VisbilityFilter = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('ALL');
  const onChange = e => {
    setValue(e.target.value);
    dispatch(filterChange(e.target.value));
  };

  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      options={[
        { value: 'ALL', label: 'All' },
        { value: 'IMPORTANT', label: 'Important' },
        { value: 'NON-IMPORTANT', label: 'Non Important' },
      ]}
    />
  );
};
