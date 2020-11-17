import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import ErrorMsg from '../components/ErrorMsg';

const msg=<label>example</label>;

function onClose(){
    console.log("alert closed");
}

describe('ErrorMsg suite', () => {
    test('render ErrorMsg component', () => {
        render(<ErrorMsg msg={msg}/>);
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    test('testing closing button',() => {
        render(<ErrorMsg msg={msg} onClose={onClose}/>);
        userEvent.click(screen.getByRole('button')); 
    });
});