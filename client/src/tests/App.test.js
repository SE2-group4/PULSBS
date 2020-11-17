import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
 
describe('App suite', () => {
    test('render App component (into login page)', () => {
        const history = createMemoryHistory()
        render(
            <Router history={history}>
                <App />
            </Router>
        );
        expect(screen.getByText("Log-in to your account")).toBeInTheDocument();
    });
});
