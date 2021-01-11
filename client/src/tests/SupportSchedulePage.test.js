import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SupportSchedulePage from "../pages/SupportSchedulePage";
import User from '../entities/user';
import fetchMock from "jest-fetch-mock";
import userEvent from '@testing-library/user-event';
import Schedule from '../entities/schedule';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

const officer = new User(1, "SUPPORT", "Pino", "Insegno", "officer@test.it", "mercanteinfiera");

const schedules = [
    new Schedule(1, "1", 1, 1, 1, 10, 'Mon', '8:30:00', '11:30:00'),
    new Schedule(2, "2", 1, 1, 2, 10, 'Wed', '14:30:00', '16:00:00'),
];

const rooms = [{ classId: 1, description: "r1" }, { classId: 2, description: "r2" }, { classId: 3, description: "r3" }];

const courses = [
    { courseId: 1, description: "Web Application 1", code: "1" },
    { courseId: 2, description: "Data Science", code: "2" },
]

async function setupSupportSchedulePage() {
    fetch.mockResponses(
        [JSON.stringify(schedules)],
        [JSON.stringify(courses)],
        [JSON.stringify(rooms)],
    )
    await act(async () => {
        render(<SupportSchedulePage user={officer} />)
    })
}

describe("SupportSchedulePage suite", () => {
    test("render SupportSchedulePage component (API success)", async () => {
        await setupSupportSchedulePage();
        expect(screen.getByText("Select a course :")).toBeInTheDocument();
    })

    test("render SupportSchedulePage component (schedules API failure: application parse error )", async () => {
        fetch.mockResponses(
            [{}, { status: 200 }],
        )
        await act(async () => {
            render(<SupportSchedulePage user={officer} />)
        })
        //TO_DO expect
    })
    test("render SupportSchedulePage component (schedules API failure: server error)", async () => {
        fetch.mockResponses(
            [JSON.stringify({ body: "not ok" }), { status: 400 }],
        )
        await act(async () => {
            render(<SupportSchedulePage user={officer} />)
        })
        //TO_DO expect
    })
    test("render SupportSchedulePage component (schedules API failure: server parse error)", async () => {
        fetch.mockResponses(
            [{}, { status: 400 }],
        )
        await act(async () => {
            render(<SupportSchedulePage user={officer} />)
        })
        //TO_DO expect
    })
    test("render SupportSchedulePage component (schedules API failure: connection error)", async () => {
        fetch.mockRejectOnce();
        await act(async () => {
            render(<SupportSchedulePage user={officer} />)
        })
        //TO_DO expect
    })
    test("render SupportSchedulePage component (rooms API failure: application parse error)", async () => {
        fetch.mockResponses(
            [JSON.stringify(schedules), { status: 200 }],
            [JSON.stringify(courses), { status: 200 }],
            [{}, { status: 200 }]
        )
        await act(async () => {
            render(<SupportSchedulePage user={officer} />)
        })
        //TO_DO expect
    })
    test("render SupportSchedulePage component (rooms API failure: server error)", async () => {
        fetch.mockResponses(
            [JSON.stringify(schedules), { status: 200 }],
            [JSON.stringify(courses), { status: 200 }],
            [JSON.stringify({ body: "not ok" }), { status: 400 }]
        )
        await act(async () => {
            render(<SupportSchedulePage user={officer} />)
        })
        //TO_DO expect
    })
    test("render SupportSchedulePage component (rooms API failure: server parse error)", async () => {
        fetch.mockResponses(
            [JSON.stringify(schedules), { status: 200 }],
            [JSON.stringify(courses), { status: 200 }],
            [{}, { status: 400 }]
        )
        await act(async () => {
            render(<SupportSchedulePage user={officer} />)
        })
        //TO_DO expect
    })
    test("render SupportSchedulePage component (rooms API failure: connection error)", async () => {
        fetch.mockResponses(
            [JSON.stringify(schedules), { status: 200 }],
            [JSON.stringify(courses), { status: 200 }],
        ).mockRejectOnce();
        await act(async () => {
            render(<SupportSchedulePage user={officer} />)
        })
        //TO_DO expect
    })
    test("click on course select", async () => {
        await setupSupportSchedulePage();
        let items = screen.getAllByTestId("schedule-row");
        expect(items).toHaveLength(2);
        await act(async () => {
            fireEvent.change(screen.getByTestId("courseSelect"), { target: { value: "Web Application 1-1" } })
        });
        items = screen.getAllByTestId("schedule-row");
        expect(items).toHaveLength(1);
    })
    test("render FormModal component and testing selects", async () => {
        await setupSupportSchedulePage();
        expect(screen.getByText("Mon")).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByTestId('edit-1'));
        });
        expect(screen.getByTestId("form-submit").getAttribute("disabled")).toBe(""); //no changes => button disabled
        await act(async () => {
            fireEvent.change(screen.getByTestId("daySelect"), { target: { value: "Fri" } })
        });
        expect(screen.getByTestId("form-submit").getAttribute("disabled")).toBe(null); //one change => button enabled
        await act(async () => {
            fireEvent.change(screen.getByTestId("daySelect"), { target: { value: "Mon" } })
        });
        expect(screen.getByTestId("form-submit").getAttribute("disabled")).toBe(null); //no more changes => button disabled
        await act(async () => {
            userEvent.click(screen.getByTestId('form-close'));
        });
    })
    test("testing Submit (put API success )", async () => {
        await setupSupportSchedulePage();
        expect(screen.getByText("Wed")).toBeInTheDocument();
        expect(screen.getByText("r2")).toBeInTheDocument();
        expect(screen.getByText("14:30")).toBeInTheDocument();
        expect(screen.getByText("16:00")).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByTestId('edit-2'));
        });
        await act(async () => {
            fireEvent.change(screen.getByTestId("daySelect"), { target: { value: "Fri" } })
        });
        await act(async () => {
            fireEvent.change(screen.getByTestId("roomSelect"), { target: { value: '3' } })
        });
        await act(async () => {
            fireEvent.change(screen.getByTestId("stSelect"), { target: { value: "16:00" } })
        });
        //et changed to 17:30
        await act(async () => {
            fireEvent.change(screen.getByTestId("etSelect"), { target: { value: "14:30" } })
        });
        //st changed to 13:00
        await act(async () => {
            fireEvent.change(screen.getByTestId("etSelect"), { target: { value: "19:00" } })
        });
        await act(async () => {
            fireEvent.change(screen.getByTestId("stSelect"), { target: { value: "17:30" } })
        });
        fetch.mockResponseOnce(JSON.stringify({ body: "ok" }), { status: 200 });
        await act(async () => {
            userEvent.click(screen.getByTestId('form-submit'));
        });
        expect(screen.getByText("Fri")).toBeInTheDocument();
        expect(screen.getByText("r3")).toBeInTheDocument();
        expect(screen.getByText("17:30")).toBeInTheDocument();
        expect(screen.getByText("19:00")).toBeInTheDocument();
    })
    test("testing Submit (put API failure : server error)", async () => {
        await setupSupportSchedulePage();
        await act(async () => {
            userEvent.click(screen.getByTestId('edit-2'));
        });
        await act(async () => {
            fireEvent.change(screen.getByTestId("daySelect"), { target: { value: "Thu" } })
        });
        fetch.mockResponseOnce(JSON.stringify({ message: "not_ok" }), { status: 400 });
        await act(async () => {
            userEvent.click(screen.getByTestId('form-submit'));
        });
        expect(screen.getByText("SupportOfficer : not_ok")).toBeInTheDocument();
    })
    test("testing Submit (put API failure : server parse error)", async () => {
        await setupSupportSchedulePage();
        await act(async () => {
            userEvent.click(screen.getByTestId('edit-2'));
        });
        await act(async () => {
            fireEvent.change(screen.getByTestId("roomSelect"), { target: { value: '3' } })
        });
        fetch.mockResponseOnce({}, { status: 400 });
        await act(async () => {
            userEvent.click(screen.getByTestId('form-submit'));
        });
        expect(screen.getByText("SupportOfficer : Server error")).toBeInTheDocument();
    })
    test("testing Submit (put API failure : connection error)", async () => {
        await setupSupportSchedulePage();
        await act(async () => {
            userEvent.click(screen.getByTestId('edit-2'));
        });
        await act(async () => {
            fireEvent.change(screen.getByTestId("roomSelect"), { target: { value: '1' } })
        });
        fetch.mockRejectOnce();
        await act(async () => {
            userEvent.click(screen.getByTestId('form-submit'));
        });
        expect(screen.getByText("SupportOfficer : Server error")).toBeInTheDocument();
    })
});