import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { propertiesAtom, Property } from '../../atoms/productAtoms';
import AddPropertyForm from './CRUD/AddPropertyForm';
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

    //---- USE EFFECTS -----
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get<Property[]>(
                    'http://localhost:5000/api/property'
                );
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
        const confirmed = window.confirm('Are you sure you want to delete this property?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/property/${id}`);
                setProperties(properties.filter((property) => property.id !== id));
            } catch (error) {
                console.error('Error deleting property:', error);
            }
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
        if (confirmed) {
            try {
                await Promise.all(
                    selectedProperties.map((id) =>
                        axios.delete(`http://localhost:5000/api/property/${id}`)
                    )
                );
                setProperties(
                    properties.filter((property) => !selectedProperties.includes(property.id))
                );
                setSelectedProperties([]);
                setDeleteMode(false);
            } catch (error) {
                console.error('Error deleting properties:', error);
            }
        }
    };

    const handleDeleteButtonClick = () => {
        if (deleteMode) {
            if (selectedProperties.length > 0) {
                // Proceed to delete selected properties
                handleDeleteSelectedProperties();
            } else {
                // Exit delete mode
                setDeleteMode(false);
                setSelectedProperties([]);
            }
        } else {
            // Enter delete mode
            setDeleteMode(true);
        }
    };

    //---- STYLING -----
    return (
        <div className="w-full p-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-4">
                <button className="btn btn-primary" onClick={handleAddPropertyClick}>
                    Add Property
                </button>

                <button
                    className={`btn ${deleteMode ? 'btn-warning' : 'btn-error'}`}
                    onClick={handleDeleteButtonClick}
                >
                    {deleteMode
                        ? selectedProperties.length > 0
                            ? `Delete Selected (${selectedProperties.length})`
                            : 'Exit Delete Mode'
                        : 'Delete Multiple'}
                </button>
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
                                            e.stopPropagation(); // Prevents triggering row click
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
                                        e.stopPropagation(); // Prevents triggering row click
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
                <AddPropertyForm
                    property={editingProperty}
                    onClose={() => setEditingProperty(null)}
                />
            )}
        </div>
    );
};

export default AdminPropertyList;
