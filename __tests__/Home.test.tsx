// __tests__/Home.test.tsx
import { expect, test } from "vitest";
import { render, screen, within } from "@testing-library/react";
// Change this import based on your actual structure:
import Home from "@/app/page"; // Next.js 13+ app router
// OR if using pages router:
// import Home from "@/pages/index";

test("Pages Router", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});

