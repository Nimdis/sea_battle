import styled from 'styled-components'

export const Button = styled.button`
    border: 1px solid black;
    background-color: white;
    padding: 4px 8px;
    color: black;
    cursor: pointer;

    &:hover {
        background-color: black;
        color: white;
    }

    &:focus {
        color: black;
        background-color: white;
        border-radius: 0;
        outline: none;
    }
`
