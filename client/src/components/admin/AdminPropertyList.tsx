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
    const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
    const [assignedCountsForMultiple, setAssignedCountsForMultiple] = useState<Map<number, number>>(new Map());

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
            //Pre-check if the property can be deleted
            const response = await axios.get(`http://localhost:5000/api/property/${id}/canDelete`);
            const { canDelete, assignedCount } = response.data;

            //Update state with deletion information for possible future use in UI
            setCanDelete(canDelete);
            setAssignedCount(assignedCount);

            //Set property to delete
            const property = properties.find(p => p.id === id);
            setPropertyToDelete(property || null);

            // Step 2: Show the modal for confirmation
            setShowDeleteModal(true);
        } catch (error: any) {
            console.error('Error fetching delete info:', error);
        }
    };

    const handleConfirmDelete = async () => {
        if (!propertyToDelete) return;

        try {
            const deleteUrl = `http://localhost:5000/api/property/${propertyToDelete.id}`;
            if (!canDelete) {
                await axios.delete(deleteUrl, { params: { force: true } });
            } else {
                await axios.delete(deleteUrl);
            }

            //Update properties state to remove the deleted property
            setProperties(properties.filter((property) => property.id !== propertyToDelete.id));
        } catch (error: any) {
            console.error('Error deleting property:', error);
        } finally {
            //Close the modal and reset delete states
            setShowDeleteModal(false);
            setCanDelete(null);
            setAssignedCount(null);
            setPropertyToDelete(null);
        }
    };

    const handleDeleteSelectedProperties = async () => {
        try {
            const assignedCountsMap = new Map<number, number>();
            for (let id of selectedProperties) {
                const response = await axios.get(`http://localhost:5000/api/property/${id}/canDelete`);
                const { canDelete, assignedCount } = response.data;

                assignedCountsMap.set(id, assignedCount);

                if (!canDelete) {
                    setCanDelete(false);
                }
            }

            //Update state with assigned counts for multiple properties
            setAssignedCountsForMultiple(assignedCountsMap);

            //Show modal for confirmation
            setShowDeleteMultipleModal(true);
        } catch (error: any) {
            console.error('Error fetching delete info for multiple properties:', error);
        }
    };

    const handleConfirmDeleteMultiple = async () => {
        try {
            await Promise.all(
                selectedProperties.map(async (id) => {
                    try {
                        const deleteUrl = `http://localhost:5000/api/property/${id}`;
                        if (assignedCountsForMultiple.get(id) !== 0) {
                            // Force delete if assigned
                            await axios.delete(deleteUrl, { params: { force: true } });
                        } else {
                            await axios.delete(deleteUrl);
                        }
                    } catch (error: any) {
                        console.error(`Error deleting property with ID ${id}:`, error);
                    }
                })
            );

            // Remove deleted properties from the state
            setProperties(properties.filter((property) => !selectedProperties.includes(property.id)));
            setSelectedProperties([]);
            setDeleteMode(false);
        } catch (error: any) {
            console.error('Error deleting multiple properties:', error);
        } finally {
            // Close the modal and reset delete states
            setShowDeleteMultipleModal(false);
            setCanDelete(null);
            setAssignedCountsForMultiple(new Map());
        }
    };

    const handleCancelDeleteMultiple = () => {
        setShowDeleteMultipleModal(false);
        setCanDelete(null);
        setAssignedCountsForMultiple(new Map());
        setSelectedProperties([]);
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

    const handleSelectProperty = (id: number) => {
        setSelectedProperties((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((propertyId) => propertyId !== id)
                : [...prevSelected, id]
        );
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

            {/* Add Property Form */}
            {showAddForm && <AddPropertyForm onClose={() => setShowAddForm(false)} />}

            {/* Edit Property Form */}
            {editingProperty && (
                <EditPropertyForm
                    property={editingProperty}
                    onClose={() => setEditingProperty(null)}
                    onUpdate={handleUpdateProperty}
                />
            )}

            {/* Delete Confirmation Modal for Single Property */}
            {showDeleteModal && propertyToDelete && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Property</h3>
                        <p>
                            {canDelete
                                ? `Are you sure you want to delete the property "${propertyToDelete.propertyName}"?`
                                : `The property "${propertyToDelete.propertyName}" is assigned to ${assignedCount} product(s). Are you sure you want to delete it?`}
                        </p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleConfirmDelete}>
                                Delete
                            </button>
                            <button className="btn" onClick={handleCancelDeleteMultiple}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal for Multiple Properties */}
            {showDeleteMultipleModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Selected Properties</h3>
                        <p>
                            {Array.from(assignedCountsForMultiple.entries()).some(
                                ([, count]) => count > 0
                            )
                                ? 'Some of the selected properties are assigned to products. Are you sure you want to delete them all?'
                                : 'Are you sure you want to delete the selected properties?'}
                        </p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleConfirmDeleteMultiple}>
                                Delete
                            </button>
                            <button className="btn" onClick={handleCancelDeleteMultiple}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPropertyList;
