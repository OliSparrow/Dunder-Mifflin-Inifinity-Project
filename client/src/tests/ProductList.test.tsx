import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductList from '../components/customer/ProductList';
import { Provider } from 'jotai';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock data
const mockProducts = [
    {
        id: 1,
        name: 'Product A',
        stock: 10,
        price: 100,
        discontinued: false,
    },
    {
        id: 2,
        name: 'Product B',
        stock: 1,
        price: 150,
        discontinued: false,
    },
    {
        id: 3,
        name: 'Product C',
        stock: 0,
        price: 200,
        discontinued: true,
    },
];

// Helper to render component with necessary providers
const renderComponent = () => {
    return render(
        <Provider>
            <MemoryRouter>
                <ProductList />
            </MemoryRouter>
        </Provider>
    );
};

describe('ProductList Component', () => {
    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({ data: mockProducts });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing and fetches products', async () => {
        renderComponent();

        // Wait for products to be fetched and rendered
        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/paper');
        });

        // Check if product names are rendered
        mockProducts.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    });

    test('displays correct stock icons', async () => {
        renderComponent();

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        // Product A: stock = 10 > 5 => FaCheckCircle
        expect(screen.getByTitle('In Stock')).toBeInTheDocument();

        // Product B: stock = 3 <=5 && >0 => FaExclamationCircle
        expect(screen.getByTitle('Low Stock')).toBeInTheDocument();

        // Product C: stock = 0 => FaTimesCircle
        expect(screen.getByTitle('Out of Stock')).toBeInTheDocument();
    });

    test('filters products based on stock filter', async () => {
        renderComponent();

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        // Select "In Stock" filter
        fireEvent.change(screen.getByLabelText(/filter by storage/i), {
            target: { value: 'In Stock' },
        });

        // Product A and B should be visible
        expect(screen.getByText('Product A')).toBeInTheDocument();
        expect(screen.queryByText('Product B')).toBeInTheDocument();
        expect(screen.queryByText('Product C')).not.toBeInTheDocument();

        // Select "Low Stock" filter
        fireEvent.change(screen.getByLabelText(/filter by storage/i), {
            target: { value: 'Low Stock' },
        });

        expect(screen.getByText('Product B')).toBeInTheDocument();
        expect(screen.queryByText('Product A')).not.toBeInTheDocument();
        expect(screen.queryByText('Product C')).not.toBeInTheDocument();

        // Select "Out of Stock" filter
        fireEvent.change(screen.getByLabelText(/filter by storage/i), {
            target: { value: 'Out of Stock' },
        });

        expect(screen.getByText('Product C')).toBeInTheDocument();
        expect(screen.queryByText('Product A')).not.toBeInTheDocument();
        expect(screen.queryByText('Product B')).not.toBeInTheDocument();
    });

    test('sorts products by price low to high', async () => {
        renderComponent();

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        // Select "Lowest to Highest" sort option
        fireEvent.change(screen.getByLabelText(/sort by price/i), {
            target: { value: 'price-low-high' },
        });

        // Wait for the sorting to take effect
        await waitFor(() => {
            const productCards = screen.getAllByRole('link');

            // Check the order based on the mockProducts' prices
            expect(productCards[0]).toHaveTextContent('Product A'); // $100
            expect(productCards[1]).toHaveTextContent('Product B'); // $150
            expect(productCards[2]).toHaveTextContent('Product C'); // $200
        });
    });

    test('sorts products by price high to low', async () => {
        renderComponent();

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        // Select "Highest to Lowest" sort option
        fireEvent.change(screen.getByLabelText(/sort by price/i), {
            target: { value: 'price-high-low' },
        });

        // Wait for the sorting to take effect
        await waitFor(() => {
            const productCards = screen.getAllByRole('link');

            // Check the order based on the mockProducts' prices
            expect(productCards[0]).toHaveTextContent('Product C'); // $200
            expect(productCards[1]).toHaveTextContent('Product B'); // $150
            expect(productCards[2]).toHaveTextContent('Product A'); // $100
        });
    });

    test('paginates products correctly', async () => {
        // Extend mockProducts to have more than 12 items
        const extendedProducts = Array.from({ length: 25 }, (_, index) => ({
            id: index + 1,
            name: `Product ${index + 1}`,
            stock: index % 10,
            price: 50 + index * 10,
            discontinued: false,
        }));

        mockedAxios.get.mockResolvedValueOnce({ data: extendedProducts });

        renderComponent();

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        // Check that only the first 12 products are displayed
        for (let i = 1; i <= 12; i++) {
            expect(screen.getByText(`Product ${i}`)).toBeInTheDocument();
        }
        expect(screen.queryByText('Product 13')).not.toBeInTheDocument();

        // Click "Next" button
        fireEvent.click(screen.getByText(/next/i));

        // Now, products 13-24 should be displayed (assuming 12 per page)
        for (let i = 13; i <= 24; i++) {
            expect(screen.getByText(`Product ${i}`)).toBeInTheDocument();
        }
        expect(screen.queryByText('Product 25')).not.toBeInTheDocument();

        // Click "Next" button again
        fireEvent.click(screen.getByText(/next/i));

        // Now, product 25 should be displayed
        expect(screen.getByText('Product 25')).toBeInTheDocument();
        expect(screen.queryByText('Product 24')).not.toBeInTheDocument();

        // "Next" button should be disabled on the last page
        expect(screen.getByText(/next/i)).toBeDisabled();

        // Click "Previous" button
        fireEvent.click(screen.getByText(/previous/i));

        // Products 13-24 should be visible again
        for (let i = 13; i <= 24; i++) {
            expect(screen.getByText(`Product ${i}`)).toBeInTheDocument();
        }
    });
    
    test('handles API errors gracefully', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

        // Mock console.error to suppress error logs in test output
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        renderComponent();

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        // Since the component doesn't display error messages, you might want to
        // verify that products are not rendered or handle it differently
        // For now, we'll check that no products are rendered
        mockProducts.forEach((product) => {
            expect(screen.queryByText(product.name)).not.toBeInTheDocument();
        });

        // Optionally, you can verify that console.error was called
        expect(consoleError).toHaveBeenCalledWith("Error fetching products:", expect.any(Error));

        // Restore console.error
        consoleError.mockRestore();
    });
});
