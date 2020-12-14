import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ManagerReportPage from "../pages/ManagerReportPage"
import User from '../entities/user'
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import fetchMock from "jest-fetch-mock";
import moment from 'moment';
import userEvent from '@testing-library/user-event';
import Manager from '../../../server/src/entities/Manager';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});
const manager = new User(1, "MANAGER", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale");
const student = new User(2, "STUDENT", "Francesco", "Totti", "ft@ermejodeRoma.it", "Lupa")
const report = []
async function setupManagerReportPage() {
    await act(async () => {
        render(<ManagerReportPage user={manager} />)
    })
}
describe("ManagerReportPage suite", () => {

    test("Render intial page", async () => {
        await setupManagerReportPage();
        expect(screen.getByText("Choose a student search method:")).toBeInTheDocument()
    })
    test("Click on SSN Button", async () => {
        await setupManagerReportPage();
        await act(async () => {
            userEvent.click(screen.getByText("SSN"))
        });
        expect(screen.getByText("Student SSN :")).toBeInTheDocument()
    })
    test("Click on Serial Number Button", async () => {
        await setupManagerReportPage();
        await act(async () => {
            userEvent.click(screen.getByText("Serial Number"))
        });
        expect(screen.getByText("Serial Number :")).toBeInTheDocument()
    })
    test("Insert correct SSN value", async () => {
        await setupManagerReportPage();
        fetch.mockResponses([JSON.stringify(student)])
        await act(async () => {
            userEvent.click(screen.getByText("SSN"))
        });
        await act(async () => {
            userEvent.type(screen.getByTestId("textBox"), "1")
        });
        expect(screen.getByText("Francesco")).toBeInTheDocument()
    })
    test("Insert incorrect SSN value", async () => {
        await setupManagerReportPage();
        fetch.mockResponses([JSON.stringify(student), { status: 404 }])
        await act(async () => {
            userEvent.click(screen.getByText("SSN"))
        });
        await act(async () => {
            userEvent.type(screen.getByTestId("textBox"), "1")
        });
        expect(screen.getByTestId("fd")).toBeInTheDocument()
    })
    test("Error during getStudentBySSN communication", async () => {
        await setupManagerReportPage();
        fetch.mockReject(new Error(""))
        await act(async () => {
            userEvent.click(screen.getByText("SSN"))
        });
        await act(async () => {
            userEvent.type(screen.getByTestId("textBox"), "1")
        });
        expect(screen.getByText("Error during server communication")).toBeInTheDocument()
    })
    test("Insert correct Serial Number value", async () => {
        await setupManagerReportPage();
        fetch.mockResponses([JSON.stringify(student)])
        await act(async () => {
            userEvent.click(screen.getByText("Serial Number"))
        });
        await act(async () => {
            userEvent.type(screen.getByTestId("textBox"), "1")
        });
        expect(screen.getByText("Francesco")).toBeInTheDocument()
    })
    test("Insert incorrect Serial Number value", async () => {
        await setupManagerReportPage();
        fetch.mockResponses([JSON.stringify(student), { status: 404 }])
        await act(async () => {
            userEvent.click(screen.getByText("Serial Number"))
        });
        await act(async () => {
            userEvent.type(screen.getByTestId("textBox"), "1")
        });
        expect(screen.getByTestId("fd")).toBeInTheDocument()
    })
    test("Error during getStudentBySerialNumber communication", async () => {
        await setupManagerReportPage();
        fetch.mockReject(new Error(""))
        await act(async () => {
            userEvent.click(screen.getByText("Serial Number"))
        });
        await act(async () => {
            userEvent.type(screen.getByTestId("textBox"), "1")
        });
        expect(screen.getByText("Error during server communication")).toBeInTheDocument()
    })
    test("Change Date", async () => {
        /*await setupManagerReportPage();
        await act(async () => {
            userEvent.click(screen.getByText("Serial Number"))
        });
        await act(async () => {
            userEvent.click(screen.getByPlaceholderText(moment().format("DD-MM-YYYY")), moment().add("1", "days").format("DD-MM-YYYY").toString())
        });
        expect(screen.getByPlaceholderText(moment().add("1", "days").format("DD-MM-YYYY"))).toBeInTheDocument()
    */})
    test("Click on Generate Report Button", async () => {
        await setupManagerReportPage();
        fetch.mockResponses([JSON.stringify(student)], JSON.stringify(report))
        await act(async () => {
            userEvent.click(screen.getByText("Serial Number"))
        });
        await act(async () => {
            userEvent.type(screen.getByTestId("textBox"), "1")
        });
        await act(async () => {
            userEvent.click(screen.getByText("Generate Tracing Report"))
        });
        expect(screen.getByText("Generate a new report")).toBeInTheDocument()

    })

})