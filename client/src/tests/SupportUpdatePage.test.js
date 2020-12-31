import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SupportUpdatePage from "../pages/SupportUpdatePage"
import User from '../entities/user'
import fetchMock from "jest-fetch-mock";
import userEvent from '@testing-library/user-event';
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import moment from 'moment';
import { formatDate, parseDate } from 'react-day-picker/moment';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});
const officer = new User(1, "SUPPORT", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale");

const courses = [
    new Course(1, "Web Application 1", "2020"),
    new Course(2, "Data Science", "2020"),
]
const lecturesCourse1 = [
    new Lecture(1, 1, 1, moment().add("1", "hours").toISOString(), 600000, moment().subtract("1", "days").toISOString(), "PRESENCE"),
]
const lecturesCourse2 = [
    new Lecture(2, 2, 1, moment().add("3", "hours").toISOString(), 600000, moment().add("5", "minutes").toISOString(), "REMOTE"),
]

async function setupSupportUpdatePage() {
    fetch.mockResponses(
        [JSON.stringify(courses)],
        [JSON.stringify(lecturesCourse1)],
        [JSON.stringify(lecturesCourse2)]
    )
    await act(async () => {
        render(<SupportUpdatePage user={officer} />)
    })
}
describe("SupportUpdatePage suite", () => {

    test("Render intial page", async () => {
        await setupSupportUpdatePage();
        expect(screen.getByText("Select a course :")).toBeInTheDocument()
    })

    test("Error in fetch courses - Server error", async () => {
        fetch.mockResponses([{}, { status: 404 }])
        await act(async () => {
            render(<SupportUpdatePage user={officer} />)
        })
        expect(screen.getByText("Ops, an error occured during server communication")).toBeInTheDocument()
    })

    test("Error in fetch courses - Communication error", async () => {
        fetch.mockReject(new Error(""));
        await act(async () => {
            render(<SupportUpdatePage user={officer} />)
        })
        expect(screen.getByText("Ops, an error occured during server communication")).toBeInTheDocument()
    })

    test("Error in fetch lectures - Server error", async () => {
        fetch.mockResponses([JSON.stringify(courses)]).mockReject(new Error(""));
        await act(async () => {
            render(<SupportUpdatePage user={officer} />)
        })
        expect(screen.getByText("Ops, an error occured during server communication")).toBeInTheDocument()
    })

    test("Error in fetch lectures - Communication error", async () => {
        fetch.mockResponses(
            [JSON.stringify(courses)],
            [{}, { status: 500 }]
        )
        await act(async () => {
            render(<SupportUpdatePage user={officer} />)
        })
        expect(screen.getByText("Ops, an error occured during server communication")).toBeInTheDocument()
    })

    test("Click on courses filter", async () => {
        await setupSupportUpdatePage();
        await act(async () => {
            userEvent.click(screen.getByText("All"))
        });
        expect(screen.getByTestId("Data Science")).toBeInTheDocument()
        expect(screen.getByTestId("Web Application 1")).toBeInTheDocument()
    })
    /*
        test("Select a course filter", async () => {
            await setupSupportUpdatePage();
            await act(async () => {
                userEvent.click(screen.getByTestId("All"))
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("Data Science"))
            });
            expect(screen.queryByText("Web Application 1")).not.toBeInTheDocument()
            screen.debug()
        })
        
        test("Change from filter", async () => {
            await setupSupportUpdatePage();
            await act(async () => {
                userEvent.click(screen.getByPlaceholderText("From"))
            });
            screen.debug()
        })
    
        test("Change to filter", async () => {
    
        })
    */
    test("Change delivery from presence to remote", async () => {
        await setupSupportUpdatePage();
        fetch.mockResponseOnce([{}, { status: 200 }])
        await act(async () => {
            userEvent.click(screen.getByTestId("1-button"))
        });

        expect(screen.getByTestId("1-button").innerHTML).toBe('Change to "In Presence"')
    })

    test("Change delivery from remote to presence", async () => {
        await setupSupportUpdatePage();
        screen.debug()
        fetch.mockResponseOnce([{}, { status: 200 }])
        await act(async () => {
            userEvent.click(screen.getByTestId("2-button"))
        });

        expect(screen.getByTestId("2-button").innerHTML).toBe('Change to "Remote"')
    })

    test("Change page", async () => {

    })
})