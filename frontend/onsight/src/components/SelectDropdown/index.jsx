import Select from 'react-select';
import './style.css';

const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#FAFAFA',
      borderRadius: '0.5rem',
      borderColor: '#E5E7EB',
      '&:hover': {
        borderColor: '#9CA3AF'
      },
      boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      '&:focus': {
        borderColor: '#3B82F6',
      },
      height: 32,
      width: '8vw',
      maxWidth: '8vw'
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected 
        ? '#03558C'  
        : isFocused 
          ? '#85CEFF'
          : undefined,
      color: isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: '#DBEAFE' // bg-blue-100
      }
    }),
    placeholder: (base) => ({
    ...base,
    color: '#7E888F', 
    fontSize: '1rem',
    fontFamily: 'Nunito-Light'
  })
}

function SelectDropdown({ options, value, setValue }) {
    return (
        <Select 
            options={options}
            defaultValue={-1}
            placeholder='Selecione'
            noOptionsMessage={() => 'Sem opções'}
            styles={customStyles}
            value={value}
            onChange={selectedItem => setValue(selectedItem)}
        />
    );
}

export default SelectDropdown;