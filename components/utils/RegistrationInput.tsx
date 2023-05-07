import React, { ChangeEvent, useState } from 'react';

type Props = {
    setValid:(valid:boolean)=>void;
    setRegistrationValue:(value:string)=>void;
}

const RegistrationInput = ({setRegistrationValue,setValid}:Props) => {
    const [value, setValue] = useState<string>('');
    const [isValidPlate, setIsValidPlate] = useState<boolean>(false);

    const checkPlateValidity = (plateNumber:string) => {
        const regex = /[A-HJ-NP-TV-Z]{2}[\s-]{0,1}[0-9]{3}[\s-]{0,1}[A-HJ-NP-TV-Z]{2}|[0-9]{2,4}[\s-]{0,1}[A-Z]{1,3}[\s-]{0,1}[0-9]{2}/gm;
        return regex.test(plateNumber);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const plateNumber = e.target.value;
        setValue(plateNumber);
        const valid = checkPlateValidity(plateNumber)
        setValid(valid)
        setRegistrationValue(plateNumber)
        setIsValidPlate(valid);
    };

    return (
        <input
            className={`input-colorless font-bold ${value.length > 0 ? isValidPlate ? "text-green-500" : "text-red-500" : "text-gray-900"}`}
            type="text"
            id="plateNumberInput"
            value={value}
            onChange={handleChange}
        />
    );
}

export default RegistrationInput;