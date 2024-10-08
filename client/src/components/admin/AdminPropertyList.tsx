import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { propertiesAtom, Property } from '../../atoms/productAtoms';
import AddPropertyForm from './CRUD/AddPropertyForm';
import EditPropertyForm from './CRUD/EditPropertyForm';
import axios from 'axios';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

const AdminPropertyList: React.FC = () => {
    //---- ATOMS -----
    const [properties, setProperties] = useAtom(propertiesAtom);

    //---- USE STATES -----
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [canDelete, setCanDelete] = useState<boolean | null>(null);
    const [assignedCount, setAssignedCount] = useState<number | null>(null);

    //---- USE EFFECTS -----
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get<Property[]>('http://localhost:5000/api/property');
                setProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, [setProperties]);

    //---- HANDLERS -----
    const handleAddPropertyClick = () => {
        setShowAddForm(true);
    };

    const handleEditPropertyClick = (property: Property) => {
        setEditingProperty(property);
    };

    const handleDeleteProperty = async (id: number) => {
        try {
            // Step 1: Pre-check if the property can be deleted
            const response = await axios.get(`http://localhost:5000/api/property/${id}/canDelete`);
            const { canDelete, assignedCount } = response.data;

            // Update state with deletion information
            setCanDelete(canDelete);
            setAssignedCount(assignedCount);

            // Step 2: Show confirmation message based on the pre-check result
            let confirmationMessage = 'Are you sure you want to delete this property?';
            if (!canDelete) {
                confirmationMessage = `Property is assigned to ${assignedCount} product(s). Are you sure you want to delete it?`;
            }

            const confirmed = window.confirm(confirmationMessage);
            if (!confirmed) {
                return;
            }

            // Step 3: Proceed with deletion, using forced deletion if necessary
            const deleteUrl = `http://localhost:5000/api/property/${id}`;
            if (!canDelete) {
                await axios.delete(deleteUrl, { params: { force: true } });
            } else {
                await axios.delete(deleteUrl);
            }

            // Step 4: Update properties state to remove the deleted property
            setProperties(properties.filter((property) => property.id !== id));

            // Reset delete states
            setCanDelete(null);
            setAssignedCount(null);
        } catch (error: any) {
            console.error('Error deleting property:', error);
        }
    };

    const handleSelectProperty = (id: number) => {
        setSelectedProperties((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((propertyId) => propertyId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelectedProperties = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete the selected properties?'
        );
        if (!confirmed) {
            return;
        }

        try {
            await Promise.all(
                selectedProperties.map(async (id) => {
                    try {
                        await axios.delete(`http://localhost:5000/api/property/${id}`);
                    } catch (error: any) {
                        if (error.response && error.response.status === 400 && error.response.data.message) {
                            const userConfirmed = window.confirm(
                                `Property with ID ${id}: ${error.response.data.message} Click OK to delete and unassign it from all products.`
                            );
                            if (userConfirmed) {
                                await axios.delete(`http://localhost:5000/api/property/${id}`, {
                                    params: { force: true },
                                });
                            }
                        } else {
                            console.error(`Error deleting property with ID ${id}:`, error);
                        }
                    }
                })
            );

            setProperties(properties.filter((property) => !selectedProperties.includes(property.id)));
            setSelectedProperties([]);
            setDeleteMode(false);
        } catch (error) {
            console.error('Error deleting properties:', error);
        }
    };

    const handleDeleteButtonClick = () => {
        if (deleteMode) {
            if (selectedProperties.length > 0) {
                handleDeleteSelectedProperties();
            } else {
                setDeleteMode(false);
                setSelectedProperties([]);
            }
        } else {
            setDeleteMode(true);
        }
    };

    const handleClearSelections = () => {
        setSelectedProperties([]);
    };

    const handleUpdateProperty = (updatedProperty: Partial<Property> & { id: number }) => {
        setProperties((prevProperties) =>
            prevProperties.map((property) =>
                property.id === updatedProperty.id ? { ...property, ...updatedProperty } : property
            )
        );
    };

    //---- STYLING -----
    return (
        <div className="w-full p-4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {!deleteMode && (
                        <button className="btn btn-primary" onClick={handleAddPropertyClick}>
                            Add Property
                        </button>
                    )}

                    <button
                        className={`btn ${deleteMode ? 'btn-error' : 'btn-error'}`}
                        onClick={handleDeleteButtonClick}
                    >
                        {deleteMode
                            ? selectedProperties.length > 0
                                ? `Delete Selected (${selectedProperties.length})`
                                : 'Exit Delete Mode'
                            : 'Delete Multiple'}
                    </button>

                    {deleteMode && (
                        <button
                            className="btn btn-outline"
                            disabled={selectedProperties.length === 0}
                            onClick={handleClearSelections}
                        >
                            {selectedProperties.length > 0
                                ? `Clear Selections (${selectedProperties.length})`
                                : 'Clear Selections'}
                        </button>
                    )}
                </div>
            </div>

            {/* Property Table */}
            <div className="overflow-x-auto shadow-md">
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>{deleteMode ? 'Select' : 'Delete'}</th>
                        <th>Property Name</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {properties.map((property) => (
                        <tr
                            key={property.id}
                            className={`${
                                deleteMode && selectedProperties.includes(property.id)
                                    ? 'bg-red-200'
                                    : ''
                            }`}
                            onClick={() => {
                                if (deleteMode) {
                                    handleSelectProperty(property.id);
                                }
                            }}
                        >
                            <td>
                                {deleteMode ? (
                                    selectedProperties.includes(property.id) ? (
                                        <FaCheck className="text-green-600" />
                                    ) : (
                                        <span></span>
                                    )
                                ) : (
                                    <FaTrash
                                        className="cursor-pointer text-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProperty(property.id);
                                        }}
                                    />
                                )}
                            </td>
                            <td className="whitespace-normal break-words text-sm md:text-base p-2 md:p-4">
                                {property.propertyName}
                            </td>
                            <td className="p-2 md:p-4">
                                <FaEdit
                                    className="cursor-pointer text-blue-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditPropertyClick(property);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showAddForm && <AddPropertyForm onClose={() => setShowAddForm(false)} />}

            {editingProperty && (
                <EditPropertyForm
                    property={editingProperty}
                    onClose={() => setEditingProperty(null)}
                    onUpdate={handleUpdateProperty}
                />
            )}
        </div>
    );
};

export default AdminPropertyList;
