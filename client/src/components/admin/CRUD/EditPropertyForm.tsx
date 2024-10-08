import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import {EditPropertyFormProps, Property} from "../../types.ts";

const EditPropertyForm: React.FC<EditPropertyFormProps> = ({ property, onClose, onUpdate }) => {
    // ---- USE STATES ----
    const [propertyName, setPropertyName] = useState<string>(property.propertyName);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // ---- HANDLERS -----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (propertyName.trim() === '') {
            setError('Property name cannot be empty.');
            setIsSubmitting(false);
            return;
        }

        try {
            await axios.put(
                `http://localhost:5000/api/property/${property.id}`,
                { id: property.id, propertyName },
                { headers: { 'Content-Type': 'application/json' } }
            );
            // Manually construct the updated property
            const updatedProperty: Partial<Property> & { id: number } = {
                id: property.id,
                propertyName,
            };
            onUpdate(updatedProperty);
            onClose();
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                console.error('Error updating property:', axiosError.response.data);
                setError(axiosError.response.data.message || 'Failed to update property.');
            } else if (axiosError.request) {
                console.error('No response received:', axiosError.request);
                setError('No response from server. Please try again.');
            } else {
                console.error('Error setting up request:', axiosError.message);
                setError('Error updating property. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // ---- STYLING ----
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Edit Property</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Property Name:</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={propertyName}
                            onChange={(e) => setPropertyName(e.target.value)}
                            placeholder="Enter property name"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPropertyForm;
