import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { propertiesAtom } from '../../../atoms/productAtoms';
import axios from 'axios';
import { Property } from "../../types.ts";

interface AddPropertyFormProps {
    onClose: () => void;
    property?: Property;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onClose, property }) => {
    //---- ATOMS -----
    const [properties, setProperties] = useAtom(propertiesAtom);
    
    //---- USE STATES ----
    const [propertyName, setPropertyName] = useState('');

    
    //---- USE EFFECTS ----
    useEffect(() => {
        if (property) {
            setPropertyName(property.propertyName);
        }
    }, [property]);

    
    //---- HANDLERS -----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!propertyName.trim()) {
            alert('Property name is required.');
            return;
        }

        try {
            if (property) {
                //Update existing property
                const updatedProperty = { ...property, propertyName };
                await axios.put(`http://localhost:5000/api/property/${property.id}`, updatedProperty);
                setProperties(
                    properties.map((p) => (p.id === property.id ? updatedProperty : p))
                );
            } else {
                //Add new property
                const response = await axios.post('http://localhost:5000/api/property', { propertyName });
                setProperties([...properties, response.data]);
            }
            onClose();
        } catch (error) {
            console.error('Error adding/updating property:', error);
        }
    };

    //---- STYLING -----
    return (
        <div className="modal modal-open" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-bold text-lg">
                    {property ? 'Edit Property' : 'Add New Property'}
                </h3>
                <form onSubmit={handleSubmit}>
                    {/*Property Name*/}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Property Name</span>
                        </label>
                        <input
                            type="text"
                            value={propertyName}
                            onChange={(e) => setPropertyName(e.target.value)}
                            className="input input-bordered"
                            required
                        />
                    </div>

                    {/*Action Buttons*/}
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {property ? 'Update Property' : 'Add Property'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPropertyForm;
