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
        <div className="w-full p-4 bg-base-100">
            <button className="btn btn-primary mb-4" onClick={handleAddPropertyClick}>
                Add Property
            </button>

            <table className="table bg-white shadow-md table-zebra w-full">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {properties.map((property) => (
                    <tr key={property.id}>
                        <td>{property.property_name}</td>
                        <td>
                            <FaEdit
                                className="cursor-pointer text-blue-600 size-4 mr-2"
                                onClick={() => handleEditPropertyClick(property)}
                            />
                            <FaTrash
                                className="cursor-pointer text-red-600 size-4"
                                onClick={() => handleDeleteProperty(property.id)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

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
