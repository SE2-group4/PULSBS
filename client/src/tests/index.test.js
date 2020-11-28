import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

jest.mock('react-dom', () => ({ render: jest.fn() }));

describe('Application root', () => {
    it('should render without crashing', () => {
        const div = document.createElement('div');
        div.id = 'root';
        document.body.appendChild(div);
        require('../index.js');
        expect(ReactDOM.render).toHaveBeenCalledWith(<React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>, div);
    });
});