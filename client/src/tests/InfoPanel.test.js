import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import User from "../entities/user";
import InfoPanel from "../components/InfoPanel"

const user = new User(1,"Student","Giuseppe","Conte","gc@email.com","eee");

describe('Booking Lecture Form suite', () => {
    test('Render InfoPanel component',()=>{
        render(<InfoPanel user={user}/>);
        expect(screen.getByText("1")).toBeInTheDocument()
        expect(screen.getByText("Student")).toBeInTheDocument()
        expect(screen.getByText("Giuseppe")).toBeInTheDocument()
        expect(screen.getByText("Conte")).toBeInTheDocument()
        expect(screen.getByText("gc@email.com")).toBeInTheDocument()
    });

});