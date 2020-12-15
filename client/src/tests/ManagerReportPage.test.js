import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ManagerReportPage from "../pages/ManagerReportPage"
import User from '../entities/user'
import fetchMock from "jest-fetch-mock";
import userEvent from '@testing-library/user-event';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});
const manager = new User(1, "MANAGER", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale");
const student = new User(2, "STUDENT", "Francesco", "Totti", "ft@ermejodeRoma.it", "Lupa")
const report = [
    new User(3, "STUDENT", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(4, "STUDENT", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(5, "STUDENT", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(6, "STUDENT", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(7, "STUDENT", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(8, "STUDENT", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(9, "STUDENT", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(10, "STUDENT", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(11, "TEACHER", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(12, "TEACHER", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale"),
    new User(13, "TEACHER", "Bobo", "Vieri", "bobo@vieri.it", "boboneNazionale")
]
const emptyReport = []

async function setupReportGeneration(report_) {
    await setupManagerReportPage();
    fetch.mockResponses([JSON.stringify(student)], JSON.stringify(report_))
    await act(async () => {
        userEvent.click(screen.getByText("Serial Number"))
    });
    await act(async () => {
        userEvent.type(screen.getByTestId("textBox"), "1")
    });
    await act(async () => {
        userEvent.click(screen.getByText("Generate Tracing Report"))
    });
}
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
    test("Clean textbox", async () => {
        await setupManagerReportPage();
        fetch.mockResponses([JSON.stringify(student)])
        await act(async () => {
            userEvent.click(screen.getByText("SSN"))
        });
        await act(async () => {
            userEvent.type(screen.getByTestId("textBox"), "1")
        });
        await act(async () => {
            userEvent.clear(screen.getByTestId("textBox"))
        });
        expect(screen.getByTestId("fd")).toBeInTheDocument()
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
    test("Click on Generate Report Button and display it", async () => {
        await setupReportGeneration(report);
        expect(screen.getByText("Generate a new report")).toBeInTheDocument()

    })

    test("Display empty report", async () => {
        await setupReportGeneration(emptyReport);
        expect(screen.getByText("The selected student had not contacts with other people")).toBeInTheDocument()
    })
    test("Change page of report", async () => {
        await setupReportGeneration(report);
        await act(async () => {
            userEvent.click(screen.getByTestId("paginationItem-2"))
        });
        expect(screen.getByText("13")).toBeInTheDocument()
    })
    test("Download PDF", async () => {
        await setupReportGeneration(report);
        await act(async () => {
            userEvent.click(screen.getByText("Download PDF"))
        });
        expect(screen.getByText("Download PDF")).toBeInTheDocument()
    })
    test("Click on generate new report", async () => {
        await setupReportGeneration(report);
        await act(async () => {
            userEvent.click(screen.getByText("Generate a new report"))
        });
        expect(screen.getByText("Choose a student search method:")).toBeInTheDocument()
    })
})