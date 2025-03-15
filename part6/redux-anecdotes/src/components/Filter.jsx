import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { filterChange } from '../reducers/FilterReducer';
import { Input } from 'antd';

const Filter = () => {
  const [value, setValue] = useState('');

  const dispatch = useDispatch();
  const handleChange = event => {
    const filter = event.target.value;
    setValue(filter);
    dispatch(filterChange(value));
  };
  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      <Input
        addonBefore='filter'
        onChange={handleChange}
        value={value}
        allowClear
        onClear={() => setValue('')}
      />
    </div>
  );
};

export default Filter;
