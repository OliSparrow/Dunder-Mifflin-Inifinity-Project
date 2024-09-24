import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import ProductList from "../components/ProductList";

describe("ProductList Component", () => {
    test("renders the correct number of products on the first page", () => {
        render(
            <MemoryRouter>
                <ProductList />
            </MemoryRouter>
        );

        //Check that 12 products are displayed on the first page
        const productElements = screen.getAllByText(/In Stock|Low Stock|Out of Stock/);
        expect(productElements.length).toBe(12);
    });

    test("navigates to the next page when 'Next' button is clicked", () => {
        render(
            <MemoryRouter>
                <ProductList />
            </MemoryRouter>
        );

        //Click the "Next" button
        const nextButton = screen.getByText(/Next/);
        fireEvent.click(nextButton);
    });

    test("disables 'Previous' button on the first page and 'Next' on the last page", () => {
        render(
            <MemoryRouter>
                <ProductList />
            </MemoryRouter>
        );

        //Previous button should be disabled on the first page
        const previousButton = screen.getByText(/Previous/);
        expect(previousButton).toBeDisabled();

        //Click the Next button until the last page is reached
        const nextButton = screen.getByText(/Next/);
        fireEvent.click(nextButton); //Go to page 2
        fireEvent.click(nextButton); //Last page (Aka page 3)

        //Next button should be disabled on the last page
        expect(nextButton).toBeDisabled();
    });
});
