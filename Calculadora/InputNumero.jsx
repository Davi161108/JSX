function InputNumero({placeholder, value, onChange}) {
    return(
        <input 
        type="number"
        placeholder={placeholder}
        value = {value}
        onChange = {onChange}
        />
    );
}

export default InputNumero;
