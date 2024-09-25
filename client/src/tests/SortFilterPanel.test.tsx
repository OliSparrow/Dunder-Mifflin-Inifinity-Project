import { render, screen, fireEvent } from '@testing-library/react';
import { useAtom } from 'jotai';
import SortFilterPanel from '../components/customer/SortFilterPanel';
import { sortOptionAtom, filterOptionAtom } from '../atoms/productAtoms';

jest.mock('jotai', () => {
    const actualJotai = jest.requireActual('jotai');
    return {
        ...actualJotai,
        useAtom: jest.fn(),
    };
});

describe('SortFilterPanel Component', () => {
    const mockSetSortOption = jest.fn();
    const mockSetFilterOption = jest.fn();
    const mockSetAdminMode = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === sortOptionAtom) {
                return ['', mockSetSortOption];
            } else if (atom === filterOptionAtom) {
                return ['', mockSetFilterOption];
            }
            return [undefined, jest.fn()];
        });
    });

    test('renders correctly', () => {
        render(<SortFilterPanel setAdminMode={mockSetAdminMode} />);

        // Check that labels and selects are rendered
        expect(screen.getByLabelText('Sort by Price')).toBeInTheDocument();
        expect(screen.getByLabelText('Filter by Storage')).toBeInTheDocument();

        // Check that the Admin button is rendered
        expect(screen.getByRole('button', { name: /Admin/i })).toBeInTheDocument();
    });

    test('calls setSortOption when sort select changes', () => {
        render(<SortFilterPanel setAdminMode={mockSetAdminMode} />);

        const sortSelect = screen.getByLabelText('Sort by Price');
        fireEvent.change(sortSelect, { target: { value: 'price-low-high' } });

        expect(mockSetSortOption).toHaveBeenCalledWith('price-low-high');
    });

    test('calls setFilterOption when filter select changes', () => {
        render(<SortFilterPanel setAdminMode={mockSetAdminMode} />);

        const filterSelect = screen.getByLabelText('Filter by Storage');
        fireEvent.change(filterSelect, { target: { value: 'In Stock' } });

        expect(mockSetFilterOption).toHaveBeenCalledWith('In Stock');
    });

    test('calls setAdminMode(true) when Admin button is clicked', () => {
        render(<SortFilterPanel setAdminMode={mockSetAdminMode} />);

        const adminButton = screen.getByRole('button', { name: /Admin/i });
        fireEvent.click(adminButton);

        expect(mockSetAdminMode).toHaveBeenCalledWith(true);
    });
});
