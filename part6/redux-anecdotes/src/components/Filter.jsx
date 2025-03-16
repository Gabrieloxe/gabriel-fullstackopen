import { useDispatch, useSelector } from 'react-redux';
import { filterChange } from '../reducers/FilterReducer';
import { Input } from 'antd';

const Filter = () => {
  const dispatch = useDispatch();
  const filter = useSelector(state => state.filter);

  const handleChange = event => {
    const filterValue = event.target.value;
    dispatch(filterChange(filterValue));
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      <Input
        addonBefore='filter'
        onChange={handleChange}
        value={filter}
        allowClear
        onClear={() => dispatch(filterChange(''))}
      />
    </div>
  );
};

export default Filter;
