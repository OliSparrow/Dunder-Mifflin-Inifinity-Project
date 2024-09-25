import { render, screen, fireEvent } from '@testing-library/react';
import { useAtom } from 'jotai';
import { BrowserRouter as Router } from 'react-router-dom';
import ProductList from '../components/customer/ProductList';
import { currentPageAtom, productsAtom, filterOptionAtom, sortOptionAtom } from '../atoms/productAtoms.ts';

//Mock atom and useAtom
jest.mock('jotai', () => {
    const actualJotai = jest.requireActual('jotai');
    return {
        ...actualJotai,
        useAtom: jest.fn(),
    };
});

//Define type for sortfilterpanels props
type SortFilterPanelProps = {
    setAdminMode: (value: boolean) => void;
};

//Mock child components in the product list
jest.mock('../components/customer/SortFilterPanel', () => (props: SortFilterPanelProps) => (
    <div data-testid="sort-filter-panel">
        <button onClick={() => props.setAdminMode(true)}>Toggle Admin Mode</button>
    </div>
));

//Mocking admin components
jest.mock('../components/admin/AdminProductList.tsx', () => () => <div data-testid="admin-product-list" />);
jest.mock('../components/admin/AdminSortFilterPanel.tsx', () => () => <div data-testid="admin-sort-filter-panel" />);

describe('ProductList Component', () => {
    const mockProducts = [
        { id: 1, name: 'Product 1', storage: 'In Stock', price: 100 },
        { id: 2, name: 'Product 2', storage: 'Out of Stock', price: 200 },
        { id: 3, name: 'Product 3', storage: 'Low Stock', price: 50 },
        { id: 4, name: 'Product 4', storage: 'In Stock', price: 150 },
    ];

    const setupAtoms = (
        filterOption = '',
        sortOption = '',
        currentPage = 1,
        products = mockProducts,
    ) => {
        (useAtom as jest.Mock).mockImplementation((atom) => {
            switch (atom) {
                case currentPageAtom:
                    return [currentPage, jest.fn()];
                case productsAtom:
                    return [products, jest.fn()];
                case filterOptionAtom:
                    return [filterOption, jest.fn()];
                case sortOptionAtom:
                    return [sortOption, jest.fn()];
                default:
                    return [undefined, jest.fn()];
            }
        });
    };

    //Clear all mocks before each of the tests
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders product list for customers', () => {
        setupAtoms();

        render(
            <Router>
                <ProductList />
            </Router>
        );

        expect(screen.getByTestId('sort-filter-panel')).toBeInTheDocument();
        expect(screen.queryByTestId('admin-sort-filter-panel')).not.toBeInTheDocument();
        expect(screen.queryByTestId('admin-product-list')).not.toBeInTheDocument();

        // Check products are rendered
        mockProducts.slice(0, 3).forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
            expect(screen.getByText(`${product.price}$,-`)).toBeInTheDocument();
        });

        // Check pagination
        expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });

    test('filters products based on stock status', () => {
        setupAtoms('In Stock');

        render(
            <Router>
                <ProductList />
            </Router>
        );

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 4')).toBeInTheDocument();
        expect(screen.queryByText('Product 2')).not.toBeInTheDocument(); // Filtered out
        expect(screen.queryByText('Product 3')).not.toBeInTheDocument(); // Filtered out
    });

    test('sorts products by price low to high', () => {
        setupAtoms('', 'price-low-high');

        render(
            <Router>
                <ProductList />
            </Router>
        );

        const productPrices = screen.getAllByText(/\$,-/);
        expect(productPrices[0]).toHaveTextContent('50$,-');   // Product 3
        expect(productPrices[1]).toHaveTextContent('100$,-');  // Product 1
        expect(productPrices[2]).toHaveTextContent('150$,-');  // Product 4
        expect(productPrices[3]).toHaveTextContent('200$,-');  // Product 2
    });

    test('pagination works correctly', () => {
        setupAtoms('', '', 1);

        render(
            <Router>
                <ProductList />
            </Router>
        );

        expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();

        // Next button is disabled on last page
        expect(screen.getByText('Next')).toBeDisabled();
        expect(screen.getByText('Previous')).toBeDisabled();
    });

    test('admin mode displays admin components', async () => {
        setupAtoms();

        render(
            <Router>
                <ProductList />
            </Router>
        );

        //Simulate toggling admin mode by clicking the button in mock SortFilterPanel
        fireEvent.click(screen.getByText('Toggle Admin Mode'));

        //Admin components should now be visible
        expect(await screen.findByTestId('admin-sort-filter-panel')).toBeInTheDocument();
        expect(await screen.findByTestId('admin-product-list')).toBeInTheDocument();
    });

});
