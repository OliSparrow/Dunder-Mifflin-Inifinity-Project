import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { propertiesAtom, Property } from '../../atoms/productAtoms';
import AddPropertyForm from './CRUD/AddPropertyForm';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

const AdminPropertyList: React.FC = () => {
    //---- ATOMS -----
    const [properties, setProperties] = useAtom(propertiesAtom);

    //---- USE STATES -----
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);

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

    //---- STYLING -----
    return (
        <div className="w-full p-4">
            <button className="btn btn-primary mb-4" onClick={handleAddPropertyClick}>
                Add Property
            </button>

            <div className="overflow-x-auto shadow-md">
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>Property Name</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {properties.map((property) => (
                        <tr key={property.id}>
                            <td className="whitespace-normal break-words text-sm md:text-base p-2 md:p-4">
                                {property.property_name}
                            </td>
                            <td className="p-2 md:p-4">
                                <FaEdit
                                    className="cursor-pointer text-blue-600 mr-2"
                                    onClick={() => handleEditPropertyClick(property)}
                                />
                                <FaTrash
                                    className="cursor-pointer text-red-600"
                                    onClick={() => handleDeleteProperty(property.id)}
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
