import { TaskManager } from "../../src/utils/TaskManager";
import { Task } from "../../src/utils/types";

describe("TaskManager", () => {
    describe("calculateDatesFromPosition", () => {
        test("calculates correct dates from pixel position", () => {
            const startDate = new Date(2023, 0, 1); // Jan 1
            const endDate = new Date(2023, 1, 28); // Feb 28
            const totalMonths = 2;
            const monthWidth = 150;

            // Left = 75px (25% of timeline), Width = 75px (25% of timeline)
            const { newStartDate, newEndDate } = TaskManager.calculateDatesFromPosition(
                75,
                75,
                startDate,
                endDate,
                totalMonths,
                monthWidth
            );

            // Should be around Jan 15 to Jan 30
            expect(newStartDate.getMonth()).toBe(0); // January
            expect(newStartDate.getDate()).toBeGreaterThan(10);
            expect(newEndDate.getMonth()).toBe(0); // January
        });

        test("constrains dates to timeline boundaries", () => {
            const startDate = new Date(2023, 0, 1);
            const endDate = new Date(2023, 1, 28);
            const totalMonths = 2;
            const monthWidth = 150;

            // Try to position task before timeline start
            const { newStartDate, newEndDate } = TaskManager.calculateDatesFromPosition(
                -50,
                75,
                startDate,
                endDate,
                totalMonths,
                monthWidth
            );

            // Should be constrained to start at timeline start
            expect(newStartDate.getTime()).toBe(startDate.getTime());
            expect(newEndDate.getTime()).toBeGreaterThan(startDate.getTime());
        });
    });

    describe("createUpdatedTask", () => {
        test("creates task with updated dates", () => {
            const task: Task = {
                id: "1",
                name: "Test Task",
                startDate: new Date(2023, 0, 1),
                endDate: new Date(2023, 0, 15),
                percent: 50,
            };

            const newStartDate = new Date(2023, 0, 10);
            const newEndDate = new Date(2023, 0, 25);

            const updatedTask = TaskManager.createUpdatedTask(task, newStartDate, newEndDate);

            expect(updatedTask.id).toBe("1");
            expect(updatedTask.name).toBe("Test Task");
            expect(updatedTask.startDate.getTime()).toBe(newStartDate.getTime());
            expect(updatedTask.endDate.getTime()).toBe(newEndDate.getTime());
            expect(updatedTask.percent).toBe(50); // Other properties preserved
        });
    });

    describe("calculateTaskPixelPosition", () => {
        test("calculates correct pixel position", () => {
            const task: Task = {
                id: "1",
                name: "Test Task",
                startDate: new Date(2023, 0, 15), // Middle of January
                endDate: new Date(2023, 0, 31), // End of January
            };

            const startDate = new Date(2023, 0, 1); // January
            const endDate = new Date(2023, 1, 28); // February
            const totalMonths = 2;
            const monthWidth = 150;

            const { leftPx, widthPx } = TaskManager.calculateTaskPixelPosition(
                task,
                startDate,
                endDate,
                totalMonths,
                monthWidth
            );

            // Task starts halfway through month 1 of 2
            // So left should be around 75px (25% of total width)
            expect(leftPx).toBeGreaterThan(50);
            expect(leftPx).toBeLessThan(100);

            // Task spans about half a month out of 2 months
            // So width should be around 75px (25% of total width)
            expect(widthPx).toBeGreaterThan(50);
            expect(widthPx).toBeLessThan(100);
        });

        test("constrains task to timeline boundaries", () => {
            const task: Task = {
                id: "1",
                name: "Test Task",
                startDate: new Date(2022, 11, 15), // December 15, 2022 (before timeline)
                endDate: new Date(2023, 2, 15), // March 15, 2023 (after timeline)
            };

            const startDate = new Date(2023, 0, 1); // January 1, 2023
            const endDate = new Date(2023, 1, 28); // February 28, 2023
            const totalMonths = 2;
            const monthWidth = 150;

            const { leftPx, widthPx } = TaskManager.calculateTaskPixelPosition(
                task,
                startDate,
                endDate,
                totalMonths,
                monthWidth
            );

            // Task should be constrained to start at timeline start
            expect(leftPx).toBe(0);

            // Task width should be positive
            expect(widthPx).toBeGreaterThan(20);
        });
    });

    describe("getLiveDatesFromElement", () => {
        test("returns timeline dates when element is null", () => {
            const startDate = new Date(2023, 0, 1);
            const endDate = new Date(2023, 1, 28);
            const totalMonths = 2;
            const monthWidth = 150;

            const { startDate: resultStartDate, endDate: resultEndDate } = TaskManager.getLiveDatesFromElement(
                null,
                startDate,
                endDate,
                totalMonths,
                monthWidth
            );

            expect(resultStartDate.getTime()).toBe(startDate.getTime());
            expect(resultEndDate.getTime()).toBe(endDate.getTime());
        });
    });

    describe("formatDate", () => {
        test("formats date correctly", () => {
            const date = new Date(2023, 0, 15);
            const formatted = TaskManager.formatDate(date);

            expect(formatted).toContain("Jan");
            expect(formatted).toContain("15");
            expect(formatted).toContain("2023");
        });

        test("handles invalid date", () => {
            const date = new Date("invalid");
            const formatted = TaskManager.formatDate(date);

            expect(formatted).toBe("Invalid date");
        });
    });

    describe("getDuration", () => {
        test("calculates correct duration in days", () => {
            const startDate = new Date(2023, 0, 1);
            const endDate = new Date(2023, 0, 15);

            const duration = TaskManager.getDuration(startDate, endDate);

            expect(duration).toBe(14);
        });

        test("handles dates in reverse order", () => {
            const startDate = new Date(2023, 0, 15);
            const endDate = new Date(2023, 0, 1);

            const duration = TaskManager.getDuration(startDate, endDate);

            expect(duration).toBe(14);
        });
    });

    describe("getMonthName", () => {
        test("returns correct month name", () => {
            const date = new Date(2023, 0, 1); // January
            const monthName = TaskManager.getMonthName(date);

            expect(monthName.toLowerCase()).toContain("jan");
        });

        test("handles invalid date", () => {
            const date = new Date("invalid");
            const monthName = TaskManager.getMonthName(date);

            expect(monthName).toBe("");
        });
    });

    describe("getDaysInMonth", () => {
        test("returns correct number of days", () => {
            const date = new Date(2023, 0, 1); // January has 31 days
            const days = TaskManager.getDaysInMonth(date);

            expect(days).toBe(31);
        });

        test("handles invalid date", () => {
            const date = new Date("invalid");
            const days = TaskManager.getDaysInMonth(date);

            expect(days).toBe(30); // Default fallback
        });
    });

    describe("datesOverlap", () => {
        test("correctly identifies overlapping dates", () => {
            const startA = new Date(2023, 0, 1);
            const endA = new Date(2023, 0, 15);
            const startB = new Date(2023, 0, 10);
            const endB = new Date(2023, 0, 25);

            const overlap = TaskManager.datesOverlap(startA, endA, startB, endB);

            expect(overlap).toBe(true);
        });

        test("correctly identifies non-overlapping dates", () => {
            const startA = new Date(2023, 0, 1);
            const endA = new Date(2023, 0, 10);
            const startB = new Date(2023, 0, 11);
            const endB = new Date(2023, 0, 20);

            const overlap = TaskManager.datesOverlap(startA, endA, startB, endB);

            expect(overlap).toBe(false);
        });

        test("correctly identifies adjacent dates as overlapping", () => {
            const startA = new Date(2023, 0, 1);
            const endA = new Date(2023, 0, 10);
            const startB = new Date(2023, 0, 10); // Same as endA
            const endB = new Date(2023, 0, 20);

            const overlap = TaskManager.datesOverlap(startA, endA, startB, endB);

            expect(overlap).toBe(true);
        });
    });
});
